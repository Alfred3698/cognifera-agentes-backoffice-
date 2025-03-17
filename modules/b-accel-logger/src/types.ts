import { DestinationStream, LoggerOptions } from 'pino';

export type LoggerInitOpts = LoggerOptions & {
  context: string;
  destination?: DestinationStream;
};
