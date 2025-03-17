import { Logger } from '@b-accel-logger/logger.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { Connection } from 'typeorm';
import { dbRefreshConnection } from '../../config/database.config';

@Injectable()
export class ConnectionRefresh implements OnModuleInit {
  constructor(
    @InjectConnection('default') private connection: Connection,
    private readonly logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    const interval =
      Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000;
    setInterval(async () => await this.bootstrap(), interval);
  }

  async bootstrap() {
    if (process.env.DB_ROTATING_KEY === 'true') {
      try {
        await dbRefreshConnection(this.connection);
      } catch (error) {
        this.logger.error('Error Ocurred in handleRotatingKey');
      }
    }
  }
}
