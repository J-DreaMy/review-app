import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductQuery {
  @IsOptional()
  @IsString()
  productId: number;
}

export class CreateProductReviewDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;
}

export class UpdateProductReviewDto extends CreateProductReviewDto { }
