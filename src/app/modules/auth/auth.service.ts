import mongoose from "mongoose";
import { userModel } from "../users/user/users.model";
import { IRestaurantValidationRequest } from "./auth.validation";
import { ROLE } from "../users/user/users.constant";
import bcrypt from "bcryptjs";
import { OwnerModel } from "../users/owner/owner.model";
import { generateOtp } from "../../utils/generateOtp";
import { sendOtpToEmail } from "../../utils/sendOtpToEmail";
import { OWNER_STATUS } from "../users/owner/owner.constant";
import { RestaurantModel } from "../restuarant/restuarant.model";
import AppError from "../../errors/AppError";

export const authService = {
  async restuarantRegisterRequestIntoDB(data: IRestaurantValidationRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Check if user already exists
      const existingUser = await userModel
        .findOne({ email: data.businessEmail })
        .session(session);


        
      if (existingUser) {
        throw new Error("Restaurant owner already exists.");
      }
  
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const otp = generateOtp(4);
  
      // 2. Create new user
      const newUser = await userModel.create(
        [
          {
            name: "New User",
            email: data.businessEmail,
            phone: data.phone,
            otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60000),
            role: ROLE.RESTAURANT_OWNER,
            password: hashedPassword,
          },
        ],
        { session }
      );
  
      // 3. Create owner
      const newOwner = await OwnerModel.create(
        [
          {
            user: newUser[0]._id,
            businessName: data.businessName,
            businessEmail: data.businessEmail,
            status: OWNER_STATUS.UNVERIFIED,
            referralCode: data.referralCode,
          },
        ],
        { session }
      );
  
      // 4. Create restaurant
      const restaurantData = {
        owner: newOwner[0]._id,
        restaurantName: "your restaurant name",
        menus: [],
        status: "pending",
        restaurantAddress: data.restaurantAddress,
        phone: "your phone",
        logo: "",
        tagline: "",
        coverPhoto: "",
        images: [],
        description: "",
      };
  
      await RestaurantModel.create([restaurantData], { session });
  
      // 5. Commit transaction
      await session.commitTransaction();
      session.endSession();
  
      return {
        message: "Restaurant registration successful",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(500, "Registration failed: " + (error as Error).message);
    }
  },
  
  async otpValidationIntoDB(data: any, userEmail: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
  const findUnverifiedOwner = await OwnerModel.findOne({
    businessEmail: userEmail
  }).session(session)


  if (findUnverifiedOwner?.status === OWNER_STATUS.PENDING) {
    throw new Error("Your account has already been verified and is now pending admin approval.");
  }
  


      const findUnverifiedUser = await userModel
        .findOne({ _id: findUnverifiedOwner?.user })
        .session(session);

      if (!findUnverifiedUser) {
        throw new Error("No account found with this email. Please register first.");
      }
  
      if (Date.now() > findUnverifiedUser.otpExpiresAt.getTime()) {
        throw new Error("Your OTP has expired. Please request a new one.");
      }
  
      if (data.otp !== findUnverifiedUser.otp) {
        throw new Error("The OTP you entered is incorrect. Please try again.");
      }
  
      await userModel.updateOne(
        { email: userEmail },
        { $set: { otp: null, otpExpiresAt: null, } },
        { session }
      );

      await OwnerModel.updateOne(
        { _id: findUnverifiedOwner?._id },
        { $set: { status: OWNER_STATUS.PENDING } },
        { session }
      )
  
      await session.commitTransaction();
      session.endSession();
  
      return {
        message: "🎉 Your account has been successfully verified. You can now log in.",
        userId: findUnverifiedUser._id,
      };
  
    } catch (error: unknown) {
      await session.abortTransaction();
      session.endSession();
  
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Something went wrong while verifying your account.");
      }
    }
  },
  async resendOtpToUser(email: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const user = await userModel.findOne({ email }).session(session);
      if (!user) {
        throw new Error("No account found with this email.");
      }
  
      const owner = await OwnerModel.findOne({ businessEmail: email }).session(session);
      if (!owner) {
        throw new Error("Owner information not found for this email.");
      }
  
      // Generate new OTP
      const otp = generateOtp(4);
  
      // Update user with new OTP
      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60000), // expires in 5 mins
          },
        },
        { session }
      );
  
      // Send OTP via email
      await sendOtpToEmail(email, otp);
  
      await session.commitTransaction();
      session.endSession();
  
      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  async sendPasswordResetOtp(email: string) {
    const user = await userModel.findOne({ email });
  
    if (!user) {
      throw new Error("No account found with this email.");
    }
  
    const otp = generateOtp(4); // Create your own helper for this
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();
  
    await sendOtpToEmail(email, otp); // Your own implementation
  },

  async verifyPasswordResetOtp(email: string, otp: string) {
    const user : any = await userModel.findOne({ email });
  
    if (!user) throw new Error("User not found.");
    if (!user.otp || !user.otpExpiresAt) throw new Error("No OTP found. Please request again.");
  
    if (Date.now() > user.otpExpiresAt.getTime()) {
      throw new Error("OTP has expired. Please request a new one.");
    }
  
    if (otp !== user.otp) {
      throw new Error("Invalid OTP. Please try again.");
    }
  
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
  },
  async resetPassword(email: string, newPassword: string) {
    const user = await userModel.findOne({ email });
  
    if (!user) throw new Error("User not found.");
  
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
  },
  


  async approveRestaurantByAdmin(email: string) {
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      // 1. Find the user
      const findOwnerUser = await userModel.findOne({ email, role: "restaurant_owner" }).session(session);
  
      if (!findOwnerUser) {
        throw new AppError(400, "You are not a user");
      }
  console.log( findOwnerUser )
      // 2. Activate the Owner
      const owner = await OwnerModel.findOneAndUpdate(
        { user: findOwnerUser._id },
        { status: "active" },
        { new: true, session }
      );
      if (!owner) {
        throw new AppError(404, "Owner not found");
      }
  
      // 3. Activate the Restaurant
      const ownerRestaurant = await RestaurantModel.findOneAndUpdate(
        { owner: owner._id },
        { status: "active" },
        { new: true, session }
      );
      
      console.log(ownerRestaurant)
      if (!ownerRestaurant) {
        throw new AppError(404, "Restaurant not found");
      }
  
      // 4. Commit transaction
      await session.commitTransaction();
      session.endSession();
  
      return ownerRestaurant;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  
  
  

  
};
