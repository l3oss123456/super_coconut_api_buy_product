import { AdminDTO } from '@/dto/admin/admin.dto';
import {
  MongodbAggregate,
  MongodbCreate,
  MongodbFind,
} from '@/utils/mongodb_domain';
import { Injectable } from '@nestjs/common';
import { AdminModel } from '@/model/mongodb/admin/admin.model';
// import { ToConvertSortOrder } from '@/utils/helper';

@Injectable()
export class AdminService {
  async getAllAdmin({ sort_field, sort_order, page, per_page }) {
    try {
      //   const test = ToConvertSortOrder({
      //     sort_field: ['created_at'],
      //     sort_order: [-1],
      //     database_type: 'sql',
      //   });

      //   const obj = await MongodbFind({
      //     model: AdminModel,
      //   });

      const obj = await MongodbAggregate({
        model: AdminModel,
        pipeline: [
          //   { $match: { age: { $gte: 18 } } }, // Match documents where age is greater than or equal to 18
          { $sort: { updated_at: -1 } }, // Sort documents by createdAt field in descending order
          { $limit: 10 }, // Limit the number of documents returned
        ],
      });

      return obj;
    } catch (error) {}
  }

  async createAdmin({ body = null }: { body: AdminDTO }) {
    try {
      const obj = await MongodbCreate({
        model: AdminModel,
        data: body,
      });

      return obj;
    } catch (error) {}
  }
}
