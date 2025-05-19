// import { NextFunction, Request, Response } from "express";

// // Extend the Request interface to include the user property
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }
// import jwt, { JwtPayload } from "jsonwebtoken";
// import AppError from "../errors/AppError";
// import status from "http-status";
// import { userModel } from "../modules/users/user/users.model";

// export const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     throw new Error("No token provided");
//   }
//   try {
//     const decoded = (await jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     )) as JwtPayload;

//     if (!decoded) {
//       throw new Error("Invalid token");
//     }
//     const user = await userModel.findById(decoded.userId);
//     if (!user || !user.isActive) {
//       {
//         throw new Error("User not found or inactive");
//       }
//     }

//     req.user = user as any;
//     next();
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       throw new AppError(
//         status.FORBIDDEN,
//         "Token expired. Please login again."
//       );
//     }
//     next(error);
//   }
// };
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
