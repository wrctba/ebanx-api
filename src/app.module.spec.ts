import { AppModule } from './app.module';

describe('AppModule', () => {
  let module: AppModule;
  beforeEach(async () => {
    module = new AppModule();
  });
  it('should be defined', async () => {
    expect(module).toBeDefined();
  });
});
