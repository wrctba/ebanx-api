import { EventEntity } from '@/database/entities';
import { Injectable, Scope } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPostRequest } from './dtos';
import { EventEnum } from '@/types';
import { BalanceService } from '../balance/balance.service';

@Injectable({ scope: Scope.REQUEST })
export class EventService {
  constructor(
    private readonly balanceService: BalanceService,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async post(body: EventPostRequest) {
    const { amount, destination, origin, type } = body;
    switch (type) {
      case EventEnum.deposit:
        return await this.deposit(destination, amount);

      case EventEnum.withdraw:
        return await this.withdraw(origin, amount);

      case EventEnum.transfer:
        return await this.transfer(origin, destination, amount);
    }
  }

  async deposit(destination: string, amount: number) {
    const response = await this.eventRepository.manager.transaction(
      async () => {
        const { id, value: balance } = await this.balanceService.post(
          destination,
          amount,
        );
        await this.eventRepository.save({
          type: EventEnum.deposit,
          destinationId: id,
          amount,
        });
        return { destination: { id: destination, balance } };
      },
    );
    return response;
  }

  async withdraw(origin: string, amount: number) {
    const response = await this.eventRepository.manager.transaction(
      async () => {
        const { id, value: balance } = await this.balanceService.withdraw(
          origin,
          amount,
        );
        await this.eventRepository.save({
          type: EventEnum.withdraw,
          originId: id,
          amount,
        });
        return { origin: { id: origin, balance } };
      },
    );
    return response;
  }

  async transfer(origin: string, destination: string, amount: number) {
    const response = await this.eventRepository.manager.transaction(
      async () => {
        const { origin: orig, destination: dest } =
          await this.balanceService.transfer(origin, destination, amount);
        await this.eventRepository.save({
          type: EventEnum.transfer,
          originId: orig.id,
          destinationId: dest.id,
          amount,
        });
        return {
          origin: { id: origin, balance: orig.balance },
          destination: { id: destination, balance: dest.balance },
        };
      },
    );
    return response;
  }
}
