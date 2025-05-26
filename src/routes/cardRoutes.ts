import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteCardLike,
} from '../controllers/cardController';
import {
  validateCardId,
  validateCreateCard,
} from '../middleware/validator'

const router = Router();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, deleteCardLike);

export default router;