import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from './env.config';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.postgres.host,
  port: env.postgres.port,
  username: env.postgres.user,
  password: env.postgres.password,
  database: env.postgres.database,
  entities: [__dirname + '/../entities/*'],
  synchronize: env.postgres.synchronize,
  logging: true,
};

export default config;
