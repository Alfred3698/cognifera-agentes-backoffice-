import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestMe } from './entities/test-me.entity';

import { databaseConfig } from '../config/database.config';
import { Users } from './entities/users.entity';
import { ApiKeys } from './entities/apikeys.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    TypeOrmModule.forFeature([TestMe, Users, ApiKeys]),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DatabaseModule {}
