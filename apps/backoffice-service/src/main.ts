import 'config/env/env.config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { registerSwagger } from 'utils/swagger';
import { SERVICE_NAME } from './constants/common';
import { CebollaServiceModule } from './cebolla-service.module';
import { Logger } from '@b-accel-logger/logger.service';

const logger = new Logger({ context: 'Report Service' });

async function bootstrap() {
  const app = await NestFactory.create(CebollaServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  registerSwagger(app, SERVICE_NAME);
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.REPORT_SERVICE_PORT);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
