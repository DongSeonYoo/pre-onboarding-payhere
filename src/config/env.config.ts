import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT,
  session_secret_key: process.env.SESSION_SECRET_KEY,

  postgres: {
    user: process.env.POSTGRESQL_USERNAME,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    synchronize: true,
    password: process.env.POSTGRESQL_PASSWORD,
    port: Number(process.env.POSTGRESQL_PORT) || 5432,
    max_connection: Number(process.env.POSTGRESQL_MAX_CONNECTION),
  },

  jwt: {
    access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    access_expires: process.env.JWT_ACCESS_EXPIRES_TIME,

    refresh_expires: process.env.JWT_REFRESH_EXPIRES_TIME,
    refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
};

export default env;
