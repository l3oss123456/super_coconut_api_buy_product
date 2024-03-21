export const MongodbAggregate = async ({
  model = null,
  pipeline = [],
}: // page = 1,
// per_page = 10,
{
  model: any;
  pipeline: any[];
  // page?: number;
  // per_page?: number;
}) => {
  try {
    const obj = await model.aggregate(pipeline).exec();
    return {
      description: 'success',
      data: obj,
    };
  } catch (error) {
    return {
      description: `error query MongoAggregate`,
      error: error,
    };
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
    return {
      description: `error query MongodbFind`,
      error: error,
    };
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
    return {
      description: `error query MongodbCreate`,
      error: error,
    };
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
