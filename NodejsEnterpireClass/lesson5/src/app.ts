import createError from 'http-errors';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import { posts, users } from './routes';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './utils';

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

app.use('/posts', posts);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'Page not found!'));
});

// error handler
app.use(errorHandler);

export default app;
