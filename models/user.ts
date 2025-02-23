import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for TypeScript type checking
interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Use mongoose.Types.ObjectId for consistency
  phoneNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  ordersCount: number;
  wallet: number;
  role: "admin" | "customer";
  isDeleted: boolean;
  emailActivationCode: string; // Use lowercase `string`
  isEmailActivated: boolean;
  emailActivationExpiresAt: Date;
  isPhoneActivated: boolean;
  phoneActivationCode: string; // Use lowercase `string`
  phoneActivationExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    ordersCount: { type: Number, required: true, default: 0 },
    wallet: { type: Number, required: true, default: 0 },
    role: {
      type: String,
      required: true,
      default: "customer",
      enum: ["admin", "customer"],
    },
    isDeleted: { type: Boolean, default: false },
    isPhoneActivated: { type: Boolean, default: false },
    phoneActivationCode: { type: String },
    phoneActivationExpiresAt: { type: Date },
    isEmailActivated: { type: Boolean, default: false },
    emailActivationCode: { type: String },
    emailActivationExpiresAt: { type: Date },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the User model
const User = mongoose.model<IUser>("User", userSchema);

export { User, IUser }; // Export both the model and the interface
