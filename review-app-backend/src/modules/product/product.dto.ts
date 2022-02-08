import { IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  title: string;
}

export class UpdateProductDto extends CreateProductDto { }
