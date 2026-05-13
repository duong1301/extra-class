import express from 'express';
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  deleteAllEnrollments,
  getEnrollmentsByClass,
  getEnrollmentByStudent,
  createMultipleEnrollmentsController,
} from '../controllers/enrollmentController.js';
import { validateCreateEnrollment, validateUpdateEnrollment } from '../validators/enrollmentValidator.js';
import { validateId } from '../validators/idValidator.js';

const router = express.Router();

router.route('/')
  .get(getEnrollments)
  .post(validateCreateEnrollment, createEnrollment)

router.post('/multiple', createMultipleEnrollmentsController);

router.route('/:id')
  .get(validateId, getEnrollmentById)
  .put(validateId, validateUpdateEnrollment, updateEnrollment)
  .delete(validateId, deleteEnrollment);

router.get(`/class/:classId`, getEnrollmentsByClass);
router.get(`/student/:studentId`, getEnrollmentByStudent);

export default router;
