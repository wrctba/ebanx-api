import { BalanceEntity, EventEntity } from '@/database/entities';
import { Injectable, Scope } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ResetService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async post() {
    await this.eventRepository.clear();
    await this.balanceRepository.clear();
    return 'OK';
  }
}
