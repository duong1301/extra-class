import express from 'express';
import {
    mock_createClassController,
    mock_createStudentController,
    mock_createEnrollmentController
} from '../controllers/mockController.js';

const router = express.Router();

router.post('/classes', mock_createClassController);
router.post('/students', mock_createStudentController);
router.post('/enrollments', mock_createEnrollmentController);

export default router