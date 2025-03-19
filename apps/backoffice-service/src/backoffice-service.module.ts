import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/service-configuration';
import { BackofficeModule } from './modules/backoffice/backoffice.module';
import { AuthModule } from './modules/auth/auth.module';
import { ElasticsearchService } from './modules/elasticsearch/elasticsearch.service';
import { LoggerModule } from '@b-accel-logger/logger.module';

/**
 *
 */
@Module({
  imports: [
    BackofficeModule,
    AuthModule,
    LoggerModule.forRoot({ context: 'Backoffice module' }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class BackofficeServiceModule {}
