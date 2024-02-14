const { body, validationResult, param, query } = require('express-validator');
const User = require('../models/taskModel');
const AppError = require('./appError');

exports.validator = {
  // Users Validators
  CreateTask: [
    body('title').notEmpty().withMessage('Title can not be empty'),
    body('description').notEmpty().withMessage('Description can not be empty.'),
  ],


  changePosition: [body('data').notEmpty().isArray().withMessage('Data can not be empty.')],

  updateTaskStatus: [
    body('status')
      .notEmpty().withMessage('Status is required.') // Ensure status is provided
      .isIn(['todo', 'in-progress', 'done']).withMessage('Status must be one of "todo", "in-progress", or "done".') // Allow all valid status values
      .customSanitizer((value) => value.toLowerCase()) // Sanitize to lowercase for case-insensitive comparison
  ],

};

exports.validateResponse = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors
      .array()
      .map((err) => {
        return `${err.msg}`;
      })
      .join(', ');

    return res.status(400).json({ status: 'error', message: msg });
  }

  next();
};
