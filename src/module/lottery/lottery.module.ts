import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LotteryController } from '@/controller/lottery/lottery.controller';
import {
  LotteryService,
  SchedulerService,
} from '@/service/lottery/lottery.service';
import { SocketGateway } from '@/connection/socket/socket.gateway';

@Module({
  controllers: [LotteryController],
  providers: [LotteryService, SchedulerService, SocketGateway],
})
export class LotteryModule {}
