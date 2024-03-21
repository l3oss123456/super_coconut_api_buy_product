import { ApiProperty } from '@nestjs/swagger';

const current_date = new Date();
current_date.setHours(0, 0, 0, 0);

export class DateDurationDTO {
  @ApiProperty({
    required: false,
    description: `วันเริ่มต้น`,
    example: new Date(
      current_date.getFullYear(),
      current_date.getMonth() - 1,
      current_date.getDate(),
    ).toISOString(),
  })
  start_date?: string;

  @ApiProperty({
    required: false,
    description: `วันสิ้นสุด`,
    example: new Date(
      current_date.getFullYear() + 1,
      current_date.getMonth(),
      current_date.getDate(),
    ).toISOString(),
  })
  end_date?: string;
}

export class QueryDTO {
  @ApiProperty({
    name: 'search',
    required: false,
    default: '',
  })
  search?: string;

  // sort
  @ApiProperty({
    name: 'sort_field',
    required: false,
    default: [],
  })
  sort_field?: string[];

  @ApiProperty({
    name: 'sort_order',
    required: false,
    type: [Number],
    default: [],
    description: `-1=DESC(มากไปน้อย), 1=ASC(น้อยไปมาก)`,
  })
  sort_order?: number[];

  // pagination
  @ApiProperty({
    name: 'page',
    type: Number,
    required: false,
    default: 1,
  })
  page: number;

  @ApiProperty({
    name: 'per_page',
    type: Number,
    required: false,
    default: 10,
  })
  per_page: number;
}

export class SearchDTO {
  @ApiProperty({
    name: 'search',
    required: false,
    default: '',
  })
  search?: string;
}

export class SortDTO {
  @ApiProperty({
    name: 'sort_field',
    required: false,
    default: [],
  })
  sort_field?: string[];

  @ApiProperty({
    name: 'sort_order',
    required: false,
    type: [Number],
    default: [],
    description: `-1=DESC(มากไปน้อย), 1=ASC(น้อยไปมาก)`,
  })
  sort_order?: number[];
}

export class PaginationDTO {
  @ApiProperty({
    name: 'page',
    type: Number,
    required: false,
    default: 1,
  })
  page: number;

  @ApiProperty({
    name: 'per_page',
    type: Number,
    required: false,
    default: 10,
  })
  per_page: number;
}
