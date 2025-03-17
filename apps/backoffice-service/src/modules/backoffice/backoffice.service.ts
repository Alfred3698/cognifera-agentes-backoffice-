import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';
import { PropertiesDBService } from '../db-module/properties.service';
import { TestMe } from '../../database/entities/test-me.entity';
@Injectable()
export class BackofficeService {
  constructor(
    private readonly propertiesDBService: PropertiesDBService,
    private logger: Logger,
  ) {}

  async findTestMeId(id: number): Promise<TestMe> {
    try {
      this.logger.log(`init function find property by id ${id}`);
      const result = await this.propertiesDBService.findTestMeId(id);
      if (!result) {
        throw new HttpException(
          'not found for propertie',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (err) {
      this.logger.error(`error in  function find property by id ${id}`, err);
      throw err;
    }
  }
}
