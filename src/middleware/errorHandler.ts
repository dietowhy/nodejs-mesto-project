import { Request, Response } from 'express';

export const errorHandler = (req: Request, res: Response) => {
  res.status(404).send({message: 'Тут ничего нет.'})
};