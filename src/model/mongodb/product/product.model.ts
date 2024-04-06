import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    product_type: {
      type: String,
      enum: ['used', 'food'],
      required: true,
    },
    name_th: {
      type: String,
      required: true,
      default: null,
    },
    name_en: {
      type: String,
      required: true,
      default: null,
    },
    amount: {
      type: Number,
      //   validate: {
      //     validator: function (v: any) {
      //       return /^\d{5}$/.test(v.toString());
      //     },
      //     message: (props: any) =>
      //       `${props.value} is not a valid 5-digit number!`,
      //   },
      //   required: true,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      // currentTime: () => Math.floor(Date.now() / 1000), // Convert timestamps to Unix time
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

// // Pre-save middleware to update deleted_at to current Unix time
// AdminSchema.pre('save', function (next) {
//   if (this.isModified('deleted_at') && this.deleted_at !== null) {
//     this.deleted_at = Math.floor(Date.now() / 1000);
//   }
//   next();
// });

// // Override the default transform function to convert timestamps to Unix time
// AdminSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     ret.created_at = Math.floor(ret.created_at / 1000);
//     ret.updated_at = Math.floor(ret.updated_at / 1000);

//     return ret;
//   },
// });

export const ProductModel = mongoose.model('product', ProductSchema);
