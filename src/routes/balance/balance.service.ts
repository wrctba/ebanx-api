import { BalanceEntity } from '@/database/entities';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';

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

  async post(account: string, value: number) {
    const balance = await this.balanceRepository.findOne({
      select: { id: true },
      where: { account },
    });
    if (balance) {
      await this.balanceRepository.increment({ account }, 'value', value);
      return { id: balance.id, account, value: await this.get(account) };
    } else {
      const response = await this.balanceRepository.save({ account, value });
      return { id: response.id, account, value };
    }
  }

  async withdraw(account: string, value: number) {
    const balance = await this.balanceRepository.findOne({
      select: { id: true },
      where: { account },
    });

    if (!balance) {
      throw new NotFoundException();
    }

    await this.balanceRepository.decrement({ account }, 'value', value);
    const response = {
      id: balance.id,
      account,
      value: await this.get(account),
    };
    if (response.value < 0) {
      throw new BadRequestException('Balance insufficient');
    }
    return response;
  }

  async transfer(origin: string, destination: string, value: number) {
    const withdraw = await this.withdraw(origin, value);
    const post = await this.post(destination, value);

    return {
      origin: { id: withdraw.id, balance: withdraw.value },
      destination: { id: post.id, balance: post.value },
    };
  }
}
