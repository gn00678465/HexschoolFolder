import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';
import { execStrategyActions, handleErrorAsync, appError } from '../../utils';

interface Body {
    name: string;
    email: string;
  }
  
  interface Params {
    id?: string;
  }
  
  interface UserRequest extends Request<Params> {
    body: Body;
  }

export const getUsers = handleErrorAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: users
  });
});

export const createUser = handleErrorAsync(async function(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  let error = false;
  const data = req.body;
  const actions: Common.StrategyActions = [
    [
      !data.email || !data.name,
      () => {
        error = true;
        next(appError(400, 'name, email 必填'));
      }
    ],
    [
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(data.email),
      () => {
        error = true;
        next(appError(400, '信箱格式錯誤!'));
      }
    ]
  ];

  execStrategyActions(actions);

  if (!error) {
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      photo:
          'https://images.unsplash.com/photo-1680372669294-570f598ce2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80'
    });
    res.status(200).json({
      status: 'success',
      data: newUser
    });
  }

  
});

export const updateUser = handleErrorAsync(async function(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const data = req.body;
  let error = false;
  const actions: Common.StrategyActions = [
    [
      id === ':id',
      () => {
        error = true;
        next(appError(400, '請填入正確 ID!'));
      }
    ],
    [
      !data.email || !data.name,
      () => {
        error = true;
        next(appError(400, 'name, email 必填'));
      }
    ],
    [
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(data.email),
      () => {
        error = true;
        next(appError(400, '信箱格式錯誤!'));
      }
    ]
  ];
  execStrategyActions(actions);

  if (!error) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        name: data.name,
        email: data.email
      }
    );
    res.status(200).json({
      status: 'Success'
    });
  }
});