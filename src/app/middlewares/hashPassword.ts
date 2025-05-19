import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import status from "http-status";
import bcrypt from "bcryptjs";

const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    if (!password) {
      throw new AppError(status.BAD_REQUEST, "Password is required");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.HASHING_SALT)
    );
    //    replace original password with hashed password
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
};

export default hashPassword;
