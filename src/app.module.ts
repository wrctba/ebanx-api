import { Module } from '@nestjs/common';
import { BalanceEntity, EventEntity } from './database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceModule } from './routes';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [BalanceEntity, EventEntity],
      synchronize: true,
    }),
    BalanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
