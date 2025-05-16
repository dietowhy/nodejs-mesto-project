import express, { Request, Response, NextFunction} from 'express';
import { MONGODB_URI, PORT } from './configs/db';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes';
import cardRouter from './routes/cardRoutes';
import {} from './types/express'

const app = express();

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '682231727c0f619f11f3f521'
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});