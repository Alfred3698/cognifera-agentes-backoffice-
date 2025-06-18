import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DBModule } from '../db-module/module';
import { UdgConfigParamService } from '../elasticsearch/udgConfigParamService';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { LoggerModule } from '@b-accel-logger/logger.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [DBModule, LoggerModule.forRoot({ context: 'Backoffice module' })],
  controllers: [UsersController],
  providers: [
    UsersService,
    UdgConfigParamService,
    ElasticsearchService,
    MailService,
  ],
  exports: [UdgConfigParamService, ElasticsearchService],
})
export class UsersModule {}
