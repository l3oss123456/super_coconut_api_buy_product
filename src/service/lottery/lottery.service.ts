import { LotteryModel } from '@/model/mongodb/lottery/lottery.model';
import cronjob from '@/utils/cronjob';
import mongo_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SchedulerService implements OnModuleInit {
  async tellFrontendStartRandom() {
    console.log(
      'tellFrontendStartRandomtellFrontendStartRandomtellFrontendStartRandom',
    );
  }

  onModuleInit() {
    // cron.schedule(process.env.CRON_SCHEDULE, () => {
    //   // cron.schedule('*/5 * * * * *', () => {
    //   this.inActiveFuelRate();
    //   // this.activeFuelRate();
    // });

    cronjob({
      schedule_time: '*/3 * * * * *',
      //   schedule_time: '1 * * * * *',
      task_action: () => {
        this.tellFrontendStartRandom();
      },
    });
  }
}

@Injectable()
export class LotteryService {
  async getAllLottery({
    sort_field,
    sort_order,
    page = null,
    per_page = null,
  }: {
    sort_field?: string[];
    sort_order?: number[];
    page?: number;
    per_page?: number;
  }) {
    try {
      const obj = await mongo_domain.MongodbAggregate({
        model: LotteryModel,
        pipeline: [{ $sort: { updated_at: -1 } }],
        sort_field: sort_field,
        sort_order: sort_order,
        page: page,
        per_page: per_page,
      });

      return responseHandler.Success({
        results: {
          data: obj.data,
        },
      });
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async createLottery({ body = null }: { body: any }) {
    try {
      return responseHandler.CreateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
