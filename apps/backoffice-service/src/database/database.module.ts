import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestMe } from './entities/test-me.entity';

import { databaseConfig } from '../config/database.config';
import { Users } from './entities/users.entity';
import { ApiKeys } from './entities/apikeys.entity';
import { UserV2 } from './entities/userV2/user.entity';
import { UserSettings } from './entities/userV2/user-settings.entity';
import { Role } from './entities/userV2/role.entity';
import { Permission } from './entities/userV2/permission.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    TypeOrmModule.forFeature([
      TestMe,
      Users,
      ApiKeys,
      UserV2,
      UserSettings,
      Role,
      Permission,
    ]),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DatabaseModule {}
