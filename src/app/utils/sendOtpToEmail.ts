import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpToEmail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use 'smtp.ethereal.email' or others for testing
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create a verification URL, for example
    const verificationUrl = `${process.env.FRONTEND_URL}/api/v1/auth/verify-otp?email=${email}`;

    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="text-align: center; color: #333;">🔐 OTP Verification</h2>
          <p style="font-size: 16px; color: #444;">Hi there,</p>
          <p style="font-size: 16px; color: #444;">
            Please use the following One-Time Password (OTP) to verify your account:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; color: #007BFF; background: #f1f1f1; padding: 10px 20px; border-radius: 6px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP will expire in <strong>5 minutes</strong>. You can also click the link below to verify your OTP:
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${verificationUrl}" style="font-size: 16px; background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
              Verify OTP
            </a>
          </div>
              <p style="font-size: 14px; color: #444; text-align: center; margin-top: 15px;">
            Alternatively, you can copy and paste this link in your browser: 
            <a href="${verificationUrl}" style="color: #007BFF;">${verificationUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            If you didn't request this, please ignore this email or contact support.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error("Could not send OTP to email.");
    }
  }
};
