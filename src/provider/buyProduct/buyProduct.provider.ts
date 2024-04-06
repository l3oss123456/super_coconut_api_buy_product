import { ProductModel } from '@/model/mongodb/product/product.model';
import mongodb_domain from '@/utils/mongodb_domain';

export class BuyProductHelper {
  async checkOutOfStock({
    list_product_id = [],
    list_amount_product = [],
  }: {
    list_product_id: string[];
    list_amount_product: any[];
  }) {
    let response_data = {
      list_enough_stock: [],
      list_out_of_stock: [],
    };

    const all_product = await mongodb_domain.MongodbFind({
      model: ProductModel,
      filter: {
        _id: { $in: list_product_id },
      },
    });

    all_product.data.forEach((p: any, index: number) => {
      if (list_amount_product[index] > p.amount) {
        response_data['list_out_of_stock'].push(p);
      } else {
        response_data['list_enough_stock'].push(p);
      }
    });

    return response_data;
  }
}
