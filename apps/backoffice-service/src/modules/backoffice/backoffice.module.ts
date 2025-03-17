import { HttpModule, Module } from '@nestjs/common';

import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';

import { LoggerModule } from '@b-accel-logger/index';
import { DBModule } from '../db-module/module';
/**
 *
 */
@Module({
  imports: [
    DBModule,
    HttpModule,
    LoggerModule.forRoot({ context: 'Backoffice module' }),
  ],
  controllers: [BackofficeController],
  providers: [BackofficeService],
})
export class BackofficeModule {}
