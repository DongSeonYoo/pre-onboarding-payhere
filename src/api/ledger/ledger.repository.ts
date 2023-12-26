import { Injectable } from '@nestjs/common';
import { LedgerEntity } from 'src/entities/ledger.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateLedgerDto } from './dto/request/update-ledger.req.dto';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class LedgerRepository extends Repository<LedgerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LedgerEntity, dataSource.createEntityManager());
  }

  // 가계부 작성
  async createLedger(ledger: LedgerEntity) {
    return this.save(ledger);
  }

  // 가계부 수정
  async updateLedger(ledgerId: number, ledger: UpdateLedgerDto) {
    return this.update(ledgerId, ledger);
  }

  async findLedger(ledgerId: number, user: UserEntity) {
    return this.findOneBy({
      userId: { id: user.id },
      id: ledgerId,
    });
  }
}
