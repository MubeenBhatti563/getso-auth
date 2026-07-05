import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterUserSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address!' }),
  name: z.string().min(2).max(50).optional(),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const LoginUserSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address!' }),
  password: z.string({
    error: (issue) =>
      issue.input === undefined ? 'Password is required' : 'Invalid password',
  }),
});

const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address' }),
});

const ResetPasswordSchema = z.object({
  token: z.string({ message: 'Token is required!' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' }),
});

export class RegisterUserDto extends createZodDto(RegisterUserSchema) {}
export class LoginUserDto extends createZodDto(LoginUserSchema) {}
export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
