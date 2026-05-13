import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteAllStudents,
  getUnclassifiedStudents,
} from '../controllers/studentController.js';
import { validateCreateStudent, validateUpdateStudent } from '../validators/studentValidator.js';
import { validateId } from '../validators/idValidator.js';

const router = express.Router();

router.route('/')
  .get(getStudents)
  .post(validateCreateStudent, createStudent)
  .delete(deleteAllStudents);
  
router.route('/unclassified')
  .get(getUnclassifiedStudents);

router.route('/:id')
  .get(validateId, getStudentById)
  .put(validateId, validateUpdateStudent, updateStudent)
  .delete(validateId, deleteStudent);


export default router;
