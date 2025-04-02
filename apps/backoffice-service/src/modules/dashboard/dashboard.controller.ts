import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags(SERVICE_NAME)
@Controller('api/dashboard')
//@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getDashboardMetrics() {
    return await this.dashboardService.getDashboardMetrics();
  }
}
