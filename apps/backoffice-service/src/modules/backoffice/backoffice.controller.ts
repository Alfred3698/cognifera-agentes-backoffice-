import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';
import { BackofficeService } from './backoffice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ChatRequest,
  UpdateConfigParamDto,
  updateConfigPreguntasYRespuestas,
  updateConfigRestricciones,
  UpdateGenetic,
} from './backoffice.dto';

@ApiTags(SERVICE_NAME)
@Controller('api/conversacion')
//@UseGuards(JwtAuthGuard)
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post('chat')
  async getChat(@Body() params: ChatRequest) {
    return await this.backofficeService.getChat(params);
  }

  @Get('config-params')
  @ApiOperation({
    summary: 'Obtener parámetros de configuración',
    description:
      'Este endpoint devuelve los parámetros de configuración desde Elasticsearch.',
  })
  @ApiResponse({
    status: 200,
    description: 'Parámetros de configuración obtenidos exitosamente.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async getConfigParams(): Promise<any> {
    return await this.backofficeService._getConfigParams();
  }

  @ApiOperation({
    summary: 'Actualizar parámetros de configuración',
    description:
      'Este endpoint permite actualizar todo el documento de configuración en Elasticsearch.',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuración actualizada exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Error en la solicitud. Asegúrate de que los datos sean válidos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @ApiBody({
    description: 'Datos para actualizar el documento de configuración',
    type: UpdateConfigParamDto,
  })
  @Patch('config-params')
  async updateConfigParam(@Body() updates: UpdateConfigParamDto): Promise<any> {
    return await this.backofficeService.updateConfigParam(updates);
  }

  @Get('config-params/entrenamiento')
  async getConfigEntrenamiento(): Promise<any> {
    return await this.backofficeService.getConfigEntrenamiento();
  }

  @Patch('config-params/entrenamiento/global')
  async updateConfigContextoGlobal(@Body() data: UpdateGenetic): Promise<any> {
    return await this.backofficeService.updateConfigContextoGlobal(data);
  }

  @Patch('config-params/entrenamiento/restricciones')
  async updateConfigRestricciones(
    @Body() data: updateConfigRestricciones,
  ): Promise<any> {
    return await this.backofficeService.updateConfigRestricciones(data);
  }

  @Patch('config-params/entrenamiento/preguntas-y-respuestas')
  async updateConfigPreguntas(
    @Body() data: updateConfigPreguntasYRespuestas,
  ): Promise<any> {
    return await this.backofficeService.updateConfigPreguntas(data);
  }
}
