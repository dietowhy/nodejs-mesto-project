import 'dotenv/config';
import crypto from 'crypto';

const secretKey = crypto.randomBytes(16).toString('hex');

export default {
  secret: process.env.JWT_SECRET || secretKey,
};