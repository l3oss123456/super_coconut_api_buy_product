import { Test, TestingModule } from '@nestjs/testing';
import { LotteryRandomConfigService } from './lottery-random-config.service';

describe('LotteryRandomConfigService', () => {
  let service: LotteryRandomConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotteryRandomConfigService],
    }).compile();

    service = module.get<LotteryRandomConfigService>(LotteryRandomConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
