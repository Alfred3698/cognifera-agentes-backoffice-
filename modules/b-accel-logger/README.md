# Pino logger for NestJS

A logging module for NestJS services using Pino for consistant logging.

## Usage

Register the logger in your nestjs application

```ts
import { Logger } from "b-accel-logger";

//unset the nestjs default logger
const app = await NestFactory.create(MyModule, { logger: false });
//setting the logger with dependency injection
app.useLogger(app.get(Logger));  
```

Import module with `LoggerModule.forRoot(options)` in your module.
`options` is of type [LoggerInitOpts](./src/types.ts).

```ts
import { LoggerModule } from "b-accel-logger";

@Module({
  imports: [LoggerModule.forRoot({context: "service name", level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info'})], 
  controllers: [AppController],
  providers: [AppService]
})
class AppModule {}
```

In your service use `Logger` - class with the following specifications-

```ts
import { Logger } from "b-accel-logger";

@Injectable()
export class AppService {
  constructor(private logger: Logger) {}
 
  getHello(): string {
    //pass message  
    this.logger.log("hello world");

    //pass message and tracking id
    this.logger.log("hello", "my tracking id");
    return 'Hello World!';
  }
}
```

## Log levels

This module provides the following 4 log levels-

1. **debug**: This level is for developers, this is similar to logging the information which you see while you are using debugger or breakpoint, like which function was called and what parameters were passed, etc. It should have the current state so that it can be helpful while debugging and finding the exact issue. The debug logs are visible only  when the NODE_ENV environment variable is set to a value other that production. Arguments that can be passed to debug logs:
  * Message(required)
  * Tracking Id(optional)
  * Data to mask(optional)
  * Error object(optional)
2. **log**: Some important messages, event messages which describe when one task is finished. For example: New User created with id xxx. This represents the just for information logs on progress. Arguments that can be passed to logs:
  * Message(required)
  * Tracking Id(optional) 
  * Data to mask(optional)
3. **warn**: These logs are the warnings and not blocking the application to continue, these provide alerts when something is wrong and the workaround is used. e.g wrong user input, retries, etc. The admins should fix these warnings in the future. Arguments that can be passed to warn logs:
  * Message(required)
  * Tracking Id(optional)
  * Data to mask(optional)
4. **error**: Something wrong happened and should be investigated on priority. E.g. database is down the communication with other microservice was unsuccessful or the required input was undefined. The primary audiences are system operators or monitoring systems. Arguments that can be passed to error logs:
  * Message(required)
  * Trace(optional)
  * Tracking Id(optional)
  * Data to mask(optional)
  * Context(optional)

## TODO

* [ ] Middleware for logging specific fields for request and response
* [ ] Decide on a format/type of log messages. (Currently keeping the type as `any`).