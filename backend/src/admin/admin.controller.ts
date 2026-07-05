import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../prisma/generated/enums';

@Controller('admin')
export class AdminController {
  constructor() {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboard() {
    return { message: 'Welcome, admin' };
  }
}
