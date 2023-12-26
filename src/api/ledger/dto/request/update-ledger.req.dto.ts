import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateLedgerDto } from './create-ledger.req.dto';
import { IsNumber, IsOptional } from 'class-validator';

// export class UpdateLedgerDto extends PickType(CreateLedgerDto, [
//   'spending',
//   'content',
// ]) {}

export class UpdateLedgerDto {
  @IsOptional()
  @IsNumber()
  spending?: number;

  @IsOptional()
  @IsNumber()
  content?: string;
}
