import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Model extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ precision: null, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ precision: null, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
