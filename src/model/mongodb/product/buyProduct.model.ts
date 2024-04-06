import mongoose from 'mongoose';

const BuyProductSchema = new mongoose.Schema(
  {
    user_info: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
    },
    product_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    price: {
      type: Number,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const BuyProductModel = mongoose.model('buy_product', BuyProductSchema);
