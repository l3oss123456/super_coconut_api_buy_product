import * as R from 'ramda';
import mongodb_domain from '@/utils/mongodb_domain';
import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';

export const checkLotteryRandomConditionInMongodb = async () => {
  const find_data = await mongodb_domain.MongodbFindOne({
    model: LotteryRandomConfigModel,
    filter: { lottery_type: process.env.SERVER_TYPE },
  });
  if (R.isNil(find_data.data) || R.isEmpty(find_data.data)) {
    await mongodb_domain.MongodbCreate({
      model: LotteryRandomConfigModel,
      data: {
        lottery_type: process.env.SERVER_TYPE,
        is_start_random: false,
        current_random_position: 1,
      },
    });
  }
};
