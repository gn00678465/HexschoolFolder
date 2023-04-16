import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../models';
import isEmail from 'validator/lib/isEmail';
import validator from 'validator';
import {
  execStrategyActions,
  handleErrorAsync,
  appError,
  crypt,
  compare,
  generateJWT
} from '../../utils';

interface LoginBody {
  email: string;
  password: string;
}

interface SignUpBody extends LoginBody {
  name: string;
  confirmPassword: string;
}

export const signUpController = handleErrorAsync(
  async (req: Request<unknown, unknown, SignUpBody>, res, next) => {
    let error = false;
    const { name, password, confirmPassword, email } = req.body;
    const actions: Common.StrategyActions = [
      [
        !name || !email || !password || !confirmPassword,
        () => {
          error = true;
          next(appError(400, '必須填入相關欄位！'));
        }
      ],
      [
        Boolean(email) && !isEmail(email),
        () => {
          error = true;
          next(appError(400, 'Email 格式不正確！'));
        }
      ],
      [
        Boolean(password) && !validator.isLength(password, { min: 8 }),
        () => {
          error = true;
          next(appError(400, '密碼字數不得小於 8 碼！'));
        }
      ],
      [
        password !== confirmPassword,
        () => {
          error = true;
          next(appError(400, '密碼不一致！'));
        }
      ]
    ];

    execStrategyActions(actions);

    if (!error) {
      const pwd = await crypt(password);
      await UserModel.create({
        email,
        password: pwd,
        name
      });
      res.json({
        status: 'Success'
      });
    }
  }
);

export const logInController = handleErrorAsync(
  async (req: Request<unknown, unknown, LoginBody>, res, next) => {
    const { email, password } = req.body;
    let error = false;
    const actions: Common.StrategyActions = [
      [
        !email || !password,
        () => {
          error = true;
          next(appError(400, '必須填入相關欄位！'));
        }
      ],
      [
        Boolean(email) && !isEmail(email),
        () => {
          error = true;
          next(appError(400, 'Email 格式不正確！'));
        }
      ],
      [
        Boolean(password) && !validator.isLength(password, { min: 8 }),
        () => {
          error = true;
          next(appError(400, '密碼字數不得小於 8 碼！'));
        }
      ]
    ];

    execStrategyActions(actions);

    if (!error) {
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        return next(appError(400, '此用戶不存在!'));
      }
      const auth = await compare(password, user.password);

      if (!auth) {
        return next(appError(400, '帳號或密碼錯誤!'));
      }

      res.json({
        status: 'Success',
        data: {
          token: generateJWT({ id: user._id }),
          userInfo: {
            name: user.name
          }
        }
      });
    }
  }
);

interface NewPasswdRequest
  extends Request<
    unknown,
    unknown,
    { password: string; confirmPassword: string }
  > {
  id: string;
}

export const changePasswdController = handleErrorAsync<NewPasswdRequest>(
  async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    let error = false;
    const actions: Common.StrategyActions = [
      [
        !password || !confirmPassword,
        () => {
          error = true;
          next(appError(400, '請填入新密碼！'));
        }
      ],
      [
        password !== confirmPassword,
        () => {
          error = true;
          next(appError(400, '密碼不一致！'));
        }
      ],
      [
        Boolean(password) && !validator.isLength(password, { min: 8 }),
        () => {
          error = true;
          next(appError(400, '密碼字數不得小於 8 碼！'));
        }
      ]
    ];

    execStrategyActions(actions);
    if (!error) {
      const pwd = await crypt(password);
      const user = await UserModel.findByIdAndUpdate(req.id, {
        password: pwd
      });
      console.log(user);
      res.json({
        status: 'Success',
        data: {
          token: generateJWT({ id: user?._id })
        }
      });
    }
  }
);

export const getProfile = handleErrorAsync<NewPasswdRequest>(
  async (req, res, next) => {
    const userInfo = await UserModel.findById(req.id).select('+email');
    res.json({
      status: 'Success',
      data: {
        userInfo
      }
    });
  }
);

interface NewProfileRequest
  extends Request<unknown, unknown, { name: string; email: string }> {
  id: string;
}

export const updateProfile = handleErrorAsync<NewProfileRequest>(
  async (req, res, next) => {
    let error = false;
    const { name, email } = req.body;
    const actions: Common.StrategyActions = [
      [
        !name || !email,
        () => {
          error = true;
          next(appError(400, '必須填入相關欄位！'));
        }
      ],
      [
        Boolean(email) && !isEmail(email),
        () => {
          error = true;
          next(appError(400, 'Email 格式不正確！'));
        }
      ]
    ];

    execStrategyActions(actions);

    if (!error) {
      const user = await UserModel.findByIdAndUpdate(
        req.id,
        {
          name,
          email
        },
        { new: true, select: '+email' }
      );
      res.json({
        status: 'Success',
        data: {
          userInfo: user
        }
      });
    }
  }
);
