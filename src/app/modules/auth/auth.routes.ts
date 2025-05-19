import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authLoginValidation, restaurantValidationRequest,  } from "./auth.validation";
import passport from 'passport';


const router = express.Router();

router.post(
  "/register-restuarant-owner",
  validateRequest(restaurantValidationRequest),
  authController.restuarantRegisterRequest
);
router.post("/verify-otp", authController.otpValidation)
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-password-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/approved-restaurant-admin", authController.approveRestaurantByAdmin);



// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  authController.OAuthCallback
);

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"], session: false }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  authController.OAuthCallback
);

router.post(
  "/login",
  validateRequest(authLoginValidation),
  authController.Login
);
router.post(
  "/logout",
  authController.Logout
);

export const authRoutes = router;
