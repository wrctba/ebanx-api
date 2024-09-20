import { Controller, HttpCode, Post } from '@nestjs/common';

import { ResetService } from './reset.service';

@Controller('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post()
  @HttpCode(200)
  async post() {
    return await this.resetService.post();
  }
}
