import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Public } from './decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    const newUser = await this.authService.registerUser(dto);
    return newUser;
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() dto: LoginUserDto, @Req() req: Request) {
    return this.authService.loginUser(dto, req.headers['user-agent'], req.ip);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUser('sub') userId: string,
    @Body() body: { refreshToken?: string },
  ) {
    return this.authService.logout(userId, body.refreshToken);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  // auth.controller.ts — add change password route
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @GetCurrentUser('sub') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }
}
