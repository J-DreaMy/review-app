import { Product } from './../product/product.entity';
import { Model } from 'src/common/core/model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class ProductReview extends Model {
  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  productId: number;

  @Column('text')
  text: string;

  @Column('double', { default: 0.0 })
  rating: number;
}
