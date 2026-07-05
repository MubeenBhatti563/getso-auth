import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import * as crypto from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private getSessionKey(userId: string): string {
    return `sessions:${userId}`;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const hashedToken = this.hashToken(refreshToken);

    // store in DB for persistence
    const session = await this.prismaService.session.create({
      data: {
        userId,
        refreshToken: hashedToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    // cache in Redis for fast lookup
    const sessionKey = this.getSessionKey(userId);
    await this.redis.hset(
      sessionKey,
      session.id,
      JSON.stringify({
        id: session.id,
        userAgent,
        ipAddress,
        createdAt: session.createdAt,
        expiresAt,
      }),
    );
    await this.redis.expireat(
      sessionKey,
      Math.floor(expiresAt.getTime() / 1000),
    );

    return session;
  }

  async getSessions(userId: string) {
    // try Redis first
    const sessionKey = this.getSessionKey(userId);
    const cached = await this.redis.hgetall(sessionKey);

    if (cached && Object.keys(cached).length > 0) {
      return Object.values(cached).map((s) => JSON.parse(s));
    }

    // fallback to DB
    const sessions = await this.prismaService.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions;
  }

  async revokeSession(sessionId: string, userId: string) {
    const session = await this.prismaService.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) return;

    await this.prismaService.session.delete({ where: { id: sessionId } });

    // remove from Redis cache
    const sessionKey = this.getSessionKey(userId);
    await this.redis.hdel(sessionKey, sessionId);
  }

  async revokeAllSessions(userId: string) {
    await this.prismaService.session.deleteMany({ where: { userId } });

    // clear Redis cache
    const sessionKey = this.getSessionKey(userId);
    await this.redis.del(sessionKey);
  }

  async validateSession(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const hashedToken = this.hashToken(refreshToken);
    const session = await this.prismaService.session.findFirst({
      where: {
        userId,
        refreshToken: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });

    return !!session;
  }

  async rotateSession(
    userId: string,
    oldRefreshToken: string,
    newRefreshToken: string,
  ) {
    const oldHash = this.hashToken(oldRefreshToken);
    const newHash = this.hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await this.prismaService.session.findFirst({
      where: { userId, refreshToken: oldHash },
    });

    if (!session) return;

    await this.prismaService.session.update({
      where: { id: session.id },
      data: { refreshToken: newHash, expiresAt },
    });

    // update Redis cache
    const sessionKey = this.getSessionKey(userId);
    await this.redis.hset(
      sessionKey,
      session.id,
      JSON.stringify({
        id: session.id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        createdAt: session.createdAt,
        expiresAt,
      }),
    );
  }

  async cleanExpiredSessions() {
    await this.prismaService.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
