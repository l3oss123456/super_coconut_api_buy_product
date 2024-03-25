import * as R from 'ramda';
import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';
import mongodb_domain from '@/utils/mongodb_domain';
import lotteryRandomConfigData from '../../utils/initialMongodb/lotteryRandomConfigData';
import helper from '@/utils/helper';

export default {
  async updateTimeInLotterRandomConfig({
    random_type = null,
    time = null,
    domain = null,
  }: {
    random_type: string;
    time: string;
    domain: string;
  }) {
    const find_one = await mongodb_domain.MongodbFindOne({
      model: LotteryRandomConfigModel,
      filter: { lottery_type: process.env.SERVER_TYPE, domain: domain },
    });

    if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
      await mongodb_domain.MongodbUpdate({
        model: LotteryRandomConfigModel,
        filter: { _id: find_one.data._id },
        data: {
          [random_type]: time,
          [`${random_type}_cronjob_schedule`]:
            helper.ToCronJobScheduleFromHourAndMinute({ time: time }),
        },
      });
    } else {
      await mongodb_domain.MongodbCreate({
        model: LotteryRandomConfigModel,
        data: {
          ...lotteryRandomConfigData,
          lottery_type: process.env.SERVER_TYPE,
          is_start_random: true,
          current_random_position: 1,
          domain: domain,
        },
      });
    }
  },
};
