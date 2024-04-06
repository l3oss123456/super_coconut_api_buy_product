import { Test, TestingModule } from '@nestjs/testing';
import { BuyProductService } from './buy-product.service';

describe('BuyProductService', () => {
  let service: BuyProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyProductService],
    }).compile();

    service = module.get<BuyProductService>(BuyProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
