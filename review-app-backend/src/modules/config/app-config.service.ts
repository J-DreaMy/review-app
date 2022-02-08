import { AppOptions } from './app.config';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Injectable()
export class AppConfigService extends ConfigService {

  get isProduction(): boolean {
    return this.app.env == 'production';
  }

  get isDevelopment(): boolean {
    return this.app.env == 'development';
  }

  get app(): AppOptions {
    return this.get('app');
  }

  get orm(): TypeOrmModuleOptions {
    return this.get('database');
  }
}
