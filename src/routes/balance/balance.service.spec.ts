import { Repository, UpdateResult } from 'typeorm';

import { BalanceEntity } from '@/database/entities';

import { BalanceService } from './balance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

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

      jest.spyOn(balanceRepository, 'exists').mockResolvedValue(false);
      jest
        .spyOn(balanceRepository, 'save')
        .mockResolvedValue({} as BalanceEntity);

      // Act
      const result = await balanceService.post(account, value);

      // Assert
      expect(result).toBe(value);
    });

    it('should increase existent account balance', async () => {
      // Arrange
      const account = '123';
      const value = 100;
      const total = 200;

      jest.spyOn(balanceRepository, 'exists').mockResolvedValue(true);
      jest
        .spyOn(balanceRepository, 'increment')
        .mockResolvedValue({} as UpdateResult);
      jest.spyOn(balanceService, 'get').mockResolvedValue(total);

      // Act
      const result = await balanceService.post(account, value);

      // Assert
      expect(result).toBe(total);
    });
  });
});
