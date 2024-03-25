import * as R from 'ramda';
import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';
import mongodb_domain from '@/utils/mongodb_domain';
import lotteryRandomConfigData from '../../utils/initialMongodb/lotteryRandomConfigData';

export default {
  async startRandomToMongodb({ domain = null }: { domain: string }) {
    const find_one = await mongodb_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: process.env.SERVER_TYPE, domain: domain },
    });

    if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
      await mongodb_domain.MongodbUpdate({
        model: LotteryRandomConfigModel,
        filter: { _id: find_one.data._id },
        data: { is_start_random: true, current_random_position: 1 },
      });
    } else {
      await mongodb_domain.MongodbCreate({
        model: LotteryRandomConfigModel,
        data: {
          ...lotteryRandomConfigData,
          lottery_type: process.env.SERVER_TYPE,
          //   first_prize_spin_time:
          //     process.env.SERVER_TYPE === 'laos'
          //       ? null
          //       : lotteryRandomConfigData.first_prize_spin_time,
          //   first_prize_spin_time_cronjob_schedule:
          //     process.env.SERVER_TYPE === 'laos'
          //       ? null
          //       : lotteryRandomConfigData.first_prize_spin_time_cronjob_schedule,
          //   second_prize_spin_time:
          //     process.env.SERVER_TYPE === 'laos'
          //       ? null
          //       : lotteryRandomConfigData.second_prize_spin_time,
          //   second_prize_spin_time_cronjob_schedule:
          //     process.env.SERVER_TYPE === 'laos'
          //       ? null
          //       : lotteryRandomConfigData.second_prize_spin_time_cronjob_schedule,
          is_start_random: true,
          current_random_position: 1,
          domain: domain,
        },
      });
    }
  },
  async stopRandomToMongodb({ domain = null }: { domain: string }) {
    const find_one = await mongodb_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: process.env.SERVER_TYPE },
    });

    if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
      await mongodb_domain.MongodbUpdate({
        model: LotteryRandomConfigModel,
        filter: { _id: find_one.data._id },
        data: { is_start_random: false },
      });
    } else {
      //   await mongodb_domain.MongodbCreate({
      //     model: LotteryRandomConfigModel,
      //     data: {
      //       ...lotteryRandomConfigData,
      //       lottery_type: process.env.SERVER_TYPE,
      //       first_prize_spin_time:
      //         process.env.SERVER_TYPE === 'laos'
      //           ? null
      //           : lotteryRandomConfigData.first_prize_spin_time,
      //       first_prize_spin_time_cronjob_schedule:
      //         process.env.SERVER_TYPE === 'laos'
      //           ? null
      //           : lotteryRandomConfigData.first_prize_spin_time_cronjob_schedule,
      //       second_prize_spin_time:
      //         process.env.SERVER_TYPE === 'laos'
      //           ? null
      //           : lotteryRandomConfigData.second_prize_spin_time,
      //       second_prize_spin_time_cronjob_schedule:
      //         process.env.SERVER_TYPE === 'laos'
      //           ? null
      //           : lotteryRandomConfigData.second_prize_spin_time_cronjob_schedule,
      //       is_start_random: false,
      //       current_random_position: 1,
      //     },
      //   });
    }
  },
};
