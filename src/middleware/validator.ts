import { celebrate, Joi, Segments } from 'celebrate'

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
})

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
})

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().alphanum().required().length(24),
  }),
})

export const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
})

export const validateAvatarUpdate = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().required().uri(),
  }),
})

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    })
    .unknown(true),
})

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().alphanum().required().length(24),
  }),
})