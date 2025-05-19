// utils/sendOtpToPhone.ts
import { Twilio } from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendOtpToPhone = async (phone: string, otp: string) => {
  try {
    const message = await client.messages.create({
      body: `
        🔐 OTP Verification
        
        Your OTP is: ${otp}
        
        ⏳ This code is valid for 5 minutes.
        ❗ Do not share it with anyone.
      
        `.trim(),
      from: process.env.TWILIO_PHONE,
      to: phone.startsWith("+") ? phone : `+${phone}`, // Ensure E.164 format
    });
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error("Could not send OTP to phone.");
    }
  }
};
