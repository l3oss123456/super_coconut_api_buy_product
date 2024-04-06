import { PaginationDTO, SortDTO } from '@/dto/global.dto';
import {
  CreateProductDTO,
  ProductFilterDTO,
  UpdateProductDTO,
} from '@/dto/product/product.dto';
import { ProductService } from '@/service/product/product.service';
import helper from '@/utils/helper';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import * as R from 'ramda';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get(`/`)
  getAllProduct(
    @Query() filter_info: ProductFilterDTO,
    // @Query() date_duration: DateDurationDTO,
    @Query() { sort_field, sort_order }: SortDTO,
    @Query() { page, per_page }: PaginationDTO,
  ) {
    return this.service.getAllProduct({
      filter_info,
      sort_field,
      sort_order,
      // date_duration,
      page,
      per_page,
    });
  }

  @Post(`/`)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  createProduct(
    @Body() body: CreateProductDTO,
    @UploadedFiles()
    files: {
      //   image?: Express.Multer.File;
      image?: any;
      //   registration_file_head?: any;
    },
  ) {
    let _body = helper.ToConvertDataTypeFormData(CreateProductDTO, body);
    _body = { ..._body, image: files.image[0] };

    return this.service.createProduct({
      body: _body,
    });
  }

  @Patch(`:id`)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDTO,
    @UploadedFiles()
    files: {
      image?: any;
    },
  ) {
    let _body = helper.ToConvertDataTypeFormData(UpdateProductDTO, body);

    if (!R.isNil(files) && !R.isEmpty(files)) {
      if (!R.isNil(files.image) && !R.isEmpty(files.image)) {
        _body = { ..._body, image: files.image[0] };
      }
    }

    return this.service.updateProduct({
      id: id,
      body: _body,
    });
  }

  @Delete(`:id`)
  deleteProduct(@Param('id') id: string) {
    return this.service.deleteProduct({
      id: id,
    });
  }
}
