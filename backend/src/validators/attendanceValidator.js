import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

export const validateClassAndStudentIdBody = [
  body('classId').notEmpty().withMessage('Class ID is required').isMongoId().withMessage('Invalid Class ID format'),
  body('studentId').notEmpty().withMessage('Student ID is required').isMongoId().withMessage('Invalid Student ID format'),
  validate,
];

export const validateDateBody = [
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Must be a valid date format (ISO8601)')
    .custom((value) => {
      const inputDate = new Date(value);
      if (isNaN(inputDate.getTime())) {
        throw new Error('Định dạng ngày không hợp lệ');
      }

      // Tách lấy phần YYYY-MM-DD để kiểm tra lỗi tự động nhảy ngày của JS (ví dụ 31/02 thành 03/03)
      const dateString = value.split('T')[0];
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const testDate = new Date(year, month, day);
        if (
          testDate.getFullYear() !== year ||
          testDate.getMonth() !== month ||
          testDate.getDate() !== day
        ) {
          throw new Error('Ngày tháng không tồn tại trên lịch thực tế (Ví dụ: tháng 2 không có ngày 30, 31)');
        }
      }

      const today = new Date();
      if (inputDate > today) {
        throw new Error('Ngày điểm danh không hợp lệ (không được vượt quá ngày hiện tại)');
      }
      return true;
    }),
  validate,
];

export const validateAddDateBulk = [
  body('classId')
    .notEmpty().withMessage('Class ID is required').isMongoId().withMessage('Invalid Class ID format'),
  body('studentIds')
    .notEmpty().withMessage('Student IDs is required').isArray({ min: 1 }).withMessage('Student ID must be an array of at least 1 element'),
  body('studentIds.*')
    .isMongoId().withMessage('Each item in Student ID must be a valid Mongo ID'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Must be a valid date format (ISO8601)')
    .custom((value) => {
      const inputDate = new Date(value);
      if (isNaN(inputDate.getTime())) {
        throw new Error('Định dạng ngày không hợp lệ');
      }

      const dateString = value.split('T')[0];
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const testDate = new Date(year, month, day);
        if (
          testDate.getFullYear() !== year ||
          testDate.getMonth() !== month ||
          testDate.getDate() !== day
        ) {
          throw new Error('Ngày tháng không tồn tại trên lịch thực tế (Ví dụ: tháng 2 không có ngày 30, 31)');
        }
      }

      const today = new Date();
      if (inputDate > today) {
        throw new Error('Ngày điểm danh không hợp lệ (không được vượt quá ngày hiện tại)');
      }
      return true;
    }),
  validate,
];

