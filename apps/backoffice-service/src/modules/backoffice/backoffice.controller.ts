import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';
import { BackofficeService } from './backoffice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import {
  ChatRequest,
  UpdateConfigParamDto,
  updateConfigPreguntasYRespuestas,
  updateConfigRestricciones,
  UpdateGenetic,
} from './backoffice.dto';
import { ApiKeyGuard } from '../auth/api-key.guard';

@ApiTags(SERVICE_NAME)
@Controller('api/conversacion')
//@UseGuards(JwtAuthGuard)
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post('chat')
  async getChat(@Body() params: ChatRequest, @Req() request: Request) {
    //const { id } = (<any>request).user;
    return await this.backofficeService.getChat(
      params,
      'cd7287c6-e32a-400f-b4da-a5365e8d8f3b',
      false,
    );
  }

  @Post('chat/v2')
  @UseGuards(ApiKeyGuard)
  async getChatV2(@Body() params: ChatRequest, @Req() request: Request) {
    const { id } = (<any>request).user;
    return await this.backofficeService.getChat(params, id, false);
  }

  @Post('chat/v3')
  @UseGuards(ApiKeyGuard)
  async getChatV3(@Body() params: ChatRequest, @Req() request: Request) {
    const { id } = (<any>request).user;
    return await this.backofficeService.getChat(params, id, true);
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
  @UseGuards(JwtAuthGuard)
  async getConfigParams(@Req() request: Request): Promise<any> {
    const { userId } = (<any>request).user;
    return await this.backofficeService._getConfigParams(userId);
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
  @UseGuards(JwtAuthGuard)
  async getConfigEntrenamiento(@Req() request: Request): Promise<any> {
    const { userId } = (<any>request).user;
    return await this.backofficeService.getConfigEntrenamiento(userId);
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
