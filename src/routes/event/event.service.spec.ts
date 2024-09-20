import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventService } from './event.service';
import { BalanceService } from '../balance/balance.service';
import { EventEntity } from '@/database/entities';
import { EventPostRequest } from './dtos';
import { EventEnum } from '@/types';

describe('EventService', () => {
  let eventService: EventService;
  let balanceService: BalanceService;
  let eventRepository: Repository<EventEntity>;
  let manager: EntityManager;

  beforeEach(async () => {
    manager = {
      transaction: jest.fn().mockImplementation((cb) => cb()),
    } as unknown as EntityManager;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: BalanceService,
          useValue: {
            post: jest.fn(),
            withdraw: jest.fn(),
            transfer: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EventEntity),
          useValue: {
            manager,
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    eventService = await module.resolve<EventService>(EventService);
    balanceService = await module.resolve<BalanceService>(BalanceService);
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  describe('post', () => {
    it('should call deposit method for deposit event', async () => {
      const depositSpy = jest
        .spyOn(eventService, 'deposit')
        .mockResolvedValue({ destination: { id: 'dest1', balance: 100 } });
      const body: EventPostRequest = {
        amount: 100,
        destination: 'dest1',
        origin: '',
        type: EventEnum.deposit,
      };
      await eventService.post(body);
      expect(depositSpy).toHaveBeenCalledWith('dest1', 100);
    });

    it('should call withdraw method for withdraw event', async () => {
      const withdrawSpy = jest
        .spyOn(eventService, 'withdraw')
        .mockResolvedValue({ origin: { id: 'orig1', balance: 50 } });
      const body: EventPostRequest = {
        amount: 50,
        destination: '',
        origin: 'orig1',
        type: EventEnum.withdraw,
      };
      await eventService.post(body);
      expect(withdrawSpy).toHaveBeenCalledWith('orig1', 50);
    });

    it('should call transfer method for transfer event', async () => {
      const transferSpy = jest
        .spyOn(eventService, 'transfer')
        .mockResolvedValue({
          origin: { id: 'orig1', balance: 50 },
          destination: { id: 'dest1', balance: 150 },
        });
      const body: EventPostRequest = {
        amount: 100,
        destination: 'dest1',
        origin: 'orig1',
        type: EventEnum.transfer,
      };
      await eventService.post(body);
      expect(transferSpy).toHaveBeenCalledWith('orig1', 'dest1', 100);
    });
  });

  describe('deposit', () => {
    it('should save deposit event and return response', async () => {
      const saveSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({} as any);
      jest
        .spyOn(balanceService, 'post')
        .mockResolvedValue({ id: 1, account: 'dest1', value: 100 });
      const result = await eventService.deposit('dest1', 100);
      expect(saveSpy).toHaveBeenCalledWith({
        type: EventEnum.deposit,
        destinationId: 1,
        amount: 100,
      });
      expect(result).toEqual({ destination: { id: 'dest1', balance: 100 } });
    });
  });

  describe('withdraw', () => {
    it('should save withdraw event and return response', async () => {
      const saveSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({} as any);
      jest
        .spyOn(balanceService, 'withdraw')
        .mockResolvedValue({ id: 1, account: 'orig1', value: 50 });
      const result = await eventService.withdraw('orig1', 50);
      expect(saveSpy).toHaveBeenCalledWith({
        type: EventEnum.withdraw,
        originId: 1,
        amount: 50,
      });
      expect(result).toEqual({ origin: { id: 'orig1', balance: 50 } });
    });
  });

  describe('transfer', () => {
    it('should save transfer event and return response', async () => {
      const saveSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({} as any);
      jest.spyOn(balanceService, 'transfer').mockResolvedValue({
        origin: { id: 1, balance: 50 },
        destination: { id: 2, balance: 150 },
      });
      const result = await eventService.transfer('orig1', 'dest1', 100);
      expect(saveSpy).toHaveBeenCalledWith({
        type: EventEnum.transfer,
        originId: 1,
        destinationId: 2,
        amount: 100,
      });
      expect(result).toEqual({
        origin: { id: 'orig1', balance: 50 },
        destination: { id: 'dest1', balance: 150 },
      });
    });
  });
});
