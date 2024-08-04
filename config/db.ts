import mongoose from "mongoose";
import configs from "./configs";

const connectDB = async (): Promise<void> => {
  try {
    // Ensure configs.connectionString is valid
    if (!configs.connectionString) {
      throw new Error("MongoDB connection string is not defined");
    }

    // Connect to MongoDB
    await mongoose.connect(configs.connectionString);

    // Set Mongoose to use global Promise
    mongoose.Promise = global.Promise;

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
