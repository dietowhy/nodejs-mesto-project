import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtConfig from '../configs/jwt';
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from '../models/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, about, avatar, email, password: hashPassword });
    const userWithoutPassword = await User.findById(user._id).select('-password');

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(error);
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true, strict: "throw"}
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      jwtConfig.secret,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({ message: 'Авторизация прошла успешно' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};