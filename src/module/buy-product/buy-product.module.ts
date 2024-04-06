import { Module } from '@nestjs/common';
import { BuyProductController } from '@/controller/buy-product/buy-product.controller';
import { BuyProductService } from '@/service/buy-product/buy-product.service';
import { SocketGateway } from '@/connection/socket/socket.gateway';
import { BuyProductHelper } from '@/provider/buyProduct/buyProduct.provider';

@Module({
  controllers: [BuyProductController],
  providers: [BuyProductService, BuyProductHelper, SocketGateway],
})
export class BuyProductModule {}
