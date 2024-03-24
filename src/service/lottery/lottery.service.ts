import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import * as R from 'ramda';
import { LotteryModel } from '@/model/mongodb/lottery/lottery.model';
import cronjob from '@/utils/cronjob';
import mongo_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';
import { SocketGateway } from '@/connection/socket/socket.gateway';
import { LotteryDTO } from '@/dto/lottery/lottery.dto';
import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(private socketGateway: SocketGateway) {}

  async tellFrontendStartRandom() {
    await this.socketGateway.broadcast('startRandom', {
      start_random: true,
    });
  }

  async startRandomToMongodb() {
    const find_one = await mongo_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: process.env.SERVER_TYPE },
    });

    if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
      await mongo_domain.MongodbUpdate({
        model: LotteryRandomConfigModel,
        filter: { _id: find_one.data._id },
        data: { is_start_random: true, current_random_position: 1 },
      });
    }
  }

  async stopRandomToMongodb() {
    const find_one = await mongo_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: process.env.SERVER_TYPE },
    });

    if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
      await mongo_domain.MongodbUpdate({
        model: LotteryRandomConfigModel,
        filter: { _id: find_one.data._id },
        data: { is_start_random: false },
      });
    }
  }

  onModuleInit() {
    cronjob({
      schedule_time: '*/30 * * * * *',
      // schedule_time:
      //   process.env.SERVER_TYPE === 'laos'
      //     ? '30 20 * * 1,4'
      //     : process.env.SERVER_TYPE === 'hanoi'
      //     ? '30 18 * * *'
      //     : '*/30 * * * * *',
      // schedule_time: '1 * * * * *',
      task_action: () => {
        this.startRandomToMongodb();
        this.tellFrontendStartRandom();
      },
    });

    cronjob({
      schedule_time: '*/40 * * * * *',
      // schedule_time: '0 21 * * *',
      task_action: () => {
        // this.stopRandomToMongodb();
      },
    });
  }
}

@Injectable()
export class LotteryService {
  async getAllLottery({
    filter_info,
    sort_field,
    sort_order,
    // date_duration,
    page = null,
    per_page = null,
  }: {
    filter_info?: any;
    sort_field?: string[];
    sort_order?: number[];
    // date_duration?: any;
    page?: number;
    per_page?: number;
  }) {
    try {
      let match_statement = {};

      if (
        !R.isNil(filter_info.lottery_type) &&
        !R.isEmpty(filter_info.lottery_type)
      ) {
        match_statement = {
          ...match_statement,
          lottery_type: filter_info.lottery_type,
        };
      }

      // if (
      //   !R.isNil(date_duration.start_date) &&
      //   !R.isEmpty(date_duration.start_date) &&
      //   !R.isNil(date_duration.end_date) &&
      //   !R.isEmpty(date_duration.end_date)
      // ) {
      //   match_statement['created_at'] = {
      //     $gte: new Date(date_duration.start_date),
      //     $lte: new Date(date_duration.end_date),
      //   };
      // }

      const obj = await mongo_domain.MongodbAggregate({
        model: LotteryModel,
        pipeline: [
          {
            $match: {
              ...match_statement,
            },
          },
          { $sort: { updated_at: -1 } },
        ],
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

  async getLastSevenDayLottery({ filter_info }: { filter_info?: any }) {
    try {
      let match_statement = {};

      if (
        !R.isNil(filter_info.lottery_type) &&
        !R.isEmpty(filter_info.lottery_type)
      ) {
        match_statement = {
          ...match_statement,
          lottery_type: filter_info.lottery_type,
        };
      }

      // Calculate the date 7 days ago from today
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 8);

      // Calculate the date yesterday
      const endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);
      endDate.setDate(endDate.getDate() - 1);

      // Add the date filter to the match criteria
      match_statement['created_at'] = {
        $gte: startDate,
        $lt: endDate,
      };

      const obj = await mongo_domain.MongodbAggregate({
        model: LotteryModel,
        pipeline: [
          {
            $match: {
              ...match_statement,
            },
          },
          { $sort: { created_at: -1 } },
        ],
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

  async getTodayLottery({ filter_info }: { filter_info?: any }) {
    try {
      const todayMidnight = new Date();
      todayMidnight.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);

      const obj = await mongo_domain.MongodbFindOne({
        model: LotteryModel,
        filter: {
          created_at: {
            $gte: todayMidnight,
            $lt: endOfDay,
          },
          lottery_type: filter_info.lottery_type,
        },
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

  async createLottery({ body = null }: { body: LotteryDTO }) {
    try {
      const todayMidnight = new Date();
      todayMidnight.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);

      const today_lottery_data = await mongo_domain.MongodbFindOne({
        model: LotteryModel,
        filter: {
          created_at: {
            $gte: todayMidnight,
            $lt: endOfDay,
          },
          lottery_type: body.lottery_type,
        },
      });

      if (
        R.isEmpty(today_lottery_data.data) ||
        R.isNil(today_lottery_data.data)
      ) {
        await mongo_domain.MongodbCreate({
          model: LotteryModel,
          data: body,
        });
        return responseHandler.CreateSuccess();
      } else {
        await mongo_domain.MongodbUpdate({
          model: LotteryModel,
          filter: {
            _id: today_lottery_data.data._id,
            lottery_type: today_lottery_data.data.lottery_type,
          },
          data: body,
        });

        return responseHandler.UpdateSuccess();
      }
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
