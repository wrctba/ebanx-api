import { Module } from '@nestjs/common';
import { BalanceEntity, EventEntity } from './database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceModule, EventModule, ResetModule } from './routes';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [BalanceEntity, EventEntity],
      synchronize: true,
    }),
    BalanceModule,
    EventModule,
    ResetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
