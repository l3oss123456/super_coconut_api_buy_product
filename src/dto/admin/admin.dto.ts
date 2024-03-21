import { ApiProperty } from '@nestjs/swagger';

export class AdminDTO {
  @ApiProperty({
    required: true,
    default: 'admin01',
    description: `ชื่อ`,
  })
  first_name: string;

  @ApiProperty({
    required: true,
    default: 'admin01',
    description: `นามสกุล`,
  })
  last_name: string;

  @ApiProperty({
    required: true,
    default: 'admin01',
    description: `username`,
  })
  username: string;

  @ApiProperty({
    required: true,
    default: '12345',
    description: `password`,
  })
  password: string;
}
