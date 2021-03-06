import { Model } from '../../common/core/model';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductReview } from './../product-review/product-review.entity';

@Entity()
export class Product extends Model {
  @Column()
  title: string;

  @Column('double', { default: 0.0 })
  rating: number;

  @Column('int', { default: 0 })
  totalReview: number;

  @OneToMany(() => ProductReview, review => review.product, { cascade: true })
  reviews: ProductReview[];

  calculateNewRating(rating: number): void {
    this.totalReview += 1;
    this.rating = this.rating * (this.totalReview - 1) / this.totalReview + rating / this.totalReview;
  }
}
