import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Length,
} from 'class-validator';
import { LedgerEntity } from 'src/entities/ledger.entity';
import { UserEntity } from 'src/entities/user.entity';

export class CreateLedgerDto {
  // 지출
  @IsNotEmpty()
  @IsNumber()
  spending: number;

  // 수입
  @IsNotEmpty()
  @IsNumber()
  income: number;

  // 내용
  @IsNotEmpty()
  content: string;

  // 소비 날짜
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  toEntity(user: UserEntity) {
    const ledger = new LedgerEntity();
    ledger.userId = user;
    ledger.spending = this.spending;
    ledger.income = this.income;
    ledger.content = this.content;
    ledger.date = this.date;

    return ledger;
  }
}
