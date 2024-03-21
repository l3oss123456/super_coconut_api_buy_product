import {
  MongodbDomainParameterInterface,
  MongodbDomainResponseInterface,
} from '@/interface/domain/mongodb_domain.interface';
import { HttpStatus } from '@nestjs/common';
import * as R from 'ramda';
import helper from './helper';

export const MongodbAggregate = async ({
  model = null,
  pipeline = [],
  page = 1,
  per_page = 10,
  project = null,
  sort_field = null,
  sort_order = null,
}: {
  model: any;
  pipeline: any[];
  page?: number;
  per_page?: number;
  project?: object;
  sort_field?: string[];
  sort_order?: number[];
}): Promise<MongodbDomainResponseInterface> => {
  try {
    let _pipeline = [...pipeline];

    if (_pipeline.some((stage) => stage.$match)) {
      const existingMatchStageIndex = _pipeline.findIndex(
        (stage) => stage.$match,
      );
      const existingMatchStage = _pipeline[existingMatchStageIndex].$match;

      _pipeline[existingMatchStageIndex].$match = {
        $and: [
          existingMatchStage,
          { $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }] },
        ],
      };
    } else {
      _pipeline = [..._pipeline, { $match: { deleted_at: { $eq: null } } }];
    }

    if (!R.isNil(page) && !R.isNil(per_page)) {
      _pipeline = [
        ..._pipeline,
        { $skip: (Number(page) - 1) * Number(per_page) },
        { $limit: Number(per_page) },
      ];
    }

    if (!R.isNil(project)) {
      _pipeline = [..._pipeline, { $project: project }];
    }

    if (!R.isNil(sort_field) && !R.isNil(sort_order)) {
      _pipeline = [
        ..._pipeline,
        {
          $sort: helper.ToConvertMongooseSortOrder({
            sort_field,
            sort_order,
          }),
        },
      ];
    }

    const obj = await model.aggregate(_pipeline).exec();
    return {
      description: 'success',
      data: obj,
    };
  } catch (error) {
    throw { code: HttpStatus.BAD_REQUEST, description: error };
  }
};

export const MongodbFind = async ({
  model = null,
  filter = {},
  page = 1,
  per_page = 10,
  sort_field = null,
  sort_order = null,
  project = null,
}: MongodbDomainParameterInterface): Promise<MongodbDomainResponseInterface> => {
  try {
    const skip = (page - 1) * per_page;
    const obj = await model
      .find({
        ...filter,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      })
      .sort(
        helper.ToConvertMongooseSortOrder({
          sort_field: sort_field,
          sort_order: sort_order,
        }),
      )
      .select(project)
      .skip(skip)
      .limit(per_page);

    return {
      description: `success`,
      data: obj,
    };
  } catch (error) {
    throw { code: HttpStatus.BAD_REQUEST, description: error };
  }
};

export const MongodbCreate = async ({
  model = null,
  data = {},
}: MongodbDomainParameterInterface): Promise<MongodbDomainResponseInterface> => {
  try {
    const obj = new model({ ...data });
    await obj.save();

    return {
      description: `success`,
      data: obj,
    };
  } catch (error) {
    throw { code: HttpStatus.BAD_REQUEST, description: error };
  }
};

export const MongodbDeleteMany = async ({
  model = null,
  filter = {},
  hard_delete = false,
}: {
  model: any;
  filter: object;
  hard_delete?: boolean;
}) => {
  try {
    let obj = null;

    if (hard_delete === false) {
      obj = await model.updateMany(filter, {
        $set: { deleted_at: Date.now() },
      });
    } else {
      obj = await model.deleteMany(filter);
    }

    return {
      description: `success`,
      data: obj,
    };
  } catch (error) {
    return {
      description: `error query MongodbDelete`,
      error: error,
    };
  }
};
