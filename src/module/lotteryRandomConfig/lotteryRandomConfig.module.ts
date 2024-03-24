import { Module } from '@nestjs/common';
import { LotteryRandomConfigController } from '@/controller/lotteryRandomConfig/lotteryRandomConfig.controller';
import { LotteryRandomConfigService } from '@/service/lotteryRandomConfig/lotteryRandomConfig.service';

@Module({
  controllers: [LotteryRandomConfigController],
  providers: [LotteryRandomConfigService],
})
export class LotteryRandomConfigModule {}
