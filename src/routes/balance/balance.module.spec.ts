import { BalanceModule } from './balance.module';

describe('BalanceModule', () => {
  let module: BalanceModule;
  beforeEach(async () => {
    module = new BalanceModule();
  });
  it('should be defined', async () => {
    expect(module).toBeDefined();
  });
});
