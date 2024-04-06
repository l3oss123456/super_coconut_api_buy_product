import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDTO } from '@/dto/product/product.dto';
import * as R from 'ramda';
import helper from '@/utils/helper';
import mongodb_domain from '@/utils/mongodb_domain';
import { ProductModel } from '@/model/mongodb/product/product.model';
import responseHandler from '@/utils/responseHandler';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductService {
  private get full_image_path(): string {
    return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/`;
  }

  async getAllProduct({
    filter_info,
    sort_field,
    sort_order,
    // date_duration,
    page = null,
    per_page = null,
  }) {
    let match_statement = {};

    if (!R.isNil(filter_info.name_th) && !R.isEmpty(filter_info.name_th)) {
      match_statement = {
        ...match_statement,
        name_th: { $regex: filter_info.name_th, $options: 'i' }, // Using case-insensitive regex
      };
    }

    if (!R.isNil(filter_info.name_en) && !R.isEmpty(filter_info.name_en)) {
      match_statement = {
        ...match_statement,
        name_en: { $regex: filter_info.name_en, $options: 'i' }, // Using case-insensitive regex
      };
    }

    if (
      !R.isNil(filter_info.product_type) &&
      !R.isEmpty(filter_info.product_type)
    ) {
      match_statement = {
        ...match_statement,
        product_type: filter_info.product_type,
      };
    }

    if (
      !R.isNil(filter_info.list_id) &&
      !R.isEmpty(filter_info.list_id) &&
      filter_info.list_id.length > 0
    ) {
      if (Array.isArray(filter_info.list_id)) {
        match_statement = {
          ...match_statement,
          _id: {
            $in: filter_info.list_id.map(
              (product_id: string) => new ObjectId(product_id),
            ),
          },
        };
      } else {
        match_statement = {
          ...match_statement,
          _id: new ObjectId(filter_info.list_id),
        };
      }
    }

    const obj = await mongodb_domain.MongodbAggregate({
      model: ProductModel,
      pipeline: [
        {
          $match: {
            ...match_statement,
          },
        },
        {
          $addFields: {
            image: { $concat: [`${this.full_image_path}`, '$image'] },
          },
        },
        { $sort: { updated_at: -1 } },
      ],
      sort_field: sort_field,
      sort_order: sort_order,
      page: page,
      per_page: per_page,
    });

    return responseHandler.Success({
      results: {
        data: obj.data,
        total: obj.total,
        page: Number(page),
        per_page: Number(per_page),
      },
    });
  }

  async getProduct({ id = null }: { id: string }) {
    try {
      const obj = await mongodb_domain.MongodbFindOne({
        model: ProductModel,
        filter: {
          _id: id,
        },
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

  async createProduct({ body = null }: { body: CreateProductDTO }) {
    try {
      let _body = { ...body };

      if (R.isNil(_body.image) || R.isEmpty(_body.image)) {
        throw {
          code: 3001,
          description: 'Please enter product image',
        };
      }

      const minio_image_obj = await helper.MinioUploadFile({
        file: _body.image,
      });
      if (!R.isNil(minio_image_obj.error)) {
        throw {
          code: 3002,
          description: {
            message: `พบปัญหาขณะเพิ่มรูปภาพใน Minio`,
            error: minio_image_obj.error,
          },
        };
      }
      _body = { ..._body, image: minio_image_obj.path };

      await mongodb_domain.MongodbCreate({
        model: ProductModel,
        data: _body,
      });

      return responseHandler.CreateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async updateProduct({ id = null, body = null }: { id: string; body: any }) {
    try {
      // _id = 660e833970c0801c1b80b464
      let _body = { ...body };
      const find_data = await mongodb_domain.MongodbFindOne({
        model: ProductModel,
        filter: {
          _id: id,
        },
      });

      if (!R.isNil(_body.image) && !R.isEmpty(_body.image)) {
        const minio_image_obj = await helper.MinioDeleteAndUploadFile({
          path: find_data.data.image,
          file: _body.image,
        });
        if (!R.isNil(minio_image_obj.error)) {
          throw {
            code: 4002,
            description: {
              message: `พบปัญหาขณะอัพเดทรูปภาพใน Minio`,
              error: minio_image_obj.error,
            },
          };
        }
        _body = { ..._body, image: minio_image_obj.path };
      }

      await mongodb_domain.MongodbUpdateById({
        model: ProductModel,
        _id: id,
        data: _body,
      });

      return responseHandler.UpdateSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }

  async deleteProduct({ id = null }: { id: string }) {
    try {
      await mongodb_domain.MongodbDelete({
        model: ProductModel,
        filter: { _id: id },
      });

      return responseHandler.DeleteSuccess();
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
