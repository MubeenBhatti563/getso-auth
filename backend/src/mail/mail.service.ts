import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(config.get<string>('RESEND_API_KEY'));
    this.fromEmail = config.get<string>('RESEND_FROM_EMAIL')!;
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verificationUrl = `${this.config.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome${name ? `, ${name}` : ''}!</h2>
        <p>Please verify your email address by clicking the button below.</p>
        <p>This link expires in <strong>24 hours</strong>.</p>
        <a href="${verificationUrl}"
           style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">
          Verify Email
        </a>
        <p>Or copy this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>If you did not create an account, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      this.logger.error(`Failed to send verification email to ${to}:`, error);
      throw new Error('Failed to send verification email');
    }

    this.logger.log(`Verification email sent to ${to}`);
  }

  async passwordResetEmail(to: string, name: string, token: string) {
    const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi${name ? ` ${name}` : ''},</p>
        <p>We received a request to reset your password. Click the button below to set a new one.</p>
        <p>This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">
          Reset Password
        </a>
        <p>Or copy this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    });

    if (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      throw new Error('Failed to send password reset email');
    }

    this.logger.log(`Password reset email sent to ${to}`);
  }
}
