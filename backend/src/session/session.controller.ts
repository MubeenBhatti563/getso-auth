import {
  Controller,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getSessions(@GetCurrentUser('sub') userId: string) {
    return this.sessionService.getSessions(userId);
  }

  @Delete('all')
  @HttpCode(HttpStatus.OK)
  revokeAll(@GetCurrentUser('sub') userId: string) {
    return this.sessionService.revokeAllSessions(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  revokeOne(
    @Param('id') sessionId: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.sessionService.revokeSession(sessionId, userId);
  }
}
