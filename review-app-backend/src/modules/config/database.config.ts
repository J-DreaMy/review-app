import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

export const database = registerAs('database', (): TypeOrmModuleOptions => ({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [join(__dirname, '../../modules/**/*.entity{.ts,.js}')],
  synchronize: process.env.DB_SYNC == 'TRUE',
  namingStrategy: new SnakeNamingStrategy(),
}),
);
