const Joi = require("joi");

exports.createAuthor = Joi.object({
  name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.empty": "Author name is required",
      "any.required": "Author name is required",
      "string.max": "Author name cannot exceed 100 characters",
    }),
});

exports.updateAuthor = Joi.object({
  name: Joi.string()
    .max(100)
    .messages({
      "string.empty": "Author name cannot be empty",
      "string.max": "Author name cannot exceed 100 characters",
    }),
}).min(1);
