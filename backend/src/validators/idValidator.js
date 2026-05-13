import { param } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];
