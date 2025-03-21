import { HttpModule, Module } from '@nestjs/common';

import { BackofficeController } from './backoffice.controller';
import { BackofficeService } from './backoffice.service';

import { LoggerModule } from '@b-accel-logger/index';
import { DBModule } from '../db-module/module';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { UdgConfigParamService } from '../elasticsearch/udgConfigParamService';
import { ConversacionesService } from '../elasticsearch/conversacionesService';
import { ChatgptService } from '../chatgpt/chatgptService';
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
  providers: [
    BackofficeService,
    UdgConfigParamService,
    ElasticsearchService,
    ConversacionesService,
    ChatgptService,
  ],
  exports: [
    UdgConfigParamService,
    ElasticsearchService,
    ConversacionesService,
    ChatgptService,
  ],
})
export class BackofficeModule {}
