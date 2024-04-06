import { Module } from '@nestjs/common';
import { ProductController } from '@/controller/product/product.controller';
import { ProductService } from '@/service/product/product.service';
import { SocketGateway } from '@/connection/socket/socket.gateway';

@Module({
  controllers: [ProductController],
  providers: [ProductService, SocketGateway],
})
export class ProductModule {}
