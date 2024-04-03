import { Module } from '@nestjs/common';
import { LotteryController } from '@/controller/lottery/lottery.controller';
import {
  LotteryService,
  SchedulerService,
} from '@/service/lottery/lottery.service';
import { SocketGateway } from '@/connection/socket/socket.gateway';
import { LotteryHelper } from '@/provider/lottery/lottery.provider';

@Module({
  controllers: [LotteryController],
  providers: [LotteryService, SchedulerService, SocketGateway, LotteryHelper],
})
export class LotteryModule {}
