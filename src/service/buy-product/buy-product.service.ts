import { BadRequestException, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { CreateBuyProductDTO } from '@/dto/product/buyProduct.dto';
import { BuyProductHelper } from '@/provider/buyProduct/buyProduct.provider';
import mongodb_domain from '@/utils/mongodb_domain';
import { BuyProductModel } from '@/model/mongodb/product/buyProduct.model';
import responseHandler from '@/utils/responseHandler';
import { ProductModel } from '@/model/mongodb/product/product.model';
import { SocketGateway } from '@/connection/socket/socket.gateway';

@Injectable()
export class BuyProductService {
  constructor(
    private buy_product_helper: BuyProductHelper,
    private socketGateway: SocketGateway,
  ) {}
  async createBuyProduct({ body = null }: { body: CreateBuyProductDTO }) {
    try {
      if (!R.isNil(body.list_product_id) && !R.isEmpty(body.list_product_id)) {
        let _list_product_id = body.list_product_id;
        let _list_amount = body.amount;

        if (!Array.isArray(body.list_product_id)) {
          _list_product_id = [body.list_product_id];
        }
        if (!Array.isArray(body.amount)) {
          _list_amount = [body.amount];
        }

        const { list_out_of_stock, list_enough_stock } =
          await this.buy_product_helper.checkOutOfStock({
            list_product_id: _list_product_id,
            list_amount_product: _list_amount,
          });

        if (!R.isEmpty(list_out_of_stock)) {
          throw {
            code: 4001,
            description: `Product ${list_out_of_stock[0].name_en} out of stock`,
          };
        }

        const listCreateData = [];
        const listUpdateProductStock = [];

        list_enough_stock.forEach((p: any, index: number) => {
          listCreateData.push({
            user_info: {
              first_name: 'first_name',
              last_name: 'last_name',
            },
            product_id: p._id,
            amount: body.amount[index],
            price: body.amount[index] * p.price,
          });

          listUpdateProductStock.push({
            _id: p._id,
            amount: p.amount - body.amount[index],
          });
        });

        await mongodb_domain
          .MongodbCreateMany({
            model: BuyProductModel,
            data: listCreateData,
          })
          .then(() => {
            listUpdateProductStock.forEach(async (data) => {
              await mongodb_domain.MongodbUpdate({
                model: ProductModel,
                filter: { _id: data._id },
                data: {
                  amount: data.amount,
                },
              });
            });
          });

        this.socketGateway.broadcast('update_product', {
          update_product: listUpdateProductStock,
        });

        return responseHandler.CreateSuccess();
      }

      return body;
    } catch (error) {
      throw new BadRequestException({
        message: error,
      });
    }
  }
}
