import express, { Request } from 'express';
import { Post, User } from '../../models';
import { handleError } from '../../utils';

const router = express.Router();

interface Params {
  id?: string;
}

interface Body {
  user: string;
  content: string;
}

interface Query {
  q?: string;
  timeSort?: 'asc' | 'desc'
}

type PostRequest = Request<Params, any, Body, Query>

router.get('/', async (req: PostRequest, res) => {
  try {
    const q = !!req.query?.q ? { content: new RegExp(req.query.q, 'i') } : {};
    const timeSort = req.query?.timeSort === 'asc' ? "asc" : "desc";
    const posts = await Post.find(q).populate({
      path: 'user',
      model: User,
      select: 'name photo'
    }).sort({ createAt: timeSort });

    res.status(200).json({
      status: 'success',
      data: posts
    })
  }
  catch (err) {
    handleError(res, 500, 'Server Error');
  }
});

router.post('/', async (req: PostRequest, res) => {
  if (!req.body?.user || !req.body?.content) {
    handleError(res, 400, '欄位未填寫正確，或無此 todo ID');
  } else {
    const newPost = await Post.create({
      user: req.body.user,
      content: req.body.content
    });
    res.status(200).json({
      status: 'success',
      data: newPost
    })
  }
});

router.delete('/delete/:id', async (req: PostRequest, res) => {
  const { id } = req.params;
  const result = await Post.findByIdAndDelete(id);
  if (result) {
    res.status(200).json({
      status: 'success'
    })
  } else {
    handleError(res, 400,  `${id} 不存在`);
  }
})

export default router;