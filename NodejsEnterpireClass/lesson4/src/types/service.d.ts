declare namespace Service {
  type ResponseSuccess<T> = T extends unknown ? { status: 'Success' } : { status: 'Success'; data: T }

  interface ResponseError {
    status: 'Error';
    message: string;
  }
}