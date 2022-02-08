import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './modules/config/app-config.module';
import { AppConfigService } from './modules/config/app-config.service';
import { ProductReviewModule } from './modules/product-review/product-review.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => config.orm,
    }),
    ProductModule,
    ProductReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
