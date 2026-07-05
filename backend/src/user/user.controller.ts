// user.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../prisma/generated/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.userService.findAll(parseInt(page, 10), parseInt(limit, 10));
  }

  @Get('me')
  getMe(@GetCurrentUser('sub') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch('me')
  updateMe(
    @GetCurrentUser('sub') userId: string,
    @Body() body: { name?: string },
  ) {
    return this.userService.updateProfile(userId, body);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() body: { role: 'CUSTOMER' | 'ADMIN' },
  ) {
    return this.userService.updateRole(id, body.role);
  }

  // user.controller.ts — add delete own account route
  @Delete('me')
  deleteMe(@GetCurrentUser('sub') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
