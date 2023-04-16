import type { Response, Request, NextFunction, ErrorRequestHandler } from 'express';

export function appError(statusCode: number, message: string) {
  const error = new Error(message) as Service.AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

type Callback<Req> = (
  req: Req,
  res: Response,
  next: NextFunction
) => Promise<void>;
interface Options {
  onError: (e: Service.AppError) => NextFunction;
}
export function handleErrorAsync<Req = Request>(
  cb: Callback<Req>,
  opts?: Options
): (req: Request, res: Response, next: NextFunction) => void;
export function handleErrorAsync<Req = Request>(
  cb: Callback<Req>,
  opts?: Options
) {
  return function (req: Req, res: Response, next: NextFunction) {
    const onError =
      opts?.onError ||
      function (err) {
        return next(err);
      };
    cb(req, res, next).catch(onError);
  };
}

export const errorHandler: ErrorRequestHandler = function (
  err: Service.AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (req.app.get('env') === 'development') {
    res.status(err.statusCode || 500);
    return resErrorDev(err, res);
  }

  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入!';
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
};

function resErrorDev(err: Service.AppError, res: Response) {
  res.json({
    status: 'Error',
    message: err.message,
    error: err,
    stack: err.stack
  });
}

function resErrorProd(err: Service.AppError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'Error',
      message: err.message
    });
  } else {
    console.error('出現重大錯誤', err);
    res.status(500).json({
      status: 'Error',
      message: '系統錯誤，請聯繫系統管理員'
    });
  }
}