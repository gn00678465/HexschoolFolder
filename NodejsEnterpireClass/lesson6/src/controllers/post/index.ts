import { Request, Response, NextFunction } from 'express';
import { handleErrorAsync, appError, execStrategyActions } from '../../utils';
import { PostModel, UserModel } from '../../models';

interface Body {
  user: string;
  content: string;
}

interface Query {
  q?: string;
  timeSort?: 'asc' | 'desc';
}

interface PostRequest extends Request<unknown, unknown, Body, Query> {
  id: string;
}

export const getAllPosts = handleErrorAsync<PostRequest>(
  async (req, res, next) => {
    const q = req.query?.q ? { content: new RegExp(req.query.q, 'i') } : {};
    const timeSort = req.query?.timeSort === 'asc' ? 'asc' : 'desc';
    const data = await PostModel.find(q)
      .populate({
        path: 'user',
        model: UserModel,
        select: 'name photo'
      })
      .sort({ createAt: timeSort });
    res.json({
      status: 'Success',
      data
    });
  }
);

export const createPost = handleErrorAsync<PostRequest>(
  async (req, res, next) => {
    let error = false;
    const actions: Common.StrategyActions = [
      [
        !req.body?.content,
        () => {
          error = true;
          next(appError(400, '請填寫內容!'));
        }
      ]
    ];

    execStrategyActions(actions);

    if (!error) {
      const newPost = await PostModel.create({
        user: req.id,
        content: req.body.content
      });
      res.status(200).json({
        status: 'success',
        data: newPost
      });
    }
  }
);
