import { ApiProperty } from '@nestjs/swagger';
import { LotteryTypeEnum } from '@/enum/lottery';

export class LotteryRandomConfigParamsDTO {
  @ApiProperty({
    required: false,
    description: 'ประเภทหวย(ประเทศ)',
    enum: LotteryTypeEnum,
    default: 'laos',
  })
  lottery_type?: string;
}

export class UpdateCurrentPositionDTO {
  @ApiProperty({
    required: true,
    description: 'ตำแหน่งของตัวเลขที่เว็บไซต์กำลังสุ่ม',
    default: 1,
  })
  current_random_position: number;

  @ApiProperty({
    required: true,
    description: 'ประเภทหวย(ประเทศ)',
    enum: LotteryTypeEnum,
    default: 'laos',
  })
  lottery_type: string;
}
