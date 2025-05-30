import express from 'express';
import { MONGODB_URI, PORT } from './configs/db';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes';
import cardRouter from './routes/cardRoutes';
import { createUser, login } from './controllers/userController';
import { requestLog, errorLog } from './middleware/logger';
import auth from './middleware/auth';
import {} from './types/express'
import { errors } from 'celebrate';
import {
  validateCreateUser,
  validateLogin,
} from './middleware/validator'


const app = express();

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(express.json());

app.use(requestLog);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors());
app.use(errorLog);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});