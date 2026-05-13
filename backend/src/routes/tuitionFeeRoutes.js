import express from 'express';
import { getAllTuitionFeesHandler, getTuitionFeeByClassController, getTuitionFeeByIdController, updateTuitionFeeStatusController } from '../controllers/tuitionFeeController.js';

const router = express.Router();


// Get all tuition fees
router.get('/', getAllTuitionFeesHandler);

// Get tuition fees Id
router.get('/:tuitionFeeId', getTuitionFeeByIdController );

// Get tuition fees by class
router.get('/class/:classId', getTuitionFeeByClassController)

//update tuition fee status
router.patch('/:tuitionFeeId/status', updateTuitionFeeStatusController)

export default router;