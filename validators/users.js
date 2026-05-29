const Joi = require("joi");

exports.userRegistration = Joi.object({
    firstName: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'any.required': 'First name is required',
            'string.max': 'First name cannot exceed 50 characters'

        }),

    lastName: Joi.string()
    .max(50)
    .optional()
    .messages({
        'string.max': 'Last name cannot exceed 50 characters'
    }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password cannot exceed 20 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),
    role: Joi.string()
    .valid('USER', 'ADMIN')
    .required()
    .messages({
        'any.only': 'Role must be either USER or ADMIN',
        'any.required': 'Role is required'

    })});



    exports.login = Joi.object({
        
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
    .required()
    .messages({
        
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),
    })