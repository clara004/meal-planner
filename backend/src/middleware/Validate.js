const { body, validationResult } = require('express-validator');

// reusable function — checks if validation passed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// recipe validation rules
const recipeRules = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('servings')
    .notEmpty().withMessage('Servings is required')
    .isInt({ min: 1 }).withMessage('Servings must be at least 1'),

  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required'),

  body('ingredients.*.name')
    .notEmpty().withMessage('Each ingredient must have a name'),

  body('ingredients.*.quantity')
    .isNumeric().withMessage('Ingredient quantity must be a number'),

  body('steps')
    .isArray({ min: 1 }).withMessage('At least one step is required'),

  body('prepTime')
    .optional()
    .isInt({ min: 1 }).withMessage('Prep time must be a positive number'),

  body('cookTime')
    .optional()
    .isInt({ min: 1 }).withMessage('Cook time must be a positive number'),
];

module.exports = { validate, recipeRules };