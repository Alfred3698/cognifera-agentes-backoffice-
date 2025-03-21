import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SERVICE_NAME } from '../../constants/common';
import { BackofficeService } from './backoffice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatRequest } from './backoffice.dto';

@ApiTags(SERVICE_NAME)
@Controller('api/v2/conversacion/chat')
//@UseGuards(JwtAuthGuard)
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post()
  async getChat(@Body() params: ChatRequest) {
    return await this.backofficeService.getChat(params);
  }
}
