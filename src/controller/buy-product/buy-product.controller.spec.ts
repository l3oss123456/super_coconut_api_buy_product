import { Test, TestingModule } from '@nestjs/testing';
import { BuyProductController } from './buy-product.controller';

describe('BuyProductController', () => {
  let controller: BuyProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyProductController],
    }).compile();

    controller = module.get<BuyProductController>(BuyProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
