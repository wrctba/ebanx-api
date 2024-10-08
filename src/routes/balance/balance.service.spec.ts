import { Repository, UpdateResult } from 'typeorm';

import { BalanceEntity } from '@/database/entities';

import { BalanceService } from './balance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let balanceRepository: Repository<BalanceEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(BalanceEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    balanceService = await module.resolve<BalanceService>(BalanceService);
    balanceRepository = module.get<Repository<BalanceEntity>>(
      getRepositoryToken(BalanceEntity),
    );
  });

  describe('get', () => {
    it('should return the account balance', async () => {
      // Arrange
      const accountId = '123';
      const balanceValue = 100;
      const balance = { value: balanceValue };

      jest
        .spyOn(balanceRepository, 'findOne')
        .mockResolvedValue(balance as BalanceEntity);

      // Act
      const result = await balanceService.get(accountId);

      // Assert
      expect(result).toBe(balanceValue);
    });

    it('should return NotFoundException', async () => {
      // Arrange
      const accountId = '123';

      jest.spyOn(balanceRepository, 'findOne').mockResolvedValue(null);

      // Act / Assert
      await expect(balanceService.get(accountId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('post', () => {
    it('should create a account balance', async () => {
      // Arrange
      const account = '123';
      const value = 100;
      const id = 1;

      jest.spyOn(balanceRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(balanceRepository, 'save')
        .mockResolvedValue({ id: 1 } as BalanceEntity);

      // Act
      const result = await balanceService.post(account, value);

      // Assert
      expect(result.id).toBe(id);
      expect(result.account).toBe(account);
      expect(result.value).toBe(value);
    });

    it('should increase existent account balance', async () => {
      // Arrange
      const account = '123';
      const value = 100;
      const total = 200;
      const id = 1;
      jest
        .spyOn(balanceRepository, 'findOne')
        .mockResolvedValue({ id } as BalanceEntity);
      jest
        .spyOn(balanceRepository, 'increment')
        .mockResolvedValue({} as UpdateResult);
      jest.spyOn(balanceService, 'get').mockResolvedValue(total);

      // Act
      const result = await balanceService.post(account, value);

      // Assert
      expect(result.id).toBe(id);
      expect(result.account).toBe(account);
      expect(result.value).toBe(total);
    });
  });

  describe('withdraw', () => {
    it('should return erro NotFoundException', async () => {
      // Arrange
      const account = '123';
      const value = 100;

      jest.spyOn(balanceRepository, 'findOne').mockResolvedValue(null);

      // Act / Assert
      await expect(balanceService.withdraw(account, value)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return erro BadRequestException', async () => {
      // Arrange
      const account = '123';
      const value = 100;
      const id = 1;
      const total = -1;

      jest
        .spyOn(balanceRepository, 'findOne')
        .mockResolvedValue({ id } as BalanceEntity);
      jest
        .spyOn(balanceRepository, 'decrement')
        .mockResolvedValue({} as UpdateResult);
      jest.spyOn(balanceService, 'get').mockResolvedValue(total);

      // Act / Assert
      await expect(balanceService.withdraw(account, value)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should decrease existent account balance', async () => {
      // Arrange
      const account = '123';
      const value = 50;
      const total = 50;
      const id = 1;
      jest
        .spyOn(balanceRepository, 'findOne')
        .mockResolvedValue({ id } as BalanceEntity);
      jest
        .spyOn(balanceRepository, 'decrement')
        .mockResolvedValue({} as UpdateResult);
      jest.spyOn(balanceService, 'get').mockResolvedValue(total);

      // Act
      const result = await balanceService.withdraw(account, value);

      // Assert
      expect(result.id).toBe(id);
      expect(result.account).toBe(account);
      expect(result.value).toBe(value);
    });
  });

  describe('transfer', () => {
    it('should return transferred transaction', async () => {
      // Arrange
      const orig = '123';
      const origId = 1;
      const dest = '456';
      const destId = 2;
      const value = 100;

      jest
        .spyOn(balanceService, 'withdraw')
        .mockResolvedValue({ id: origId, account: orig, value });
      jest
        .spyOn(balanceService, 'post')
        .mockResolvedValue({ id: destId, account: dest, value });

      // Act
      const result = await balanceService.transfer(orig, dest, value);

      // Assert
      expect(result.origin.id).toBe(origId);
      expect(result.origin.balance).toBe(value);
      expect(result.destination.id).toBe(destId);
      expect(result.destination.balance).toBe(value);
    });
  });
});
