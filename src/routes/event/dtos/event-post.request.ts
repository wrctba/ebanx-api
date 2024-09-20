import { EventEnum } from '@/types';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class EventPostRequest {
  @IsEnum(EventEnum)
  @IsNotEmpty()
  type: EventEnum;

  @ValidateIf((o) => [EventEnum.withdraw, EventEnum.transfer].includes(o.type))
  @IsString()
  @Type(() => String)
  origin: string;

  @ValidateIf((o) => [EventEnum.deposit, EventEnum.transfer].includes(o.type))
  @IsString()
  @Type(() => String)
  destination: string;

  @IsDecimal()
  @Min(0.01)
  @Type(() => Number)
  amount: number;
}
