import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("DB URI INSIDE DB.JS:", uri); // debug

    if (!uri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
