import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../configs/jwt';
import {} from '../types/express';
import { UnauthorizedError } from '../models/errors';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as { _id: string };
    req.user = { _id: payload._id };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Срок действия токена истёк'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Неверный токен'));
    } else {
      next(err);
    }
  }
};

export default auth;