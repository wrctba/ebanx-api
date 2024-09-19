import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { EventEnum } from '@/types';
import { BalanceEntity } from './balance.entity';

@Entity()
export class EventEntity extends BaseEntity {
  constructor(partial: Partial<EventEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'varchar', enum: EventEnum })
  event: EventEnum;

  @ManyToOne(() => BalanceEntity, (balance) => balance.eventsOrigin)
  @JoinColumn({ name: 'originId' })
  origin: BalanceEntity;

  @Column({ nullable: true })
  originId?: number;

  @ManyToOne(() => BalanceEntity, (balance) => balance.eventsDestination)
  @JoinColumn({ name: 'destinationId' })
  destination: BalanceEntity;

  @Column({ nullable: true })
  destinationId?: number;

  @Column({ default: 0 })
  amount: number;
}
