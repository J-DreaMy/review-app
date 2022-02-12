import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
  ) { }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return product.save();
  }

  async findOne(id: number, { relations } = { relations: [] }): Promise<Product> {
    const product = await this.productRepository.findOne(id, { relations });
    if (!product) throw new NotFoundException("Product not found!");
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updatedProduct = this.productRepository.create({ ...product, ...dto });
    return updatedProduct.save();
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { "message": "Product successfully deleted" };
  }
}
