import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
    dates: [
      {
        type: Number,
        default: [],
        // validate: {
        //   validator: function (v) {
        //     if (v < 1) return false;
        //     if (this.month === 2 && this.year % 4 === 0) {
        //       return v <= 29;
        //     }
        //     if (this.month === 2) {
        //       return v <= 28;
        //     }
        //     if (this.month === 4 || this.month === 6 || this.month === 9 || this.month === 11) {
        //       return v <= 30;
        //     }
        //     return v <= 31;
        //   }
        // }
      }
    ]

  },
  {
    timestamps: true,
  }
);



const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
