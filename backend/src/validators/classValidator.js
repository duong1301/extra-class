import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateCreateClass = [
  body('className')
    .trim()
    .notEmpty().withMessage('Class name is required')
    .isLength({ min: 1, max: 20 }).withMessage('Class name must be between 1 and 20 characters'),
  body('tuitionFee')
    .notEmpty().withMessage('Tuition fee is required')
    .isNumeric().withMessage('Tuition fee must be a number')
    .custom((value) => value >= 0).withMessage('Tuition fee cannot be negative'),
  body('weeklySchedule')
    .isArray().withMessage('Weekly schedule must be an array')
    .notEmpty().withMessage('Weekly schedule is required'),
  body('weeklySchedule.*.dayOfWeek')
    .notEmpty().withMessage('Day of week is required')
    .isString().withMessage('Day of week must be a string'),
  body('weeklySchedule.*.startTime')
    .isArray({ min: 2, max: 2 }).withMessage('Start time must be an array of exactly 2 elements [hour, minute]')
    .custom((value) => {
      const [hour, minute] = value;
      if (typeof hour !== 'number' || typeof minute !== 'number') return false;
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return false;
      return true;
    }).withMessage('Start time hour must be 0-23 and minute must be 0-59'),
  body('weeklySchedule.*.duration')
    .notEmpty().withMessage('Duration is required')
    .isNumeric().withMessage('Duration must be a number')
    .custom((value) => value > 0).withMessage('Duration must be greater than 0'),
  validate,
];

export const validateUpdateClass = [
  body('className').optional().trim().isLength({ min: 1, max: 20 }).withMessage('Class name must be between 1 and 20 characters'),
  body('tuitionFee').optional().isNumeric().custom((value) => value >= 0).withMessage('Tuition fee cannot be negative'),
  body('weeklySchedule').optional().isArray().withMessage('Weekly schedule must be an array'),
  body('weeklySchedule.*.dayOfWeek').optional().isString().withMessage('Day of week must be a string'),
  body('weeklySchedule.*.startTime').optional()
    .isArray({ min: 2, max: 2 }).withMessage('Start time must be an array of exactly 2 elements [hour, minute]')
    .custom((value) => {
      const [hour, minute] = value;
      if (typeof hour !== 'number' || typeof minute !== 'number') return false;
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return false;
      return true;
    }).withMessage('Start time hour must be 0-23 and minute must be 0-59'),
  body('weeklySchedule.*.duration').optional().isNumeric().custom((value) => value > 0).withMessage('Duration must be greater than 0'),
  validate,
];
