import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { TokenType } from '../prisma/generated/enums';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_SECONDS = 15 * 60;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  private async compPassword(
    password: string,
    storeHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storeHash);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Creating token
  private async createToken(
    userId: string,
    type: TokenType,
    expiresInHours: number,
  ) {
    // delete any existing token of this type for this user first
    await this.prismaService.tokens.deleteMany({
      where: { userId, type },
    });

    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    await this.prismaService.tokens.create({
      data: { token, type, expiresAt, userId },
    });

    return token;
  }

  // Now we have to validate
  private async validateToken(token: string, type: TokenType) {
    const record = await this.prismaService.tokens.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.type !== type) {
      throw new BadRequestException('Invalid token');
    }

    if (record.expiresAt < new Date()) {
      await this.prismaService.tokens.delete({ where: { token } });
      throw new BadRequestException('Token has expired');
    }

    return record;
  }

  //   User Registration method
  async registerUser(dto: RegisterUserDto) {
    const isUserExist = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (isUserExist)
      throw new ConflictException('A user with this email already exists.');

    const hashPass = await this.hashPassword(dto.password);
    const { passwordHash, hashedRefreshToken, ...user } =
      await this.prismaService.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash: hashPass,
        },
      });

    // generate verification token and send email
    const token = await this.createToken(
      user.id,
      TokenType.EMAIL_VERIFICATION,
      24,
    );
    await this.mailService.sendVerificationEmail(
      user.email,
      user.name ?? '',
      token,
    );

    return user;
  }

  // now we have to verify email
  async verifyEmail(token: string) {
    const record = await this.validateToken(
      token,
      TokenType.EMAIL_VERIFICATION,
    );

    await this.prismaService.user.update({
      where: { id: record.userId },
      data: { verified: true, verifiedAt: new Date() },
    });
    await this.prismaService.tokens.delete({ where: { token } });

    return { message: 'Email verified successfully!' };
  }

  // Now we have to reset password
  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    // deliberately vague — don't reveal whether email exists
    if (!user)
      return { message: 'If that email exists, a reset link has been sent.' };

    const token = await this.createToken(user.id, TokenType.PASSWORD_RESET, 1);
    await this.mailService.passwordResetEmail(
      user.email,
      user.name ?? '',
      token,
    );

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.validateToken(token, TokenType.PASSWORD_RESET);
    const hashPassword = await this.hashPassword(newPassword);

    await this.prismaService.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashPassword, hashedRefreshToken: null },
    });

    await this.prismaService.tokens.delete({ where: { token } });

    return { message: 'Password reset successfully. Please log in again.' };
  }

  // Access and Refresh Token generations using JwtService
  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async loginUser(dto: LoginUserDto, userAgent?: string, ipAddress?: string) {
    // Five attempts max
    const attemptsKey = `login-attempts:${dto.email}`;
    const attempts = await this.redis.get(attemptsKey);
    if (attempts && parseInt(attempts, 10) >= this.MAX_ATTEMPTS) {
      throw new ForbiddenException(
        'Too many login attempts. Try again in 15 minutes',
      );
    }

    // First find user if exist
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      await this.recordFailedAttempt(attemptsKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Confirm if password is correct
    const password = await this.compPassword(dto.password, user.passwordHash);
    if (!password) {
      await this.recordFailedAttempt(attemptsKey);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.redis.del(attemptsKey);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.sessionService.createSession(
      user.id,
      tokens.refreshToken,
      userAgent,
      ipAddress,
    );

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken: this.hashToken(tokens.refreshToken) },
    });

    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isMatch = this.hashToken(refreshToken) === user.hashedRefreshToken;
    if (!isMatch) throw new UnauthorizedException('Access denied');

    const sessionValid = await this.sessionService.validateSession(
      userId,
      refreshToken,
    );
    if (!sessionValid)
      throw new UnauthorizedException('Session expired or revoked');

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.sessionService.rotateSession(
      userId,
      refreshToken,
      tokens.refreshToken,
    );

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken: this.hashToken(tokens.refreshToken) },
    });

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // revoke specific session
      const hashedToken = this.hashToken(refreshToken);
      const session = await this.prismaService.session.findFirst({
        where: { userId, refreshToken: hashedToken },
      });
      if (session) {
        await this.sessionService.revokeSession(session.id, userId);
      }
    } else {
      // revoke all sessions
      await this.sessionService.revokeAllSessions(userId);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  // auth.service.ts — add change password method
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.compPassword(currentPassword, user.passwordHash);
    if (!isValid)
      throw new UnauthorizedException('Current password is incorrect');

    const passwordHash = await this.hashPassword(newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        hashedRefreshToken: null,
      },
    });

    return { message: 'Password changed successfully' };
  }

  private async recordFailedAttempt(key: string) {
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, this.LOCKOUT_SECONDS);
    }
  }
}
