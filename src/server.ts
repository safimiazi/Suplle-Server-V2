import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

let server: Server;
async function startServer() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    server = app.listen(config.BACKEND_PORT, () => {
      console.log(`Server is running on port ${config.BACKEND_PORT}`);
      console.log(`Database connected successfully`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();

process.on("unhandledRejection", (error) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, error);
  if (server) {
    server.close(() => {
      console.log(`😈 server is closed`);
      process.exit(1);
    });
  }
});

process.on("uncaughtException", (err) => {
  console.log(`😈 uncaughtException is detected , shutting down ...`, err);

  process.exit(1);
});
