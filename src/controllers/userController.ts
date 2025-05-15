import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при получении пользователей', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный ID пользователя' });
    }
    res.status(500).send({ message: 'Ошибка при получении пользователя', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка валидации', });
    }
    res.status(500).send({ message: 'Ошибка при создании пользователя', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true, strict: "throw"}
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка валидации' });
    }
    res.status(500).send({ message: 'Ошибка при обновлении пользователя', error });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Ошибка валидации' });
    }
    res.status(500).send({ message: 'Ошибка при обновлении аватара', error });
  }
};