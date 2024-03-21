import { HttpStatus } from '@nestjs/common';
import * as R from 'ramda';

export const MongodbAggregate = async ({
  model = null,
  pipeline = [],
  page = 1,
  per_page = 10,
  project = null,
}: {
  model: any;
  pipeline: any[];
  page?: number;
  per_page?: number;
  project?: object;
}) => {
  try {
    let _pipeline = [...pipeline];

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
}: {
  model: any;
  filter?: any;
  page?: number;
  per_page?: number;
}) => {
  try {
    const skip = (page - 1) * per_page;
    const obj = await model
      .find({
        ...filter,
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
      })
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
}: {
  model: any;
  data: object;
}) => {
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
