import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 25,
    },
    contact: [
      {
        _id: false,
        methodType: {
          type: String,
          enum: ['zalo', 'facebook', 'phoneNumber'],
          required: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
