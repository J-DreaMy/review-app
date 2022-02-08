import { AppConfigService } from './modules/config/app-config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  app.enableCors({ preflightContinue: false, exposedHeaders: ['Content-Disposition'], origin: "*" });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const { port } = config.app;
  await app.listen(port);
  logger.log(`Server start at ${port}`);
}

bootstrap();
