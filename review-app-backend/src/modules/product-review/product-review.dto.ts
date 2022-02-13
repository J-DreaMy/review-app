import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { IsRatingValid } from "../../common/validators/is-rating-valid.validator";

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

  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  @IsRatingValid()
  rating: number;
}

export class UpdateProductReviewDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(5)
  @IsRatingValid()
  rating: number;
}
