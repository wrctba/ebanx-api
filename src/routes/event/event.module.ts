import { forwardRef, Module } from '@nestjs/common';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '@/database/entities';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    forwardRef(() => BalanceModule),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
