import { Product } from './product.entity';

describe('Product', () => {
  let product: Product;

  beforeEach(async () => {
    product = new Product();
    product.rating = 0;
    product.totalReview = 0;
  })

  describe('calculate rating product have small amount ratings', () => {
    it('gets all product from the repository', async () => {
      const ratings = [3, 5];
      for (const rating of ratings) product.calculateNewRating(rating);
      expect(product.rating).toEqual(4);
      expect(product.totalReview).toEqual(2);
    })
  })

  describe('calculate rating product have all zero rating', () => {
    it('gets all product from the repository', async () => {
      const ratings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (const rating of ratings) product.calculateNewRating(rating);
      expect(product.rating).toEqual(0);
      expect(product.totalReview).toEqual(10);
    })
  })

  describe('calculate rating product have best rating', () => {
    it('gets all product from the repository', async () => {
      const ratings = [5, 5, 5, 5, 5, 5];
      for (const rating of ratings) product.calculateNewRating(rating);
      expect(product.rating).toEqual(5);
      expect(product.totalReview).toEqual(6);
    })
  })

  describe('calculate rating product have medium amount ratings', () => {
    it('gets all product from the repository', async () => {
      const ratings = [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5];
      for (const rating of ratings) product.calculateNewRating(rating);
      expect(product.rating).toEqual(3.1875);
      expect(product.totalReview).toEqual(16);
    })
  })
})
