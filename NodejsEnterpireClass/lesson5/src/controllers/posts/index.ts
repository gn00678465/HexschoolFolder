import { Request, Response, NextFunction } from 'express';
import { Post, User } from '../../models';
import { execStrategyActions, handleErrorAsync, appError } from '../../utils';

interface Params {
  id?: string;
}

interface Body {
  user: string;
  content: string;
}

interface Query {
  q?: string;
  timeSort?: 'asc' | 'desc';
}

type PostRequest = Request<Params, any, Body, Query>;

export const getPosts = handleErrorAsync(async function(
  req: PostRequest,
  res: Response,
  next: NextFunction
) {
  const q = req.query?.q ? { content: new RegExp(req.query.q, 'i') } : {};
  const timeSort = req.query?.timeSort === 'asc' ? 'asc' : 'desc';
  const posts = await Post.find(q)
    .populate({
      path: 'user',
      model: User,
      select: 'name photo'
    })
    .sort({ createAt: timeSort });

  res.status(200).json({
    status: 'Success',
    data: posts
  });
});

export const createNewPost = handleErrorAsync(async function(
  req: PostRequest,
  res: Response,
  next: NextFunction
) {
  let error = false;
  const actions: Common.StrategyActions = [
    [
      !req.body?.user || !req.body?.content,
      () => {
        error = true;
        next(appError(400, '欄位未填寫正確!'));
      }
    ]
  ];

  execStrategyActions(actions);

  if (!error) {
    const newPost = await Post.create({
      user: req.body.user,
      content: req.body.content
    });
    res.status(200).json({
      status: 'success',
      data: newPost
    });
  }
});

export const deletePostWithId = handleErrorAsync(async function(
  req: PostRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const result = await Post.findByIdAndDelete(id);
  if (result) {
    res.status(200).json({
      status: 'Success'
    });
  } else {
    next(appError(400, `${id} 不存在`));
  }
});
