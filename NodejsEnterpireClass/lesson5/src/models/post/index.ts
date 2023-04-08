import { Schema, Model, Document, model, Types } from 'mongoose';

const postSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Content 未填寫']
  },
  image: {
    type: String,
    default: ''
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  user: {
    type: Types.ObjectId,
    ref: 'user',
    required: [true, '貼文姓名未填寫']
  },
  likes: {
    type: Number,
    default: 0
  }
});

export const Post = model('post', postSchema);
