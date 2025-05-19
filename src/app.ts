import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import "../src/app/utils/passport.ts";
import { userModel } from "./app/modules/users/user/users.model";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // jodi cookie/token pathaos
  })
);

// Set up static file serving for uploads
const uploadsPath = path.resolve("uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use("/uploads", express.static(uploadsPath));

//  test route:
app.get("/", (req, res) => {
  res.send("Hey my name is mohebulla!");
});

// routes:
app.use("/api/v1", router);

// not found middleware:
app.use(notFound);

// global error handler:
app.use(globalErrorHandler);

export const createAdmin = async () => {
  try {
    const existingAdmin = await userModel.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("✅ Super admin already exists");
      return;
    }

    const {
      SUPER_ADMIN_NAME,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_FULLNAME,
      SUPER_ADMIN_NICKNAME,
      SUPER_ADMIN_GENDER,
      SUPER_ADMIN_COUNTRY,
      SUPER_ADMIN_LANGUAGE,
      SUPER_ADMIN_TIMEZONE,
      SUPER_ADMIN_PHONE,
      SUPER_ADMIN_PASSWORD,
      SUPER_ADMIN_ADDRESS,
    } = process.env;

    if (
      !SUPER_ADMIN_NAME ||
      !SUPER_ADMIN_EMAIL ||
      !SUPER_ADMIN_FULLNAME ||
      !SUPER_ADMIN_NICKNAME ||
      !SUPER_ADMIN_GENDER ||
      !SUPER_ADMIN_COUNTRY ||
      !SUPER_ADMIN_LANGUAGE ||
      !SUPER_ADMIN_TIMEZONE ||
      !SUPER_ADMIN_PHONE ||
      !SUPER_ADMIN_PASSWORD ||
      !SUPER_ADMIN_ADDRESS
    ) {
      throw new Error("🚫 Missing SUPER_ADMIN environment variables.");
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    await userModel.create({
      name: SUPER_ADMIN_NAME,
      email: SUPER_ADMIN_EMAIL,
      phone: SUPER_ADMIN_PHONE,
      password: hashedPassword,
      image: null,
      role: "admin",
    });

    console.log("🚀 Super admin created successfully");
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  }
};

createAdmin();

export default app;
