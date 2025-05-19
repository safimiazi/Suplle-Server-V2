import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

import AppError from "../../errors/AppError";
import generateToken from "../../utils/generateToken";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IUser } from "../users/user/users.interface";
import { userModel } from "../users/user/users.model";
import { authService } from "./auth.service";
import { OwnerModel } from "../users/owner/owner.model";
import { RESTAURANT_STATUS } from "../restuarant/restuarant.constant";
import { OWNER_STATUS } from "../users/owner/owner.constant";
import { RestaurantModel } from "../restuarant/restuarant.model";

const restuarantRegisterRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const pendingRestuarant = await authService.restuarantRegisterRequestIntoDB(
      req.body
    );
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "An OTP has been sent to your email and phone for verification.",
      data: pendingRestuarant,
    });
  }
);

const otpValidation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.query.email as string;
    await authService.otpValidationIntoDB(req.body, userEmail);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "OTP verified. Your account is now pending admin approval.",
      data: null,
    });
  }
);

const resendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email as string;
    
    if (!email) {
      throw new Error("Email is required to resend OTP.");
    }

    await authService.resendOtpToUser(email);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "A new OTP has been sent to your email.",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.sendPasswordResetOtp(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "An OTP has been sent to your email to reset your password.",
    data: null,
  });
});

const verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyPasswordResetOtp(email, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified. You can now reset your password.",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  await authService.resetPassword(email, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your password has been reset successfully.",
    data: null,
  });
});

const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError(
        status.NOT_FOUND,
        "User does not exist. Please register."
      );
    }

    if (!user.password) {
      throw new AppError(
        status.UNAUTHORIZED,
        "This account was created using OAuth. Please login with Google."
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new AppError(status.UNAUTHORIZED, "Incorrect password.");
    }

    // ✅ Owner check (if role is restaurant_owner)
    if (user.role === "restaurant_owner") {
      const owner = await OwnerModel.findOne({ user: user._id });

      if (!owner) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Owner profile not found. Please register as a restaurant owner."
        );
      }

      if (owner.status === OWNER_STATUS.UNVERIFIED) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Your account is not verified. Please verify OTP."
        );
      }

      if (owner.status === OWNER_STATUS.PENDING) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Your account is pending admin approval."
        );
      }

      if (owner.status === OWNER_STATUS.REJECTED) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Your owner request has been rejected."
        );
      }
    }
     
    console.log(user._id)
  
    const restaurantData = await OwnerModel.findOne({user:user._id});
    const payload = {
      userId: user._id,
      restaurantId: restaurantData?.user,
      role: user.role,
    };

    const accessToken = generateToken(
      payload,
      config.JWT_ACCESS_TOKEN_SECRET!,
      config.JWT_ACCESS_TOKEN_EXPIRES_IN!
    );

    const refreshToken = generateToken(
      payload,
      config.JWT_REFRESH_TOKEN_SECRET!,
      config.JWT_REFRESH_TOKEN_EXPIRES_IN!
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.ENVIRONMENT === "production",
      sameSite: config.ENVIRONMENT === "production" ? "strict" : "lax",
      maxAge: parseInt(config.JWT_REFRESH_TOKEN_EXPIRES_IN!) * 1000,
    });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
        },
      },
    });
  }
);

const OAuthCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    // Generate access token
    const accessToken = generateToken(
      payload,
      config.JWT_ACCESS_TOKEN_SECRET!,
      config.JWT_ACCESS_TOKEN_EXPIRES_IN!
    );

    // Generate refresh token
    const refreshToken = generateToken(
      payload,
      config.JWT_REFRESH_TOKEN_SECRET!,
      config.JWT_REFRESH_TOKEN_EXPIRES_IN!
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.ENVIRONMENT === "production",
      sameSite: config.ENVIRONMENT === "production" ? "strict" : "lax",
      maxAge: parseInt(config.JWT_REFRESH_TOKEN_EXPIRES_IN!) * 1000,
    });

    // Send access token + user info
    return sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).json({ success: false, message: "OAuth login failed" });
  }
};
// 6. Logout
const Logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Logout successful",
      data: null,
    });
  }
);
// // 7. Get user profile
// const getUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user

//     const user: IUser | null = await userModel
//       .findById(userId)
//       .select("-password");

//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile fetched successfully",
//       data: user,
//     });
//   }
// );
// // 8. Update user profile
// const updateUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user

//     const updatedUser: IUser | null = await userModel.findByIdAndUpdate(
//       userId,
//       req.body,
//       { new: true }
//     );

//     if (!updatedUser) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile updated successfully",
//       data: updatedUser,
//     });
//   }
// );
// // 9. Delete user profile
// const deleteUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user

//     const deletedUser: IUser | null = await userModel.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile deleted successfully",
//       data: null,
//     });
//   }
// );
// // 10. Change password
// const changePassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user

//     const { oldPassword, newPassword } = req.body;

//     // Check if user exists
//     const user: IUser | null = await userModel
//       .findById(userId)
//       .select("+password");

//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }

//     // Compare old password using bcrypt directly
//     const isMatch = await bcrypt.compare(oldPassword, user.user.password);
//     if (!isMatch) {
//       throw new AppError(status.UNAUTHORIZED, "Old password is incorrect");
//     }

//     // Update password
//     user.user.password = newPassword;
//     await userModel.updateOne({ _id: user._id }, { password: newPassword });

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "Password changed successfully",
//       data: null,
//     });
//   }
// );
// // 11. Reset password

// // 12. Verify email
// const verifyEmail = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.body;

//     // Check if user exists
//     const user: IUser | null = await userModel.findOne({ email });

//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }

//     // Verify email logic here (e.g., send verification link)

//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "Email verification link sent",
//       data: null,
//     });
//   }
// );

// 13. Verify phone number
const verifyPhoneNumber = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify phone number logic here (e.g., send verification code)

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Phone number verification code sent",
      data: null,
    });
  }
);
// 14. Resend verification email
const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ email });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Resend verification email logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Verification email resent",
      data: null,
    });
  }
);
// 15. Resend verification phone number
const resendVerificationPhoneNumber = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Resend verification phone number logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Verification phone number resent",
      data: null,
    });
  },

);
// 16. Verify phone number OTP
const verifyPhoneNumberOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, otp } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify OTP logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Phone number verified successfully",
      data: null,
    });
  }
);
// 17. Verify email OTP
const verifyEmailOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ email });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify OTP logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Email verified successfully",
      data: null,
    });
  }
);

const approveRestaurantByAdmin = catchAsync(async(req,res)=>{
  

  const email = req.body.email;

  const result = await authService.approveRestaurantByAdmin(email);

  
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Restaurant  approved successfully",
    data: result,
  });
})

export const authController = {
  restuarantRegisterRequest,
  otpValidation,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  Login,
  OAuthCallback,
  Logout,
  // getUserProfile,
  // updateUserProfile,
  // deleteUserProfile,
  // changePassword,
  // verifyEmail,

  resetPassword,
  verifyPhoneNumber,
  resendVerificationEmail,
  resendVerificationPhoneNumber,
  verifyPhoneNumberOTP,
  verifyEmailOTP,
  approveRestaurantByAdmin
};
