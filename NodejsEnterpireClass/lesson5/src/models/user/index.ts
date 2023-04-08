import { Schema, Model, Document, model } from 'mongoose';

interface UserDocument extends Document {
  name: string;
  email: string;
  photo: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, '請輸入您的名字']
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false
  },
  photo: String
});

export const User: Model<UserDocument> = model<UserDocument>(
  'user',
  userSchema
);
