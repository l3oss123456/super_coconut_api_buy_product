import * as R from 'ramda';

export default {
  ToConvertMongooseSortOrder: ({
    sort_field = [],
    sort_order = [],
  }: {
    sort_field: string[];
    sort_order: number[];
    database_type?: string;
  }) => {
    sort_field = typeof sort_field == `string` ? [sort_field] : sort_field;
    sort_order = typeof sort_order == `string` ? [sort_order] : sort_order;

    // let order_sequence = [['created_at', 'DESC']];
    let order_sequence = {};

    if (R.isNil(sort_field) && R.isNil(sort_order)) {
      return order_sequence;
    }
    if (R.isEmpty(sort_field) || R.isEmpty(sort_order)) {
      return order_sequence;
    } else {
      if (typeof sort_field === 'string' && typeof sort_order === 'string') {
        order_sequence = {
          ...order_sequence,
          [sort_field]: Number(sort_order),
        };
      }
      if (
        (typeof sort_field === 'string' && typeof sort_order !== 'string') ||
        (typeof sort_field !== 'string' && typeof sort_order === 'string') ||
        (R.isNil(sort_field) && !R.isNil(sort_order)) ||
        (!R.isNil(sort_field) && R.isNil(sort_order))
      ) {
        return [];
      } else {
        if (sort_field.length === sort_order.length) {
          sort_order.forEach((order, index) => {
            order_sequence = {
              ...order_sequence,
              [sort_field[index]]: Number(order),
            };
          });

          return { ...order_sequence };
        } else {
          return {};
        }
      }
    }
  },
};
