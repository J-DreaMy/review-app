import { ProductService } from './../product/product.service';
import { ProductReview } from './product-review.entity';
import { ProductReviewRepository } from './product-review.repository';
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductReviewDto, UpdateProductReviewDto, ProductQuery } from './product-review.dto';
import { FindConditions } from 'typeorm';

@Injectable()
export class ProductReviewService {
  constructor(
    private productReviewRepository: ProductReviewRepository,
    private productService: ProductService,
  ) { }

  async findAll(query: ProductQuery): Promise<ProductReview[]> {
    const { productId } = query;
    const find: FindConditions<ProductReview> = {};
    if (productId) find.productId = productId;
    return this.productReviewRepository.find({ where: find });
  }

  async create(dto: CreateProductReviewDto): Promise<ProductReview> {
    const productReview = this.productReviewRepository.create(dto);
    const product = await this.productService.findOne(dto.productId);
    product.calculateNewRating(productReview.rating);
    productReview.product = product;
    return productReview.save();
  }

  async findOne(id: number): Promise<ProductReview> {
    const productReview = await this.productReviewRepository.findOne(id);
    if (!productReview) throw new NotFoundException("Product review not found!");
    return productReview;
  }

  async update(id: number, dto: UpdateProductReviewDto): Promise<ProductReview> {
    const productReview = await this.findOne(id);
    const updatedProductReview = this.productReviewRepository.create({ ...productReview, ...dto });
    updatedProductReview.product = await this.productService.findOne(dto.productId);
    return updatedProductReview.save();
  }

  async remove(id: number) {
    const productReview = await this.findOne(id);
    await this.productReviewRepository.remove(productReview);
    return { "message": "Product review succesfully deleted" };
  }
}
