import mongoose from 'mongoose';

const LotterySchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      validate: {
        validator: function (v: any) {
          return /^\d{5}$/.test(v.toString());
        },
        message: (props: any) =>
          `${props.value} is not a valid 5-digit number!`,
      },
      required: true,
    },
    lottery_type: {
      type: String,
      enum: ['eng', 'laos', 'hanoi'],
      required: true,
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

export const LotteryModel = mongoose.model('lottery', LotterySchema);
