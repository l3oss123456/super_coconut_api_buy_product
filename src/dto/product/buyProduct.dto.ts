import { ApiProperty } from '@nestjs/swagger';

export class CreateBuyProductDTO {
  @ApiProperty({
    required: true,
    description: 'ชื่อผู้ซื้อ',
    default: 'test',
  })
  first_name: string;

  @ApiProperty({
    required: true,
    description: 'นามสกุลผู้ซื้อ',
    default: 'test',
  })
  last_name: string;

  @ApiProperty({
    required: true,
    description: 'รหัสสินค้า',
  })
  list_product_id: string[];

  @ApiProperty({
    required: true,
    description: 'จำนวน',
    default: 0,
  })
  amount: number[];
}
