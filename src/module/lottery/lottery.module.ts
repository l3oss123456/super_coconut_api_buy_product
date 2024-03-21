import { Module } from '@nestjs/common';
import { LotteryController } from '@/controller/lottery/lottery.controller';
import {
  LotteryService,
  SchedulerService,
} from '@/service/lottery/lottery.service';

@Module({
  controllers: [LotteryController],
  providers: [LotteryService, SchedulerService],
})
export class LotteryModule {}
