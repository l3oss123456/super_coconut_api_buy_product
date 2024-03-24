import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import mongodb_domain from '@/utils/mongodb_domain';
import responseHandler from '@/utils/responseHandler';

@Injectable()
export class LotteryRandomConfigService {
  async getOneLotteryRandomConfig({ filter_info }: { filter_info?: any }) {
    const obj = await mongodb_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: filter_info.lottery_type },
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
      },
    });
  }

  async updateCurrentPosition({ body }) {
    try {
      const find_one = await mongodb_domain.MongodbFindOne({
        model: LotteryRandomConfigModel,
        filter: { lottery_type: body.lottery_type },
      });
      if (
        R.isNil(find_one.data) &&
        R.isNil(find_one.data.current_random_position)
      ) {
        throw {
          code: 4001,
          description: `config data not found`,
        };
      }

      if (
        find_one.data.current_random_position < body.current_random_position
      ) {
        await mongodb_domain.MongodbUpdate({
          model: LotteryRandomConfigModel,
          filter: { _id: find_one.data._id },
          data: {
            current_random_position: body.current_random_position,
          },
        });
      }

      return responseHandler.UpdateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
