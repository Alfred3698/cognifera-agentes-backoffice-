const dotenv = require('dotenv');

const isTest = process.env.NODE_ENV === 'test';
const envPath = isTest ? './test.env' : './dev.env';
dotenv.config({ path: envPath });

const setupEnvConfig = () => {
  return process.env;
};

setupEnvConfig();
