import { Body, Controller, Post } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dto/create-ledger.dto';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  createLedger(@Body() createLedgerDto: CreateLedgerDto) {
    return this.ledgerService.createLedger(createLedgerDto);
  }
}
