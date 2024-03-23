import { DateDurationDTO, PaginationDTO, SortDTO } from '@/dto/global.dto';
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
    // @Query() date_duration: DateDurationDTO,
    @Query() { sort_field, sort_order }: SortDTO,
    @Query() { page, per_page }: PaginationDTO,
  ) {
    return this.service.getAllLottery({
      filter_info,
      sort_field,
      sort_order,
      // date_duration,
      page,
      per_page,
    });
  }

  @Get(`/get-last-seven-day-lottery`)
  getLastSevenDayLottery(@Query() filter_info: LotteryParamsDTO) {
    return this.service.getLastSevenDayLottery({
      filter_info,
    });
  }

  @Get(`/get-today-lottery`)
  getTodayLottery(@Query() filter_info: LotteryParamsDTO) {
    return this.service.getTodayLottery({
      filter_info,
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
