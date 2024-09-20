import { Body, Controller, Post } from '@nestjs/common';

import { EventService } from './event.service';
import { EventPostRequest } from './dtos';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async post(@Body() body: EventPostRequest) {
    return await this.eventService.post(body);
  }
}
