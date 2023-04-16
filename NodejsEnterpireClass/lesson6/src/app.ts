import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './utils';
import { userRouter, postRouter } from './routes';

dotenv.config();

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => console.log('資料庫連接成功'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/users', userRouter);
app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'Page not found!'));
});

// error handler
app.use(errorHandler);

export default app;
