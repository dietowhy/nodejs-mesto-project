import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import {
  NotFoundError,
  ForbiddenError,
} from '../models/errors';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = new Card({ name, link, owner });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params.cardId;
    const userId = req.user?._id;
    const card = await Card.findOne({ _id: cardId });

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Недостаточно прав');
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: 'Карточка удалена' });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const deleteCardLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true, runValidators: true, strict: "throw" }
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};