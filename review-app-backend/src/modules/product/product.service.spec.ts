import { NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { Test } from '@nestjs/testing';

const mockProductRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
})

const mockProducts = [
  { id: 1, title: 'Testing Product', rating: 0, save: jest.fn().mockReturnThis() }
]

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService, { provide: ProductRepository, useFactory: mockProductRepository }],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  })

  describe('findAll', () => {
    it('gets all product from the repository', async () => {
      productRepository.find.mockResolvedValue(mockProducts);

      expect(productRepository.find).not.toHaveBeenCalled();
      const products = await productService.findAll();
      expect(productRepository.find).toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
    })
  })

  describe('create', () => {
    it('call productRepository.create() and return new product', async () => {
      const createProductDto = { title: 'Testing Product' }
      productRepository.create.mockReturnValue(mockProducts[0]);

      expect(productRepository.create).not.toHaveBeenCalled();

      const product = await productService.create(createProductDto);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(product.save).toHaveBeenCalled();
      expect(product).toEqual(mockProducts[0]);
    })
  })

  describe('findOne', () => {
    it('call productRepository.findOne() and successfully retrieve and return the product', async () => {
      productRepository.findOne.mockResolvedValue(mockProducts[0]);

      const product = await productService.findOne(1);
      expect(product).toEqual(mockProducts[0]);
      expect(productRepository.findOne).toHaveBeenCalledWith(mockProducts[0].id, { relations: [] });
    })

    it('throws an error as product is not found', async () => {
      productRepository.findOne.mockResolvedValue(null);
      await expect(productService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('update', () => {
    it('call productRepository.update() and return updated product', async () => {
      const mockProduct = { id: 1, title: 'New Product', save: jest.fn().mockReturnThis() };
      const updateProductDto = { title: 'Updated Product' }
      const mockUpdatedProduct = { ...mockProduct, ...updateProductDto };
      productRepository.findOne.mockResolvedValue(mockProduct);
      productRepository.create.mockReturnValue(mockUpdatedProduct);

      expect(productRepository.create).not.toHaveBeenCalled();

      const product = await productService.update(1, updateProductDto);
      expect(productRepository.create).toHaveBeenCalledWith(mockUpdatedProduct);
      expect(product.save).toHaveBeenCalled();
      expect(product).toEqual(mockUpdatedProduct);
    })

    it('throws an error as product is not found', async () => {
      productRepository.findOne.mockResolvedValue(null);
      await expect(productService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('removeProduct', () => {
    it('call productRepository.remove() to delete product', async () => {
      productRepository.findOne.mockResolvedValue(mockProducts[0]);
      expect(productRepository.remove).not.toHaveBeenCalled();
      const result = await productService.remove(1);
      expect(productRepository.remove).toHaveBeenCalledWith(mockProducts[0]);
      expect(result).toEqual({ "message": "Product succesfully deleted" })
    })

    it('throws an error as product could not found', async () => {
      productRepository.findOne.mockResolvedValue(null);
      await expect(productService.remove(1)).rejects.toThrow(NotFoundException);
    });
  })
});
