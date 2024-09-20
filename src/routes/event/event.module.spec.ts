import { EventModule } from './event.module';

describe('EventModule', () => {
  let module: EventModule;
  beforeEach(async () => {
    module = new EventModule();
  });
  it('should be defined', async () => {
    expect(module).toBeDefined();
  });
});
