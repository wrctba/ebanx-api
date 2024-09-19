import { BalanceEntity } from '@/database/entities';
import { Injectable, NotFoundException, Scope } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
  ) {}

  async get(account: string) {
    const balance = await this.balanceRepository.findOne({
      select: { value: true },
      where: { account },
    });

    if (!balance) {
      throw new NotFoundException();
    }

    return balance.value;
  }
}
