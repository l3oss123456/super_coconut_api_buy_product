import { Test, TestingModule } from '@nestjs/testing';
import { LotteryRandomConfigController } from './lottery-random-config.controller';

describe('LotteryRandomConfigController', () => {
  let controller: LotteryRandomConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryRandomConfigController],
    }).compile();

    controller = module.get<LotteryRandomConfigController>(LotteryRandomConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
