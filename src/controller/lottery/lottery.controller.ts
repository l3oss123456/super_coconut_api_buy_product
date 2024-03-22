import { AdminDTO } from '@/dto/admin/admin.dto';
import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import { LotteryService } from '@/service/lottery/lottery.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lottery')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Get(`/`)
  getAllLottery(
    @Query() { sort_field, sort_order }: SortDTO,
    @Query() { page, per_page }: PaginationDTO,
  ) {
    return this.service.getAllLottery({
      sort_field,
      sort_order,
      page,
      per_page,
    });
  }
}
