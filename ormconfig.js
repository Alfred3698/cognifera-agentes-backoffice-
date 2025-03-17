/* eslint-disable @typescript-eslint/no-var-requires */
require('./config/env/env.config');
const isTest = process.env.NODE_ENV === 'test';

const reportConfig = (isCli = false) => ({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_REPORT_USERNAME,
  password: process.env.TYPEORM_REPORT_PASSWORD,
  database: process.env.TYPEORM_REPORT_DATABASE,
  synchronize: true,
  logging: true,
  entities: [
    isCli || isTest
      ? 'apps/backoffice-service/src/database/**/*.entity.ts'
      : 'dist/apps/backoffice-service/src/database/**/*.entity.js',
  ],
  migrations: [
    isCli
      ? 'apps/backoffice-service/src/database/migration/*.ts'
      : 'apps/backoffice-service/src/database/migration/*.js',
  ],
  cli: {
    migrationsDir: 'apps/backoffice-service/src/database/migration',
  },
  ssl: process.env.DB_SSL_ENABLED === 'true' ? true : false,
  extra:
    process.env.DB_SSL_ENABLED === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  keepConnectionAlive: false,
});

module.exports = {
  reportConfig,
};
