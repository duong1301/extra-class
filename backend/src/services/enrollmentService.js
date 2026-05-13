import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import { initAttendanceService } from './attendanceService.js';
import { initTuitionFeeService } from './tuitionFeeService.js';
import { getClassByIdService } from './classService.js';
import mongoose from 'mongoose';

export const getEnrollmentsService = async () => {
  try {
    return await Enrollment.find()
      .populate('studentId', 'studentName contact')
      .populate('classId', 'className tuitionFee')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const getEnrollmentByIdService = async (id) => {
  try {
    return await Enrollment.findById(id)
      .populate('studentId', 'studentName contact')
      .populate('classId', 'className tuitionFee');
  } catch (error) {
    throw error;
  }
};

export const getEnrollmentByClassAndStudentService = async (classId, studentId) => {
  try {
    return await Enrollment.findOne({ classId, studentId });
  } catch (error) {
    throw error;
  }
};

export const getEnrollmentsByClassAndStudentIdsService = async (classId, studentIds) => {
  try {
    return await Enrollment.find({ classId, studentId: { $in: studentIds } })
  } catch (error) {
    throw error;
  }
};

export const getEnrollmentsByClassService = async (classId) => {
  try {
    const enrollments =  await Enrollment.aggregate([
      {
        $match:{
          classId: new mongoose.Types.ObjectId(classId)
        }
      },
      {
        $lookup:{
          from:"students",
          localField:"studentId",
          foreignField:"_id",
          as:"studentInfo"
        }
      },
      {
        $unwind:"$studentInfo"
      },
      {
        $project:{
          _id:0,
          studentId:"$studentId",
          studentName:"$studentInfo.studentName"
        }
      }
    ])
    

    return {classId, enrollments}

  } catch (error) {
    throw error;
  }
};

export const getEnrollmentByStudentService = async (studentId) => {
  try {
    return await Enrollment.find({ studentId })
      .populate('classId', 'className weeklySchedule')
      .populate('studentId', 'studentName')
      .sort({ createdAt: -1 });

  } catch (error) {
    throw error;
  }
};

export const getExistingEnrollmentsService = async (classId, studentIds) => {
  try {
    return await Enrollment.find({ classId, studentId: { $in: studentIds } });
    console.log('Existing enrollments:', existingEnrollments);
  } catch (error) {
    throw new Error('Lỗi khi kiểm tra enrollments tồn tại: ' + error.message);
  }

}

export const createEnrollmentService = async (enrollmentData) => {
  try {

    const newEnrollment = new Enrollment(enrollmentData);
    const savedEnrollment = await newEnrollment.save();

    //Tự động tạo bảng điểm danh trống với classId và studentId
    await initAttendanceService(
      savedEnrollment._id
    );

    const classInfo = await getClassByIdService(savedEnrollment.classId);
    const tuitionFee = classInfo.tuitionFee;

    //khởi tạo bảng học phí
    await initTuitionFeeService({
      enrollmentId: savedEnrollment._id,
      tuitionFee
    });

    return savedEnrollment;
  } catch (error) {
    throw error;
  }
};


export const createMultipleEnrollmentsService = async (enrollmentsData) => {
  try {
    const {classId, studentIds} = enrollmentsData;
    
    const createdEnrollments = [];
    for (const studentId of studentIds) {
      const enrollmentData = createEnrollmentService({ studentId, classId });
      createdEnrollments.push(enrollmentData);
    }

    return createdEnrollments;
  } catch (error) {
    throw error;
  }
};


export const updateEnrollmentService = async (id, updateData) => {
  try {
    return await Enrollment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  } catch (error) {
    throw error;
  }
};

export const deleteEnrollmentService = async (id) => {
  try {
    const enrollment = await Enrollment.findById(id);
    if (enrollment) {
      await Attendance.findOneAndDelete({ classId: enrollment.classId, studentId: enrollment.studentId });
    }
    return await Enrollment.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

export const deleteAllEnrollmentsService = async () => {
  try {
    await Attendance.deleteMany({});
    return await Enrollment.deleteMany({});
  } catch (error) {
    throw error;
  }
};


