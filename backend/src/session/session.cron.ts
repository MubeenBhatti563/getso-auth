import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from './session.service';

@Injectable()
export class SessionCron {
  constructor(private readonly sessionService: SessionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredSessions() {
    await this.sessionService.cleanExpiredSessions();
  }
}
