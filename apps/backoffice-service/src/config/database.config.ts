import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RDS } from 'aws-sdk';
import { join, basename } from 'path';

const logger = new Logger('DatabaseConfig');

export const getRDSAuthToken = (username: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const signer = new RDS.Signer({
      region: process.env.AWS_REGION,
      hostname: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
    });

    signer.getAuthToken({ username }, (err, token) => {
      err && reject(err);
      token && resolve(token);
    });
  });

export const generateDynamicPassword = async (): Promise<string> => {
  logger.log('New generateDynamicPassword');
  if (process.env.CSP === 'AWS') {
    try {
      return await getRDSAuthToken(process.env.TYPEORM_REPORT_DATABASE);
    } catch (error) {
      logger.error('Error ocurred in generateDynamicPassword');
    }
  }
  return process.env.TYPEORM_REPORT_PASSWORD;
};

export const dbRefreshConnection = async (connection: any) => {
  logger.log('new refresh connection');
  try {
    const newPassword = await generateDynamicPassword();

    if (connection.manager.connection.isConnected) {
      await connection.manager.connection.close();
    }

    connection.manager.connection.options.password = newPassword;

    if (!connection.manager.connection.isConnected) {
      await connection.manager.connection.connect();
    }
  } catch (error) {
    logger.error('Error has occurred in dbRefreshConnection');
  }
};

export const databaseConfig = async (
  dirname: string,
): Promise<TypeOrmModuleOptions> => {
  const migrationsPath = [];
  const extra = {};
  let ssl = false;
  let migrationsRun = false;
  let logging = false;

  if (process.env.DB_SSL_ENABLED === 'true') {
    ssl = true;
    extra['ssl'] = { rejectUnauthorized: false };
  }

  if (dirname) {
    const serviceName = basename(join(dirname, '../'));
    const path = `dist/apps/${serviceName}/src/database/migrations/*{.ts,.js}`;
    migrationsPath.push(path);
    migrationsRun = true;
    logging = true;
  }

  return {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_REPORT_USERNAME,
    database: process.env.TYPEORM_REPORT_DATABASE,
    password: generateDynamicPassword,
    autoLoadEntities: true,
    migrations: migrationsPath,
    migrationsRun,
    logging,
    ssl,
    extra,
    keepConnectionAlive: true,
  };
};
