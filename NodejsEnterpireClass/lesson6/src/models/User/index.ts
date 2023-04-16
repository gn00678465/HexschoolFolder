import { Schema, Model, Document, model } from 'mongoose';

interface UserDocument extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, '請輸入 User Name']
  },
  email: {
    type: String,
    required: [true, '請輸入 Email'],
    unique: true,
    lowercase: true,
    select: false
  },
  photo: String,
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: 8,
    select: false
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

export const UserModel: Model<UserDocument> = model<UserDocument>(
  'user',
  UserSchema
);
