import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: {
            get: jest.fn().mockResolvedValue({ balance: 1000 }),
          },
        },
      ],
    }).compile();

    balanceController = module.get<BalanceController>(BalanceController);
    balanceService = module.get<BalanceService>(BalanceService);
  });

  it('should return balance', async () => {
    const account = '12345';
    const result = await balanceController.get(account);
    expect(result).toEqual({ balance: 1000 });
    expect(balanceService.get).toHaveBeenCalledWith(account);
  });
});
