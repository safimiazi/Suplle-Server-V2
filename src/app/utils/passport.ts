import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { userModel } from "../modules/users/user/users.model";
import { OwnerModel } from "../modules/users/owner/owner.model";
import mongoose from "mongoose";
import { OWNER_STATUS } from "../modules/users/owner/owner.constant";
import config from "../config";

dotenv.config();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config .GOOGLE_CLIENT_ID  || "",
      clientSecret: config.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          throw new Error("No email found in Google profile.");
        }

        let user = await userModel.findOne({ email }).session(session);

        // ❌ Case: email/password already exists
        if (user && !user.provider) {
          throw new Error(
            "You already have an account with this email. Please login using your password."
          );
        }

        // ✅ Case: Already exists with Google login
        if (user && user.provider === "google") {
          return done(null, user || undefined);
        }

        // ✅ Case: First-time Google login — create user, restaurant, and owner
        if (!user) {
          // 1. Create user
          let user = await userModel.create(
            [
              {
                name: profile.displayName,
                email: email,
                image: profile.photos?.[0]?.value,
                provider: "google",
                providerId: profile.id,
                role: "restaurant_owner", // set directly
              },
            ],
            { session }
          );

          // 2. Create owner
          const owner = await OwnerModel.create(
            [
              {
                user: user[0]._id,
                businessName: `${profile.displayName}'s Business`,
                businessEmail: email,
                status: OWNER_STATUS.PENDING,
              },
            ],
            { session }
          );
        }

        await session.commitTransaction();
        session.endSession();

        return done(null, user || undefined);
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        return done(error, null!);
      }
    }
  )
);

// Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//       callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
//       profileFields: ["id", "emails", "name", "photos"],
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         console.log("profile", profile);
//         return;

//         const email =
//           profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
//         let user = await usersModel.findOne({
//           providerId: profile.id,
//           provider: "facebook",
//         });

//         if (!user) {
//           user = await usersModel.create({
//             name: `${profile.name?.givenName} ${profile.name?.familyName}`,
//             email,
//             image: profile.photos?.[0]?.value,
//             provider: "facebook",
//             providerId: profile.id,
//             status: "active",
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// ❗ Disable session behavior completely for JWT-based auth
passport.serializeUser(() => {});
passport.deserializeUser(() => {});
