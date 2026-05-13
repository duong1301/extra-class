import {
  getEnrollmentsService,
  getEnrollmentByIdService,
  getEnrollmentByClassAndStudentService,
  createEnrollmentService,
  updateEnrollmentService,
  deleteEnrollmentService,
  deleteAllEnrollmentsService,
  getEnrollmentsByClassService,
  getEnrollmentByStudentService,
  createMultipleEnrollmentsService,
  getExistingEnrollmentsService,
} from '../services/enrollmentService.js';
import { getStudentByIdService } from '../services/studentService.js';
import { getClassByIdService } from '../services/classService.js';


export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await getEnrollmentsService();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await getEnrollmentByIdService(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await getClassByIdService(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Lớp học không tồn tại!' });
    }

    const enrollments = await getEnrollmentsByClassService(classId);

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollmentByStudent = async (req, res) => {
  try {

    const studentId = req.params.studentId;

    const student = await getStudentByIdService(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Học sinh không tồn tại!' });
    }

    const enrollments = await getEnrollmentByStudentService(studentId);

    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

}

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, classId, studentIds } = req.body;

    // Kiểm tra học sinh có tồn tại không
    const student = await getStudentByIdService(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Học sinh không tồn tại!' });
    }

    // Kiểm tra lớp học có tồn tại không
    const classData = await getClassByIdService(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Lớp học không tồn tại!' });
    }

    // Kiểm tra trùng lặp thủ công(phòng trường hợp index DB chưa kịp build)
    const existingEnrollment = await getEnrollmentByClassAndStudentService(classId, studentId);
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Học sinh này đã được đăng ký vào lớp học này rồi!' });
    }

    const newEnrollment = await createEnrollmentService(req.body);
    res.status(201).json({ success: true, data: newEnrollment, message: 'Enrollment created successfully' });
  } catch (error) {
    // Bắt lỗi MongoDB mã 11000 (Duplicate Key) do unique index
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Học sinh này đã được đăng ký vào lớp học này rồi!' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMultipleEnrollmentsController = async (req, res) => {
  try {
    const enrollmentsData = req.body;
    const { classId, studentIds } = enrollmentsData;

    // Kiểm tra lớp học có tồn tại không
    const classData = await getClassByIdService(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Lớp học không tồn tại!' });
    } 

    // Kiểm tra từng học sinh có tồn tại không   
    for (const studentId of studentIds) {
      const student = await getStudentByIdService(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: `Học sinh với id ${studentId} không tồn tại!` });
      }
    } 

    const existingEnrollments = await getExistingEnrollmentsService(classId, studentIds);
    if (existingEnrollments.length > 0) {
      const existingStudentIds = existingEnrollments.map(enrollment => enrollment.studentId);
      console.log('Existing studentIds:', existingStudentIds);
      return res.status(400).json({ success: false, message: `Các học sinh với id ${existingStudentIds.join(', ')} đã được đăng ký vào lớp học này rồi!` });
    }

    const createdEnrollments = await createMultipleEnrollmentsService(enrollmentsData);
    res.status(201).json({ success: true, count: createdEnrollments.length, data: createdEnrollments, message: 'Enrollments created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (studentId) {
      const student = await getStudentByIdService(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Học sinh không tồn tại!' });
      }
    }

    if (classId) {
      const classData = await getClassByIdService(classId);
      if (!classData) {
        return res.status(404).json({ success: false, message: 'Lớp học không tồn tại!' });
      }
    }

    // Kiểm tra trùng lặp thủ công
    if (studentId || classId) {
      const currentEnrollment = await getEnrollmentByIdService(req.params.id);
      if (!currentEnrollment) {
        return res.status(404).json({ success: false, message: 'Enrollment not found' });
      }

      const checkStudentId = studentId || currentEnrollment.studentId;
      const checkClassId = classId || currentEnrollment.classId;

      const existingEnrollment = await getEnrollmentByClassAndStudentService(checkClassId, checkStudentId);
      if (existingEnrollment && existingEnrollment._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Học sinh này đã được đăng ký vào lớp học này rồi!' });
      }
    }

    const updatedEnrollment = await updateEnrollmentService(req.params.id, req.body);
    if (!updatedEnrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, data: updatedEnrollment, message: 'Enrollment updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Học sinh này đã được đăng ký vào lớp học này rồi!' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const deletedEnrollment = await deleteEnrollmentService(req.params.id);
    if (!deletedEnrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllEnrollments = async (req, res) => {
  try {
    const result = await deleteAllEnrollmentsService();
    res.status(200).json({ success: true, message: `Successfully deleted ${result.deletedCount} enrollments` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
