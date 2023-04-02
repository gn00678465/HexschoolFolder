(function () {
  const mongoose = require('mongoose');

  const postSchema = new mongoose.Schema({
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
      default: Date.now()
    },
    name: {
      type: String,
      required: [true, '貼文姓名未填寫']
    },
    likes: {
      type: Number,
      default: 0
    }
  });

  const Post = mongoose.model('post', postSchema);

  module.exports = Post;
})()