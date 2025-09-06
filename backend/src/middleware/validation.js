const Joi = require('joi');
const { validation } = require('../config');

/**
 * Validation middleware factory
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorMessage,
      });
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // Candidate validation
  candidate: Joi.object({
    name: Joi.string()
      .min(validation.name.minLength)
      .max(validation.name.maxLength)
      .trim()
      .required()
      .messages({
        'string.empty': 'Nome é obrigatório',
        'string.min': `Nome deve ter pelo menos ${validation.name.minLength} caracteres`,
        'string.max': `Nome deve ter no máximo ${validation.name.maxLength} caracteres`,
      }),
    email: Joi.string()
      .email()
      .min(validation.email.minLength)
      .max(validation.email.maxLength)
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.empty': 'Email é obrigatório',
        'string.email': 'Email deve ter um formato válido',
        'string.min': `Email deve ter pelo menos ${validation.email.minLength} caracteres`,
        'string.max': `Email deve ter no máximo ${validation.email.maxLength} caracteres`,
      }),
  }),

  // Interview start validation
  interviewStart: Joi.object({
    name: Joi.string()
      .min(validation.name.minLength)
      .max(validation.name.maxLength)
      .trim()
      .required(),
    email: Joi.string()
      .email()
      .min(validation.email.minLength)
      .max(validation.email.maxLength)
      .lowercase()
      .trim()
      .required(),
    jobProfile: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.empty': 'Perfil da vaga é obrigatório',
        'string.min': 'Perfil da vaga deve ter pelo menos 2 caracteres',
        'string.max': 'Perfil da vaga deve ter no máximo 100 caracteres',
      }),
  }),

  // Message validation
  message: Joi.object({
    message: Joi.string()
      .min(validation.message.minLength)
      .max(validation.message.maxLength)
      .trim()
      .required()
      .messages({
        'string.empty': 'Mensagem é obrigatória',
        'string.min': `Mensagem deve ter pelo menos ${validation.message.minLength} caractere`,
        'string.max': `Mensagem deve ter no máximo ${validation.message.maxLength} caracteres`,
      }),
  }),

  // UUID parameter validation
  uuid: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'ID deve ser um UUID válido',
        'any.required': 'ID é obrigatório',
      }),
  }),
};

module.exports = {
  validate,
  schemas,
};
