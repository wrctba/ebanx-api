import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventPostRequest } from './dtos';
import { EventEnum } from '@/types';

describe('EventController', () => {
  let eventController: EventController;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            post: jest.fn().mockResolvedValue(100),
          },
        },
      ],
    }).compile();

    eventController = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  it('should post any event ', async () => {
    const body: EventPostRequest = {
      type: EventEnum.deposit,
      origin: '123',
      destination: '456',
      amount: 1,
    };
    const result = await eventController.post(body);
    expect(result).toEqual(100);
    expect(eventService.post).toHaveBeenCalledWith(body);
  });
});
