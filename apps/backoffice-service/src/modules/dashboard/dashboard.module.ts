import { HttpModule, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { LoggerModule } from '@b-accel-logger/index';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ConversacionesService } from '../elasticsearch/conversaciones.service';
import { DashboardService } from './dashboard.service';
import { DBModule } from '../db-module/module';

/**
 *
 */
@Module({
  imports: [
    DBModule,
    HttpModule,
    LoggerModule.forRoot({ context: 'Dashboard module' }),
  ],
  controllers: [DashboardController],
  providers: [ElasticsearchService, ConversacionesService, DashboardService],
  exports: [ElasticsearchService, ConversacionesService],
})
export class DashBoardModule {}
