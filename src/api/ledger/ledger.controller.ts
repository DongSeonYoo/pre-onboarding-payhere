import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { CreateLedgerDto } from './dto/request/create-ledger.req.dto';
import { UserDecorator } from '../auth/decorator/user.decorator';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';
import { UserEntity } from 'src/entities/user.entity';
import { ResponseEntity } from 'src/common/dto/common-response.dto';
import { ResponseLedgerDto } from './dto/rseponse/create-ledger.res.dto';
import { UpdateLedgerDto } from './dto/request/update-ledger.req.dto';

@Controller('ledger')
@UseGuards(JwtAccessGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post()
  async createLedger(
    @Body() createLedgerDto: CreateLedgerDto,
    @UserDecorator() user: UserEntity,
  ) {
    const result = await this.ledgerService.createLedger(createLedgerDto, user);

    return ResponseEntity.OK_WITH(new ResponseLedgerDto(result));
  }

  @Put(':id')
  async updateLedger(
    @Param('id') ledgerId: number,
    @Body() updateLedgerDto: UpdateLedgerDto,
    @UserDecorator() user: UserEntity,
  ) {
    await this.ledgerService.updateLedger(ledgerId, updateLedgerDto, user);

    return ResponseEntity.OK();
  }
}
