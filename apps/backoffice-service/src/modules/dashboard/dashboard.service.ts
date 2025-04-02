import { Injectable } from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';

import { ConversacionesService } from '../elasticsearch/conversaciones.service';
import P from 'pino';
import { DashboardResponseDto } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly conversacionesService: ConversacionesService,

    private logger: Logger,
  ) {}

  async getDashboardMetrics(): Promise<DashboardResponseDto> {
    const metrics = await this.conversacionesService.getDashboardMetrics();
    const recentActivity = await this.conversacionesService.geyRecentActivity();
    return { metrics, recentActivity };
  }
}
