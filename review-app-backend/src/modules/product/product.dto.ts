import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateProductDto extends CreateProductDto { }
