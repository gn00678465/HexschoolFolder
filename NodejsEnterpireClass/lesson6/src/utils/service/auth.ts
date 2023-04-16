import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError, handleErrorAsync } from './error';

export function generateJWT<T extends object>(data: T) {
  return jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
}

export function verifyJWT<T>(token: string) {
  return new Promise<[Error, null] | [null, T]>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) {
        reject(err);
      }
      if (payload) {
        resolve([null, payload as T]);
      }
    });
  });
}

export function getToken(req: Request) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return undefined;
}

interface DecodedJWT {
  id: string;
  lat: Date;
  exp: Date;
}

export interface Req extends Request {
  id: string;
}

export const isAuth = handleErrorAsync<Req>(
  async (req: Req, res: Response, next: NextFunction) => {
    const token = getToken(req);
    if (!token) {
      return next(appError(401, '你尚未登入！'));
    } else {
      const [err, decoded] = await verifyJWT<DecodedJWT>(token);
      if (err) {
        return next(appError(400, 'Token 不正確'));
      } else {
        req.id = decoded.id;
        next();
      }
    }
  }
);
