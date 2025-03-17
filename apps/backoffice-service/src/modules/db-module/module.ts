import { Module } from '@nestjs/common';
import { LoggerModule } from '@b-accel-logger/index';
import { DatabaseModule } from '../../database/database.module';

import { ConnectionRefresh } from './connection.refresh';
import { PropertiesDBService } from './properties.service';
import { UsersDBService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot({ context: 'card db module' }),
  ],
  providers: [ConnectionRefresh, PropertiesDBService, UsersDBService],
  exports: [PropertiesDBService, UsersDBService],
})
export class DBModule {}
