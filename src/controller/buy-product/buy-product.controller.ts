import { CreateBuyProductDTO } from '@/dto/product/buyProduct.dto';
import { BuyProductService } from '@/service/buy-product/buy-product.service';
import helper from '@/utils/helper';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('buy-product')
export class BuyProductController {
  constructor(private readonly service: BuyProductService) {}

  @Post(`/`)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  createBuyProduct(@Body() body: CreateBuyProductDTO) {
    let _body = helper.ToConvertDataTypeFormData(CreateBuyProductDTO, body);

    return this.service.createBuyProduct({
      body: _body,
    });
  }
}
