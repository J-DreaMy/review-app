import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateProductReviewDto, UpdateProductReviewDto, ProductQuery } from './product-review.dto';
import { ProductReviewService } from './product-review.service';

@Controller('product-reviews')
export class ProductReviewController {
  constructor(private productReviewService: ProductReviewService) { }

  @Get()
  findByProductId(@Query() query: ProductQuery) {
    return this.productReviewService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateProductReviewDto) {
    return this.productReviewService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productReviewService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductReviewDto) {
    return this.productReviewService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productReviewService.remove(id);
  }
}
