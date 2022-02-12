import { ProductService } from './../product/product.service';
import { ProductReviewRepository } from './product-review.repository';
import { ProductReviewService } from './product-review.service';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

const mockProductReviewRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
})

const mockProductReviews = [
  { id: 1, text: 'Fantasic', productId: 1, rating: 5, save: jest.fn().mockReturnThis() },
  { id: 2, text: 'Really good', productId: 2, rating: 4, save: jest.fn().mockReturnThis() },
  { id: 3, text: 'Hmm.. okay', productId: 1, rating: 3, save: jest.fn().mockReturnThis() },
  { id: 4, text: 'So bad', productId: 2, rating: 2, save: jest.fn().mockReturnThis() },
  { id: 5, text: 'Horrible', productId: 1, rating: 2, save: jest.fn().mockReturnThis() },
]

const mockProducts = [
  { id: 1, title: "Hello World", calculateNewRating: jest.fn(), save: jest.fn().mockReturnThis() },
];

const mockProductservice = () => ({
  findOne: jest.fn(),
});

describe('ProductReviewService', () => {
  let productReviewService: ProductReviewService;
  let productReviewRepository;
  let productService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductReviewService,
        { provide: ProductReviewRepository, useFactory: mockProductReviewRepository },
        { provide: ProductService, useFactory: mockProductservice },
      ],
    }).compile();

    productReviewService = module.get<ProductReviewService>(ProductReviewService);
    productReviewRepository = module.get<ProductReviewRepository>(ProductReviewRepository);
    productService = module.get<ProductService>(ProductService);
  })

  describe('findAll', () => {
    it('gets product review by productId from the repository', async () => {
      const mockFindReviewProducts = [mockProductReviews[0], mockProductReviews[2], mockProductReviews[4]];
      productReviewRepository.find.mockResolvedValue(mockFindReviewProducts);

      expect(productReviewRepository.find).not.toHaveBeenCalled();

      const products = await productReviewService.findAll({ productId: 2 });
      expect(productReviewRepository.find).toHaveBeenCalledWith({ where: { productId: 2 } });
      expect(products).toEqual(mockFindReviewProducts);
    })
  })

  describe('create', () => {
    it('call productReviewRepository.create() and return new product review', async () => {
      const createProductReviewDto = { text: 'Fantasic', productId: 1, rating: 5 }
      productReviewRepository.create.mockReturnValue(mockProductReviews[0]);
      productService.findOne.mockResolvedValue(mockProducts[0]);

      expect(productReviewRepository.create).not.toHaveBeenCalled();

      const productReview = await productReviewService.create(createProductReviewDto);
      expect(productReviewRepository.create).toHaveBeenCalledWith(createProductReviewDto);
      expect(productReview.save).toHaveBeenCalled();
      expect(productReview.product.save).toHaveBeenCalled();
      expect(productReview.product.calculateNewRating).toHaveBeenCalled();
      expect(productReview).toEqual({ ...mockProductReviews[0], product: mockProducts[0] });
    })
  })

  describe('findOne', () => {
    it('call productReviewRepository.findOne() and return the product review', async () => {
      productReviewRepository.findOne.mockResolvedValue(mockProductReviews[0]);

      const product = await productReviewService.findOne(1);
      expect(product).toEqual(mockProductReviews[0]);
      expect(productReviewRepository.findOne).toHaveBeenCalledWith(mockProductReviews[0].id);
    })

    it('throws an error as product review is not found', async () => {
      productReviewRepository.findOne.mockResolvedValue(null);
      await expect(productReviewService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('update', () => {
    it('call productRepository.update() and return updated product review', async () => {
      const updateProductReviewDto = { text: 'Updated review', rating: 3 }
      const mockUpdatedProductReview = { ...mockProductReviews[0], ...updateProductReviewDto };
      productReviewRepository.findOne.mockResolvedValue(mockProductReviews[0]);
      productReviewRepository.create.mockReturnValue(mockUpdatedProductReview);
      productService.findOne.mockResolvedValue(mockProducts[0]);

      expect(productReviewRepository.create).not.toHaveBeenCalled();

      const productReview = await productReviewService.update(1, updateProductReviewDto);
      expect(productReviewRepository.create).toHaveBeenCalledWith(mockUpdatedProductReview);
      expect(productReview.save).toHaveBeenCalled();
      expect(productReview.product.save).toHaveBeenCalled();
      expect(productReview.product.calculateNewRating).toHaveBeenCalled();
      expect(productReview).toEqual(mockUpdatedProductReview);
    })

    it('throws an error as product review is not found', async () => {
      productReviewRepository.findOne.mockResolvedValue(null);
      await expect(productReviewService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  })

  describe('remove', () => {
    it('call productReviewRepository.remove() to delete product review', async () => {
      productReviewRepository.findOne.mockResolvedValue(mockProductReviews[0]);
      expect(productReviewRepository.remove).not.toHaveBeenCalled();
      const result = await productReviewService.remove(1);
      expect(productReviewRepository.remove).toHaveBeenCalledWith(mockProductReviews[0]);
      expect(result).toEqual({ "message": "Product review succesfully deleted" })
    })

    it('throws an error as product review could not found', async () => {
      productReviewRepository.findOne.mockResolvedValue(null);
      await expect(productReviewService.remove(1)).rejects.toThrow(NotFoundException);
    });
  })
});
