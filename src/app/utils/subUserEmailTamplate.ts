import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendUserLoginCredentials = async (
  email: string,
  password: string,
  name: string,
  role: string,
  phone: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use 'smtp.ethereal.email' or others for testing
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions = {
      from: `<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your login credentials",
      // text: `Your login credentials are as follows:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Welcome, ${name}!</h2>
        <p style="font-size: 16px; color: #555;">
            Here are your login credentials:
        </p>
    
        <ul style="font-size: 15px; color: #444; line-height: 1.6;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Phone:</strong> ${role}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
    
        <p style="font-size: 16px; color: #555;">
          please change your demo password.
        </p>
    
   
    
    
    
        <p style="font-size: 14px; color: #aaa;">
          &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
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
