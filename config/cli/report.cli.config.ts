import { reportConfig } from '../../ormconfig.js';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// Looks like a typeorm issue where it always tries to
// get the aurora connections. We want postgresql.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const config: PostgresConnectionOptions = reportConfig(true);
export = config;
