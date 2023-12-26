import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLedgerDto } from './dto/request/create-ledger.req.dto';
import { Repository } from 'typeorm';
import { LedgerRepository } from './ledger.repository';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateLedgerDto } from './dto/request/update-ledger.req.dto';

@Injectable()
export class LedgerService {
  constructor(private readonly ledgerRepository: LedgerRepository) {}

  async createLedger(createLedgerDto: CreateLedgerDto, user: UserEntity) {
    const ledger = createLedgerDto.toEntity(user);

    return this.ledgerRepository.createLedger(ledger);
  }

  async updateLedger(
    ledgerId: number,
    updateLedgerDto: UpdateLedgerDto,
    user: UserEntity,
  ) {
    const ledger = await this.ledgerRepository.findLedger(ledgerId, user);
    if (!ledger) {
      throw new NotFoundException('해당하는 가계부가 존재하지 않습니다');
    }

    return this.ledgerRepository.updateLedger(ledgerId, updateLedgerDto);
  }
}
