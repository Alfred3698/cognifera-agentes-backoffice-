import { Logger } from '@b-accel-logger/logger.service';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SERVICE_NAME } from '../../constants/common';

import { PropertiesFindParams } from './backoffice.dto';

import { BackofficeService } from './backoffice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags(SERVICE_NAME)
@Controller('backoffice')
export class BackofficeController {
  constructor(
    private readonly backofficeService: BackofficeService,
    private logger: Logger,
  ) {}

  @Get()
  //@UseGuards(JwtAuthGuard)
  async findPropertyById(@Param() params: PropertiesFindParams) {
    try {
      this.logger.log(`init controller function find Property By ${params.id}`);
      return 'Hello World';
      return await this.backofficeService.findTestMeId(params.id);
    } catch (err) {
      this.logger.error(
        `error controller function find Property By ${params.id}`,
        err,
      );
      throw err;
    }
  }
}
