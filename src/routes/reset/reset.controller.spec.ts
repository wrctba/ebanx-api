import { Test, TestingModule } from '@nestjs/testing';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';

describe('ResetController', () => {
  let resetController: ResetController;
  let resetService: ResetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetController],
      providers: [
        {
          provide: ResetService,
          useValue: {
            post: jest.fn().mockResolvedValue(100),
          },
        },
      ],
    }).compile();

    resetController = module.get<ResetController>(ResetController);
    resetService = module.get<ResetService>(ResetService);
  });

  it('should post with success', async () => {
    const result = await resetController.post();
    expect(result).toEqual(100);
    expect(resetService.post).toHaveBeenCalled();
  });
});
