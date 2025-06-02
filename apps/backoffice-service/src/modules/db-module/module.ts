import { Module } from '@nestjs/common';
import { LoggerModule } from '@b-accel-logger/index';
import { DatabaseModule } from '../../database/database.module';

import { ConnectionRefresh } from './connection.refresh';
import { PropertiesDBService } from './properties.service';
import { UsersDBService } from './users.service';
import { ArchivoDBService } from './archivo.service';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot({ context: 'card db module' }),
  ],
  providers: [
    ConnectionRefresh,
    PropertiesDBService,
    UsersDBService,
    ArchivoDBService,
  ],
  exports: [PropertiesDBService, UsersDBService, ArchivoDBService],
})
export class DBModule {}
