import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { checkLotteryRandomConditionInMongodb } from './onStartUpServer.func';
// import { YourService } from './your.service';

@Injectable()
export class OnStartUpServerService implements OnApplicationBootstrap {
  //   constructor(private readonly yourService: YourService) {}

  async onApplicationBootstrap(): Promise<void> {
    // Call your function after the server has started
    // await this.yourService.yourFunction();

    checkLotteryRandomConditionInMongodb();
  }
}
