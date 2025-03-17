import fs from 'fs';
import * as path from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const createSwaggerJson = (fileName, document) => {
  const outputPath = path.resolve(process.cwd(), fileName);
  fs.writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });
};

export const registerSwagger = (app: any, serviceName: string) => {
  const config = new DocumentBuilder()
    .setTitle(`${serviceName} service`)
    .setDescription(`The ${serviceName} service API description`)
    .setVersion('1.0')
    .addTag(serviceName)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
    operationIdFactory: (_, methodName) => {
      return methodName;
    },
  });

  createSwaggerJson(
    `documentation/swagger-docs/${serviceName}-swagger.json`,
    document,
  );

  SwaggerModule.setup('api', app, document);
};
