import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import { DashboardService } from './dashboard.service';
import {
  DashboardResponseDto,
  GetFilteredConversationsDto,
} from './dashboard.dto';

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

  @Get('filtered')
  @ApiOperation({
    summary: 'Obtener conversaciones filtradas por fecha',
    description:
      'Este endpoint devuelve las conversaciones filtradas por un rango de fechas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversaciones filtradas obtenidas exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Error en la solicitud. Asegúrate de que las fechas sean válidas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async getFilteredConversations(
    @Query() query: GetFilteredConversationsDto,
  ): Promise<any> {
    const { startDate, endDate } = query;
    return await this.dashboardService.getFilteredConversations(
      startDate,
      endDate,
    );
  }

  @Get('filtered/download')
  @ApiOperation({
    summary: 'Descargar conversaciones filtradas en formato Excel',
    description:
      'Este endpoint genera y descarga un archivo Excel con las conversaciones filtradas por un rango de fechas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado y descargado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Error en la solicitud. Asegúrate de que las fechas sean válidas.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async downloadFilteredConversationsExcel(
    @Query() query: GetFilteredConversationsDto,
    @Res() res: Response,
  ): Promise<void> {
    const { startDate, endDate } = query;

    try {
      const filePath =
        await this.dashboardService.getFilteredConversationsAndGenerateExcel(
          startDate,
          endDate,
        );

      // Enviar el archivo como respuesta
      res.download(filePath, (err) => {
        if (err) {
          res.status(500).send('Error al descargar el archivo.');
        }

        // Eliminar el archivo después de enviarlo
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      res.status(500).send('Error al generar el archivo Excel.');
    }
  }
}
