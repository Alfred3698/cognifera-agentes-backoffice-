import { OPTIONS } from './constants';
import { LoggerInitOpts } from './types';
import { Module, DynamicModule } from '@nestjs/common';
import { Logger } from './logger.service';

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerInitOpts): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: OPTIONS,
          useValue: options,
        },
        Logger,
      ],
      exports: [Logger],
    };
  }
}
