import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import { LotteryDTO, LotteryParamsDTO } from '@/dto/lottery/lottery.dto';
import { LotteryService } from '@/service/lottery/lottery.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Lottery')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Get(`/`)
  getAllLottery(
    @Query() filter_info: LotteryParamsDTO,
    @Query() { sort_field, sort_order }: SortDTO,
    @Query() { page, per_page }: PaginationDTO,
  ) {
    return this.service.getAllLottery({
      filter_info,
      sort_field,
      sort_order,
      page,
      per_page,
    });
  }

  @Post(`/`)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  createLottery(@Body() body: LotteryDTO) {
    return this.service.createLottery({
      body: helper.ToConvertDataTypeFormData(LotteryDTO, body),
    });
  }
}
