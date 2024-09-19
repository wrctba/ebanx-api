import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { EventEntity } from './event.entity';

@Entity()
export class BalanceEntity extends BaseEntity {
  constructor(partial: Partial<BalanceEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ unique: true })
  account: string;

  @Column({ default: 0 })
  value: number;

  @OneToMany(() => EventEntity, (userToken) => userToken.origin)
  eventsOrigin: EventEntity[];

  @OneToMany(() => EventEntity, (userToken) => userToken.destination)
  eventsDestination: EventEntity[];
}
