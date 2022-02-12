import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

describe('App (e2e)', () => {
  let app: INestApplication;
  let httpServer: any

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    httpServer = app.getHttpServer();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    const connection = getConnection();
    await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    for (const entity of connection.entityMetadatas) {
      const repository = getConnection().getRepository(entity.name);
      await repository.query(`TRUNCATE ${entity.tableName};`);
    }
    await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  });

  it('create product', async () => {
    const createProductDto = { title: "The Minimalist Entrepren" }
    const res = await request(httpServer).post('/products').send(createProductDto);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(createProductDto);
  });

  it('create product with no data', async () => {
    const res = await request(httpServer).post('/products');
    expect(res.status).toBe(400);
  });

  it('create product and review, check the rating and total review product', async () => {
    {
      const createProductDto = { title: "Hello My Friends" }
      const res = await request(httpServer).post('/products').send(createProductDto);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(createProductDto);
    }

    {
      const createProductReviewDto = { productId: 2, text: "Good Good Good", rating: 4.0 }
      const res = await request(httpServer).post('/product-reviews').send(createProductReviewDto);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(createProductReviewDto);
    }

    {
      const createProductReviewDto = { productId: 2, text: "Just Okay", rating: 3.0 }
      const res = await request(httpServer).post('/product-reviews').send(createProductReviewDto);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(createProductReviewDto);
    }

    {
      const res = await request(httpServer).get('/products/2');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ title: "Hello My Friends", rating: 3.5, totalReview: 2 });
    }
  });

  it('get all products', async () => {
    const res = await request(httpServer).get('/products');
    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ title: "The Minimalist Entrepren" });
  });

  it('update a product', async () => {
    const updatedProductDto = { title: "The Minimalist Entrepren Updated" }
    const res = await request(httpServer).put('/products/1').send(updatedProductDto);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(updatedProductDto);
  });

  it('delete a product', async () => {
    const res = await request(httpServer).delete('/products/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Product successfully deleted");
  });

  it('find one removed product', async () => {
    const res = await request(httpServer).get('/products/1');
    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("Product not found!");
  });

  afterAll(async () => {
    await app.close();
  });
});
