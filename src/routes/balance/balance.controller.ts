import { Controller, Get, Query } from '@nestjs/common';

import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async get(@Query('account_id') account: string) {
    return await this.balanceService.get(account);
  }
}
