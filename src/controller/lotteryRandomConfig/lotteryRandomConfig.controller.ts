import {
  LotteryRandomConfigParamsDTO,
  UpdateCurrentPositionDTO,
} from '@/dto/lottery/lotteryRandomConfig.dto';
import { LotteryRandomConfigService } from '@/service/lotteryRandomConfig/lotteryRandomConfig.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Lottery Random Config')
@Controller('lottery-random-config')
export class LotteryRandomConfigController {
  constructor(private readonly service: LotteryRandomConfigService) {}

  @Get(`/get-one`)
  getOne(@Query() filter_info: LotteryRandomConfigParamsDTO) {
    return this.service.getOneLotteryRandomConfig({
      filter_info,
    });
  }

  @Patch(`/update-current-position`)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  updateCurrentPosition(@Body() body: UpdateCurrentPositionDTO) {
    return this.service.updateCurrentPosition({
      body: helper.ToConvertDataTypeFormData(UpdateCurrentPositionDTO, body),
    });
  }
}
