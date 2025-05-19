// import { NextFunction, Request, Response } from "express";
// import { productsModel } from "../modules/products/products.model";

// declare global {
//   namespace Express {
//     interface Request {
//       files?:
//         | { [fieldname: string]: Express.Multer.File[] }
//         | Express.Multer.File[];
//     }
//   }
// }

// interface IProcessProductMedia {
//   fields: {
//     fieldName: string;
//     isMultiple?: boolean;
//   }[];
// }

// export const updateProductProcessMedia = ({ fields }: IProcessProductMedia) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//       const updatedBody: any = {
//         ...req.body,
//       };
//       let existingProduct: any = null;
//       existingProduct = await productsModel.findById(req.params.id).lean();

//       for (const field of fields) {
//         const { fieldName, isMultiple } = field;

//         if (files && files[fieldName]) {
//           updatedBody[fieldName] = isMultiple
//             ? files[fieldName].map((file) => file.path.replace(/\\/g, "/"))
//             : files[fieldName][0].path.replace(/\\/g, "/");
//         } else if (existingProduct) {
//           updatedBody[fieldName] = existingProduct[fieldName]; // retain existing if not sent
//         } else {
//           updatedBody[fieldName] = isMultiple ? [] : null;
//         }
//       }
//       req.body = updatedBody;
//       next();
//     } catch (error) {
//       res.status(400).json({
//         error:
//           error instanceof Error
//             ? error.message
//             : "Something went wrong while processing product media.",
//       });
//     }
//   };
// };
