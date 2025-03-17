import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/service-configuration';
import { BackofficeModule } from './modules/backoffice/backoffice.module';
import { AuthModule } from './modules/auth/auth.module';

/**
 *
 */
@Module({
  imports: [
    BackofficeModule,
    AuthModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class CebollaServiceModule {}
