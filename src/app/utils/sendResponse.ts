import { Response, response } from "express";

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    status: data.statusCode,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
