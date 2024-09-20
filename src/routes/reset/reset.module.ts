import { Module } from '@nestjs/common';

import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceEntity, EventEntity } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, BalanceEntity])],
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule {}
