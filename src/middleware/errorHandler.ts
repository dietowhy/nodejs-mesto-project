import { Request, Response } from 'express';
import { Error as MongoError } from 'mongoose';
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
} from '../models/errors';

export const errorHandler = (
  err: Error | MongoError,
  req: Request,
  res: Response,
) => {
  if (
    err instanceof NotFoundError ||
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ConflictError ||
    err instanceof ForbiddenError
  ) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Ошибка валидации',
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Некорректный ID',
    });
  }

  console.error(err);
  res.status(500).json({
    message: 'На сервере произошла ошибка',
  });
};