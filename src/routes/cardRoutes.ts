import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteCardLike,
} from '../controllers/cardController';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteCardLike);

export default router;