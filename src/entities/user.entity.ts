import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LedgerEntity } from './ledger.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_tb' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'char', length: 60 })
  @Exclude()
  password: string;

  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => LedgerEntity, (ledger) => ledger.userId)
  ledgers: LedgerEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;
}
