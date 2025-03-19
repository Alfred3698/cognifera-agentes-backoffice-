import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';
import { PropertiesDBService } from '../db-module/properties.service';
import { TestMe } from '../../database/entities/test-me.entity';
import { ChatRequest } from './backoffice.dto';
@Injectable()
export class BackofficeService {
  constructor(
    private readonly propertiesDBService: PropertiesDBService,
    private logger: Logger,
  ) {}

  async getChat(params: ChatRequest): Promise<any> {
    const { idConversacion, pushName, q, tosearch, max } = params;
    this.logger.log('int getChat with params:', idConversacion);
    return params;
  }
}
