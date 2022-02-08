import { ProductModule } from './../product/product.module';
import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { ProductReviewRepository } from './product-review.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReviewRepository]),
    ProductModule,
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule { }
