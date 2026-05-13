import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateCreateStudent = [
  body('studentName')
    .trim()
    .notEmpty().withMessage('Student name is required')
    .isLength({ min: 2, max: 25 }).withMessage('Student name must be between 2 and 25 characters'),
  body('contact')
    .optional()
    .isArray().withMessage('Contact must be an array'),
  body('contact.*.methodType')
    .notEmpty().withMessage('Contact method type is required')
    .isIn(['zalo', 'facebook', 'phoneNumber']).withMessage('Contact method type must be zalo, facebook, or phoneNumber'),
  body('contact.*.value')
    .trim()
    .notEmpty().withMessage('Contact value is required'),
  validate,
];

export const validateUpdateStudent = [
  body('studentName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 25 }).withMessage('Student name must be between 2 and 25 characters'),
  body('contact')
    .optional()
    .isArray().withMessage('Contact must be an array'),
  body('contact.*.methodType')
    .optional()
    .isIn(['zalo', 'facebook', 'phoneNumber']).withMessage('Contact method type must be zalo, facebook, or phoneNumber'),
  body('contact.*.value')
    .optional()
    .trim()
    .notEmpty().withMessage('Contact value cannot be empty if provided'),
  validate,
];
