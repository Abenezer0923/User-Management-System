import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define and export configuration variables
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;