"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const configs = {
    port: process.env.PORT || 4000, // Default to 4000 if PORT is not set
    connectionString: process.env.MONGODB_CONNECTION_STRING || '',
    secret: process.env.JWT_SECRET || '',
};
exports.default = configs;
