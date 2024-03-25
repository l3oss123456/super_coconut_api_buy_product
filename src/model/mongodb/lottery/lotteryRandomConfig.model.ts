import mongoose from 'mongoose';

const LotteryRandomConfigSchema = new mongoose.Schema(
  {
    lottery_type: {
      type: String,
      enum: ['eng', 'laos', 'hanoi'],
      required: true,
    },
    is_start_random: {
      type: Boolean,
    },
    current_random_position: {
      type: Number,
    },
    start_spin_time: {
      type: String,
      default: null,
    },
    start_spin_time_cronjob_schedule: {
      type: String,
      default: null,
    },
    first_prize_spin_time: {
      type: String,
      default: null,
    },
    first_prize_spin_time_cronjob_schedule: {
      type: String,
      default: null,
    },
    second_prize_spin_time: {
      type: String,
      default: null,
    },
    second_prize_spin_time_cronjob_schedule: {
      type: String,
      default: null,
    },
    domain: {
      type: String,
      default: null,
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

export const LotteryRandomConfigModel = mongoose.model(
  'lottery_random_config',
  LotteryRandomConfigSchema,
);
