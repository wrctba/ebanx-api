import { ResetModule } from './reset.module';

describe('EventModule', () => {
  let module: ResetModule;
  beforeEach(async () => {
    module = new ResetModule();
  });
  it('should be defined', async () => {
    expect(module).toBeDefined();
  });
});
