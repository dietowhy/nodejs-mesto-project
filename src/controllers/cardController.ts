import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при получении карточек', error });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = new Card({ name, link, owner });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при создании карточки', error });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }
    res.status(500).send({ message: 'Ошибка при удалении карточки', error });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.status(200).json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }
    res.status(500).send({ message: 'Ошибка при добавлении лайка', error });
  }
};

export const deleteCardLike = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.status(200).json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }
    res.status(500).send({ message: 'Ошибка при удалении лайка', error });
  }
};