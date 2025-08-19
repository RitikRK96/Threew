// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: "leaderboard" });
  console.log("✅ MongoDB connected");
};