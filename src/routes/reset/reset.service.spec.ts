import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetService } from './reset.service';
import { BalanceEntity, EventEntity } from '@/database/entities';

describe('ResetService', () => {
  let resetService: ResetService;
  let balanceRepository: Repository<BalanceEntity>;
  let eventRepository: Repository<EventEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetService,
        {
          provide: getRepositoryToken(BalanceEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EventEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    resetService = await module.resolve<ResetService>(ResetService);
    balanceRepository = module.get<Repository<BalanceEntity>>(
      getRepositoryToken(BalanceEntity),
    );
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  it('should clear both repositories', async () => {
    const clearBalanceSpy = jest
      .spyOn(balanceRepository, 'clear')
      .mockResolvedValue(undefined);
    const clearEventSpy = jest
      .spyOn(eventRepository, 'clear')
      .mockResolvedValue(undefined);

    const result = await resetService.post();

    expect(clearBalanceSpy).toHaveBeenCalled();
    expect(clearEventSpy).toHaveBeenCalled();
    expect(result).toBe('OK');
  });
});
