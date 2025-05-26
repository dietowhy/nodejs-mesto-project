import mongoose, { Document, Types } from 'mongoose';

interface Card extends Document {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<Card>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        const regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
        return regexp.test(link);
      },
      message: 'Некорректная ссылка на карточку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: [
    {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: []
  },
],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Card>('card', cardSchema);