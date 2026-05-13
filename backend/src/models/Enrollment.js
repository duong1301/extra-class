import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    start: {
      type: Date,
      required: true,
      default: Date.now, // Tự động lấy thời điểm hiện tại nếu không truyền vào
    },
    end: {
      type: Date, // Thời điểm rời lớp (nếu có)
    },
    status: {
      type: String,
      enum: ['active', 'dropped', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo 1 học sinh không đăng ký trùng 1 lớp nhiều lần
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
