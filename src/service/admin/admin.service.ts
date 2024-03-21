import { AdminDTO } from '@/dto/admin/admin.dto';
import {
  MongodbAggregate,
  MongodbCreate,
  MongodbFind,
} from '@/utils/mongodb_domain';
import * as R from 'ramda';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminModel } from '@/model/mongodb/admin/admin.model';
import responseHandler from '@/utils/responseHandler';

@Injectable()
export class AdminService {
  async getAllAdmin({ sort_field, sort_order, page = null, per_page = null }) {
    try {
      const obj = await MongodbAggregate({
        model: AdminModel,
        pipeline: [
          //   { $match: { age: { $gte: 18 } } }, // Match documents where age is greater than or equal to 18
          { $sort: { updated_at: -1 } },
        ],
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

  async createAdmin({ body = null }: { body: AdminDTO }) {
    try {
      const find_admin = await MongodbFind({
        model: AdminModel,
        filter: {
          first_name: body.first_name,
          last_name: body.last_name,
          username: body.username,
        },
      });

      if (!R.isEmpty(find_admin.data)) {
        throw {
          code: 1001,
          description: 'มีข้อมูล admin นี้ในระบบแล้ว',
        };
      }

      await MongodbCreate({
        model: AdminModel,
        data: body,
      });

      return responseHandler.CreateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
