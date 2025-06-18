import { NextFunction, Request, Response } from "express";





import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import status from "http-status";
import { UserModel } from "../modules/users/user/users.model";
import config from "../config";

export const authenticate = (...allowedRoles: string[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {


  const token = req.headers.authorization;

  if (!token) {
    throw new Error("No token provided");
  }
  try {
    const decoded = (await jwt.verify(
      token,
      config.JWT_ACCESS_TOKEN_SECRET as string
    )) as JwtPayload;

    // console.log(decoded)

    if (!decoded) {
      throw new Error("Invalid token");
    }
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      {
        throw new Error("User not found");
      }
    }


    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      throw new AppError(
        status.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }


    req.user = user as jwt.JwtPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        status.FORBIDDEN,
        "Token expired. Please login again."
      );
    }
    next(error);
  }
};

// export const authorize = (...roles: string[]): any => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not have permission",
//       });
//     }
//     next();
//   };
// };
// export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
// export const isVendor = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.role !== "vendor") {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
// export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.role !== "customer") {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
// export const isActive = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user.isActive) {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
// export const isDeleted = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user.isDeleted) {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
// export const isNotDeleted = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user.isDeleted) {
//     return res.status(403).json({
//       success: false,
//       message: "Forbidden",
//     });
//   }
//   next();
// };
