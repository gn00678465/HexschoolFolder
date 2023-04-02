import createError from 'http-errors';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import { posts, users } from './routes';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

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
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
app.use(errorHandler);

export default app;
