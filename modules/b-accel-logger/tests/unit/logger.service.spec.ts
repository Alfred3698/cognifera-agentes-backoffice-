import { Logger } from '../../src/logger.service';
import pino, { LoggerOptions } from 'pino';
import { v4 as uuidv4 } from 'uuid';

jest.mock('pino');

describe('Logger service', () => {
  const mockedPino: any = pino;
  let context: string;
  let logger: Logger;
  let args: {
    message?: string;
    trackingId?: string;
    trace?: string;
    initOpts?: LoggerOptions;
    context?: string;
  };

  const setArgs = (initOpts: LoggerOptions) => ({
    message,
    trackingId,
    trace,
  }: {
    message: string;
    trackingId: string;
    trace: string;
  }) => {
    args.message = message;
    args.trackingId = trackingId;
    args.initOpts = initOpts;
    args.context = context;
    args.trace = trace;
  };

  beforeAll(async () => {
    mockedPino.mockImplementation((initOpts: LoggerOptions) => ({
      debug: setArgs(initOpts),
      info: setArgs(initOpts),
      warn: setArgs(initOpts),
      error: setArgs(initOpts),
    }));
  });

  beforeEach(() => {
    context = uuidv4();
    args = {};
  });

  const opts = { level: 'info' };

  describe('debug method', () => {
    it('should log the debug message and tracking id passed', async () => {
      logger = new Logger({ context, ...opts });
      logger.debug('debug message', 'test tracking');
      expect(args).toEqual({
        message: 'debug message',
        trackingId: 'test tracking',
        initOpts: { ...Logger.initOpts, ...opts },
        context,
      });
    });
  });

  describe('log method', () => {
    it('should log the info message and tracking id passed', async () => {
      logger = new Logger({ context, ...opts });
      logger.log('info message', 'test tracking');
      expect(args).toEqual({
        message: 'info message',
        trackingId: 'test tracking',
        initOpts: { ...Logger.initOpts, ...opts },
        context,
      });
    });
  });

  describe('warn method', () => {
    it('should log the warn message and tracking id passed', async () => {
      logger = new Logger({ context, ...opts });
      logger.warn('warn message', 'test tracking');
      expect(args).toEqual({
        message: 'warn message',
        trackingId: 'test tracking',
        initOpts: { ...Logger.initOpts, ...opts },
        context,
      });
    });
  });

  describe('error method', () => {
    it('should log the error stack', () => {
      const error = new Error('error object');
      logger = new Logger({ context, ...opts });
      logger.error('error object', error.stack);
      expect(args).toEqual({
        message: 'error object',
        trace: error.stack,
        initOpts: { ...Logger.initOpts, ...opts },
        context,
      });
    });

    it('should log the error message and error trace passed', async () => {
      logger = new Logger({ context, ...opts });
      logger.error('error message', 'test trace');
      expect(args).toEqual({
        message: 'error message',
        trace: 'test trace',
        initOpts: { ...Logger.initOpts, ...opts },
        context,
      });
    });
  });

  it('uses ISO datetime as timestamp by default', () => {
    //TODO: modify this to use regex for ISO date
    expect(Logger.initOpts.timestamp()).toMatch(`,"timestamp":"`);
  });

  it('formats the level to dislay level label', () => {
    const level = Logger.initOpts.formatters.level('info');
    expect(level).toEqual({ level: 'info' });
  });

  it('merges user-provided opts with default opts', () => {
    logger.log('info message with service');
    expect(args?.initOpts?.level).toEqual('info');
  });
});
