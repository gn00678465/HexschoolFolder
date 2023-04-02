import type { Response } from "express";

export function handleError(res: Response<Service.ResponseError>, statusCode: number, message: string) {
  return res.status(statusCode).json({
    status: 'Error',
    message
  });
};