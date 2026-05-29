const Joi = require("joi");

exports.createBook = Joi.object({
  title: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.empty": "Book title is required",
      "any.required": "Book title is required",
      "string.max": "Book title cannot exceed 255 characters",
    }),
  authorId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Author ID must be a number",
      "number.integer": "Author ID must be an integer",
      "number.positive": "Author ID must be a positive number",
      "any.required": "Author ID is required",
    }),
  content: Joi.string().max(50000).allow(null, ""),
  publishedYear: Joi.number().integer().min(0).allow(null),
});

exports.updateBook = Joi.object({
  title: Joi.string()
    .max(255)
    .messages({
      "string.empty": "Book title cannot be empty",
      "string.max": "Book title cannot exceed 255 characters",
    }),
  authorId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Author ID must be a number",
      "number.integer": "Author ID must be an integer",
      "number.positive": "Author ID must be a positive number",
    }),
  content: Joi.string().max(50000).required().messages({
    "string.max": "Content cannot exceed 50000 characters",
    "string.empty": "Content is required"
  }),
  publishedYear: Joi.number().integer().min(0).allow(null),
}).min(1);