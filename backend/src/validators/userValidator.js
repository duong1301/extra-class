import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate,
];

export const validateUpdateUser = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').optional().trim().isEmail().withMessage('Invalid email format'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate,
];
