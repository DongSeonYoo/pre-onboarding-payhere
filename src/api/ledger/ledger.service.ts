import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LedgerEntity } from 'src/entities/ledger.entity';
import { Repository } from 'typeorm';
import { CreateLedgerDto } from './dto/create-ledger.dto';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntity)
    private readonly ledgerRepository: Repository<LedgerEntity>,
  ) {}

  async createLedger(createLedgerDto: CreateLedgerDto) {
    const ledger = createLedgerDto.toEntity();

    return this.ledgerRepository.save(ledger);
  }
}
