import * as R from 'ramda';
import { deepParseJson } from 'deep-parse-json';

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
  ToConvertDataTypeFormData: (dto: any, form_data: object) => {
    const _dto = new dto();
    form_data = deepParseJson(form_data);
    Object.keys(form_data).forEach((key) => {
      const data_type = Reflect.getMetadata('design:type', dto.prototype, key);

      if (R.isEmpty(form_data[key])) {
        form_data = R.omit([`${key}`], form_data);
      } else {
        if (R.isNil(form_data[key])) {
          _dto[key] = null;
        } else if (data_type === Number) {
          _dto[key] = Number(form_data[key]);
        } else if (data_type === Array) {
          if (typeof form_data[key] === 'string') {
            const str = JSON.stringify(form_data[key]);
            const obj = JSON.parse(str);
            const regex = /{[^}]+}/g;
            const array = obj.match(regex);
            const object = [];
            if (!R.isNil(array)) {
              for (let i = 0; i < array.length; i++) {
                const permObj = JSON.parse(array[i]);
                object.push(permObj);
              }
              _dto[key] = object;
            } else {
              _dto[key] = obj.split(',');
            }
          } else {
            _dto[key] = form_data[key];
          }
        } else {
          if (data_type === Number) {
            _dto[key] = Number(form_data[key]);
          } else {
            _dto[key] = form_data[key];
          }
        }
      }

      // if (R.isNil(form_data[key]) || R.isEmpty(form_data[key])) {
      //   form_data = R.omit([`${key}`], form_data);
      // } else {
      //   if (form_data[key] === `-`) {
      //     form_data[key] = '';
      //   }

      //   if (data_type === Number) {
      //     _dto[key] = Number(form_data[key]);
      //   } else if (data_type === Array) {
      //     if (typeof form_data[key] === 'string') {
      //       const str = JSON.stringify(form_data[key]);
      //       const obj = JSON.parse(str);
      //       const regex = /{[^}]+}/g;
      //       const array = obj.match(regex);
      //       const object = [];
      //       if (!R.isNil(array)) {
      //         for (let i = 0; i < array.length; i++) {
      //           const permObj = JSON.parse(array[i]);
      //           object.push(permObj);
      //         }
      //         _dto[key] = object;
      //       } else {
      //         _dto[key] = obj.split(',');
      //       }
      //     } else {
      //       _dto[key] = form_data[key];
      //     }
      //   } else {
      //     if (data_type === Number) {
      //       _dto[key] = Number(form_data[key]);
      //     } else {
      //       _dto[key] = form_data[key];
      //     }
      //   }
      // }
    });

    return _dto;
  },
  ToCronJobScheduleFromHourAndMinute({ time = null }: { time: string }) {
    let cronSchedule = null;
    if (!R.isNil(time)) {
      // const [hours, minutes] = time.split(':');
      const [hours, minutes] = time
        .split(':')
        .map((part) => parseInt(part, 10).toString());

      if (process.env.SERVER_TYPE === 'laos') {
        cronSchedule = `${minutes} ${hours} * * 1,4`;
      } else if (process.env.SERVER_TYPE === 'hanoi') {
        cronSchedule = `${minutes} ${hours} * * *`;
      } else if (process.env.SERVER_TYPE === 'eng') {
        cronSchedule = `${minutes} ${hours} * * *`;
      }
    }
    return cronSchedule;
  },
};
