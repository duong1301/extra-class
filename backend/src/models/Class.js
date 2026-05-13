import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20,
    },
    tuitionFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    weeklySchedule: [
      {
        _id: false,
        dayOfWeek: {
          type: String,
          required: true,
        },
        startTime: {
          type: [Number],
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model('Class', classSchema);

export default Class;
