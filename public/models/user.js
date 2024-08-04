"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema
const userSchema = new mongoose_1.Schema({
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
}, { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
// Create the User model
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
