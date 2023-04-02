import express from 'express';
import { Post } from '../../models';

const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.status(200).json({
    status: 'success',
    data: posts
  })
});

router.post('/create', async (req, res) => {
  if (!req.body?.name || !req.body?.content) {
    res.status(400).json({
      status: 'error',
      message: '欄位未填寫正確，或無此 todo ID'
    })
  } else {
    const newPost = await Post.create({
      name: req.body.name,
      content: req.body.content
    });
    res.status(200).json({
      status: 'success',
      data: newPost
    })
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const result = await Post.findByIdAndDelete(id);
  if (result) {
    res.status(200).json({
      status: 'success'
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `${id} 不存在`
    });
  }
})

export default router;