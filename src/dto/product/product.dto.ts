import { ApiProperty } from '@nestjs/swagger';
import { ProductTypeEnum } from '@/enum/product';
// import { CheckDigits } from '@/utils/class-validator/decorator';

export class ProductFilterDTO {
  @ApiProperty({
    required: false,
    description: 'ชื่อสินค้า (ภาษาไทย)',
    default: '',
  })
  name_th?: string;

  @ApiProperty({
    required: false,
    description: 'ชื่อสินค้า (ภาษาอังกฤษ)',
    default: '',
  })
  name_en?: string;

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
    description: 'ประเภทสินค้า',
    enum: ProductTypeEnum,
    // default: 'food',
  })
  product_type?: string;

  @ApiProperty({
    required: false,
    description: 'id ที่ต้องการค้นหา',
    default: '',
  })
  list_id?: string[];
}
export class CreateProductDTO {
  @ApiProperty({
    required: true,
    description: 'ชื่อสินค้า (ภาษาไทย)',
    default: '',
  })
  // @CheckDigits(5, { message: 'กรุณาใส่ตัวเลข 5 ตัว' })
  name_th: string;

  @ApiProperty({
    required: true,
    description: 'ชื่อสินค้า (ภาษาอังกฤษ)',
    default: '',
  })
  name_en: string;

  @ApiProperty({
    required: true,
    description: 'ประเภทสินค้า',
    enum: ProductTypeEnum,
    default: 'food',
  })
  product_type: string;

  @ApiProperty({
    required: true,
    description: 'จำนวน',
    default: 0,
  })
  amount: number;

  @ApiProperty({
    required: true,
    description: 'ราคา',
    default: 0,
  })
  price: number;

  @ApiProperty({
    required: true,
    description: 'รูปภาพสินค้า',
    default: '',
    format: 'binary',
  })
  image: string;
  // image: Express.Multer.File;
}

export class UpdateProductDTO {
  @ApiProperty({
    required: false,
    description: 'ชื่อสินค้า (ภาษาไทย)',
    default: '',
  })
  name_th: string;

  @ApiProperty({
    required: false,
    description: 'ชื่อสินค้า (ภาษาอังกฤษ)',
    default: '',
  })
  name_en: string;

  @ApiProperty({
    required: false,
    description: 'ประเภทสินค้า',
    enum: ProductTypeEnum,
    default: 'food',
  })
  product_type: string;

  @ApiProperty({
    required: false,
    description: 'จำนวน',
    default: 0,
  })
  amount: number;

  @ApiProperty({
    required: false,
    description: 'ราคา',
    default: 0,
  })
  price: number;

  @ApiProperty({
    required: false,
    description: 'รูปภาพสินค้า',
    default: '',
    format: 'binary',
  })
  image: string;
}
