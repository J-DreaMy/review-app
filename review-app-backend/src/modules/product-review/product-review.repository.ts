import { ProductReview } from './product-review.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ProductReview)
export class ProductReviewRepository extends Repository<ProductReview> { }
