declare namespace Service {
  type ResponseSuccess<T> = T extends unknown
    ? { status: 'Success' }
    : { status: 'Success'; data: T };

  interface ResponseError {
    status: 'Error';
    message: string;
  }

  type ResponseSuccess<T> = T extends null | undefined
  ? {
    status: 'Success'
  }
  : {
    status: 'Success',
    data: T
  }

  interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
  }
}
