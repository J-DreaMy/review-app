import { ProductReview } from './../product-review/product-review.entity';
import { Model } from 'src/common/core/model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Product extends Model {
  @Column()
  title: string;

  @Column('double', { default: 0.0 })
  rating: number;

  @Column('int', { default: 0 })
  totalReview: number;

  @OneToMany(() => ProductReview, review => review.product, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  reviews: ProductReview[];

  calculateNewRating(rating: number) {
    this.rating = this.rating * (this.totalReview - 1) / this.totalReview + rating / this.totalReview;
  }
}
