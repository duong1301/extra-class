import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateCreateEnrollment = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
    .isMongoId().withMessage('Invalid Student ID format'),
  body('classId')
    .notEmpty().withMessage('Class ID is required')
    .isMongoId().withMessage('Invalid Class ID format'),
  body('start')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('end')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  body('status')
    .optional()
    .isIn(['active', 'dropped', 'completed']).withMessage('Status must be active, dropped, or completed'),
  validate,
];

export const validateUpdateEnrollment = [
  body('studentId')
    .optional()
    .isMongoId().withMessage('Invalid Student ID format'),
  body('classId')
    .optional()
    .isMongoId().withMessage('Invalid Class ID format'),
  body('start')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  body('end')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  body('status')
    .optional()
    .isIn(['active', 'dropped', 'completed']).withMessage('Status must be active, dropped, or completed'),
  validate,
];
