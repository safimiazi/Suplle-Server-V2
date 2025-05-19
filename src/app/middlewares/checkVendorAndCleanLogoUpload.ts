// import { Request, Response, NextFunction } from "express";
// import { usersModel } from "../modules/users/user/users.model";
// import { vendorsModel } from "../modules/vendors/vendors.model";
// import path from "path";
// import fs from "fs";

// export const checkVendorAndCleanLogoUpload = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { email, phone } = req.body;

//     if (!email) {
//       throw new Error("Email is required.");
//     }

//     const user = await usersModel.findOne({ $or: [{ email }, { phone }] });

//     // If user exists, check for vendor entry
//     if (user) {
//       const existingVendor = await vendorsModel.findOne({ user: user._id });

//       if (existingVendor) {
//         // Remove uploaded logo if it exists
//         if (req.body.logo) {
//           const uploadedLogoPath = path.join(
//             __dirname,
//             `../../../uploads`,
//             path.basename(req.body.logo)
//           );

//           if (fs.existsSync(uploadedLogoPath)) {
//             fs.unlinkSync(uploadedLogoPath);
//           }
//         }

//         // Send response accordingly
//         if (existingVendor.isVarified) {
//           throw new Error("You are already a verified vendor.");
//         } else {
//           throw new Error(
//             "You have already submitted a vendor request. It is pending admin verification."
//           );
//         }
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
