import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import MemoryStream = require('memorystream');
import request from 'supertest';
import { Logger, LoggerModule } from '../../src';

describe('e2e test for logger service', () => {
  it('should log to stdout in a nest service according to the log level passed', async () => {
    const stream = new MemoryStream();
    let logs = '';

    stream.on('data', (chunk: string) => {
      logs += chunk.toString();
    });

    @Injectable()
    class TestService {
      constructor(private readonly logger: Logger) {}
      someMethod() {
        this.logger.warn('Hi from some method');
        this.logger.debug('This is a debug log');
      }
    }

    @Controller('/')
    class TestController {
      constructor(private readonly service: TestService) {}
      @Get('/')
      get() {
        this.service.someMethod();
        return {};
      }
    }

    @Module({
      imports: [
        LoggerModule.forRoot({
          context: 'test service',
          level: 'info',
          destination: stream,
        }),
      ],
      controllers: [TestController],
      providers: [TestService],
    })
    class TestModule {}

    const app = await NestFactory.create(TestModule, { logger: false });

    app.useLogger(app.get(Logger));
    const server = app.getHttpServer();
    await app.init();
    await request(server).get('/');
    await app.close();

    const parsedMessageLogs = logs
      .split('\n')
      .filter((log) => log.includes('message'));

    const serviceLog = parsedMessageLogs.find((log) =>
      log.includes('Hi from some method'),
    );
    expect(serviceLog).toBeTruthy();

    const appLog = parsedMessageLogs.find((log) =>
      log.includes('Nest application successfully started'),
    );
    expect(appLog).toBeTruthy();

    const debugLogExcluded = !parsedMessageLogs.find((log) =>
      log.includes('This is a debug log'),
    );
    expect(debugLogExcluded).toBeTruthy();
  });
});
