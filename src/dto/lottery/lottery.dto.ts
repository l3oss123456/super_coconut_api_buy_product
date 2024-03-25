import { ApiProperty } from '@nestjs/swagger';
import { LotteryTypeEnum } from '@/enum/lottery';
import { CheckDigits } from '@/utils/class-validator/decorator';

export class LotteryParamsDTO {
  @ApiProperty({
    required: false,
    // description: `ประเภทหวย(ประเทศ) --> ${Object.values(LotteryTypeEnum)
    //   .map((item, key) => {
    //     if (typeof item !== `string`) {
    //       return ``;
    //     }
    //     return ` ${key}: ${item}`;
    //   })
    //   .filter((data) => {
    //     return data !== ``;
    //   })}`,
    description: 'ประเภทหวย(ประเทศ)',
    enum: LotteryTypeEnum,
    default: 'laos',
  })
  lottery_type?: string;
  @ApiProperty({
    required: false,
    description: 'domain เว็บไซต์',
    default: 'localhost',
  })
  domain?: string;
}

export class LotteryDTO {
  @ApiProperty({
    required: true,
    description: 'เลขหวย(5 หลัก)',
    default: 12345,
  })
  @CheckDigits(5, { message: 'กรุณาใส่ตัวเลข 5 ตัว' })
  number: number;

  @ApiProperty({
    required: true,
    // description: `ประเภทหวย(ประเทศ) --> ${Object.values(LotteryTypeEnum)
    //   .map((item, key) => {
    //     if (typeof item !== `string`) {
    //       return ``;
    //     }
    //     return ` ${key}: ${item}`;
    //   })
    //   .filter((data) => {
    //     return data !== ``;
    //   })}`,
    description: 'ประเภทหวย(ประเทศ)',
    enum: LotteryTypeEnum,
    default: 'laos',
  })
  lottery_type: string;

  @ApiProperty({
    required: true,
    description: 'domain เว็บไซต์',
    default: 'localhost',
  })
  domain: string;
}
