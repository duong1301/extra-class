import { getClassByIdService } from '../services/classService.js';
import { createEnrollmentService } from '../services/enrollmentService.js';
import {
  getStudentsService,
  getStudentByIdService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
  deleteAllStudentsService,
  getUnclassifiedStudentsService,
} from '../services/studentService.js';

export const getStudents = async (req, res) => {
  try {

    const {search, classId, pageSize, pageIndex} = req.query;

    const filter = {search, classId}
    const paginationOptions = {
      pageSize: parseInt(pageSize)||1,
      pageIndex: parseInt(pageIndex)||1,
    }
    const students = await getStudentsService(filter, paginationOptions);
    res.status(200).json({ success: true,pageSize, pageIndex, search,classId, total: students.total, data: students.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await getStudentByIdService(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUnclassifiedStudents = async (req, res) => {
  try {

    const students = await getUnclassifiedStudentsService();  
    
    return res.status(200).json({ success: true, data: students });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const createStudent = async (req, res) => {
  try {
    const { studentName, contact, classId } = req.body;
    //Kiểm tra lớp có hợp lệ?
    if(classId){
      const classInstance = await getClassByIdService(classId)
      if(!classInstance) return res.status(400).json({success:false, message:"Lớp học không hợp lệ"})
          
    }
    //
    const newStudent = await createStudentService({ studentName, contact });
    const {_id} = newStudent;

    if(classId){
      createEnrollmentService({studentId:_id, classId})
    }
    
    res.status(201).json({ success: true, data: newStudent, message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await updateStudentService(req.params.id, req.body);
    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: updatedStudent, message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await deleteStudentService(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAllStudents = async (req, res) => {
  try {
    const result = await deleteAllStudentsService();
    res.status(200).json({ success: true, message: `Successfully deleted ${result.deletedCount} students` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
