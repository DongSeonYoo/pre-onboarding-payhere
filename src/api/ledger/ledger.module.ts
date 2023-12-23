import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerEntity } from 'src/entities/ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntity])],
  controllers: [LedgerController],
  providers: [LedgerService],
})
export class LedgerModule {}
