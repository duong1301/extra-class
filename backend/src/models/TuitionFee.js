import mongoose from 'mongoose';

const tuitionFeeSchema = new mongoose.Schema(
  {
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    tuitionFee: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);



const TuitionFee = mongoose.model('TuitionFee', tuitionFeeSchema);

export default TuitionFee;
