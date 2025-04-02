import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dashboard.dto';

@ApiTags(SERVICE_NAME)
@Controller('api/dashboard')
//@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({
    summary: 'Obtener métricas del dashboard',
    description:
      'Este endpoint devuelve las métricas generales y la actividad reciente del dashboard.',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas obtenidas exitosamente.',
    type: DashboardResponseDto, // Especifica el tipo de dato de retorno
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async getDashboardMetrics(): Promise<DashboardResponseDto> {
    return await this.dashboardService.getDashboardMetrics();
  }
}
