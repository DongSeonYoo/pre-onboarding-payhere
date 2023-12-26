import { LedgerEntity } from 'src/entities/ledger.entity';

export class ResponseLedgerDto {
  createdId: number;

  constructor(ledger: LedgerEntity) {
    this.createdId = ledger.id;
  }
}
