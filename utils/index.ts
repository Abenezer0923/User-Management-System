import { Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { RegisterTypes } from '../types/auth'; 
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Generate JWT token
export const generateToken = (userId: string, userRole: string) => {
  const payload = { id: userId, role: userRole };

  // Retrieve JWT secret and expiration from environment variables
  const secret = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};


// Function to decode the JWT token
export const decodeResetToken = (token: string): { userId: string; role: string } | null => {
  try {
    // Retrieve JWT secret from environment variables
    const secret = process.env.JWT_SECRET || 'default_secret';
    
    // Verify and decode the token
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    // Return the decoded information
    return { userId: decoded.id, role: decoded.role };
  } catch (error) {
    // Handle error (invalid token or expired)
    return null;
  }
};


/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A boolean indicating if the passwords match.
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
};
/**
 * Generate a secure reset token.
 * @param email - The user's email address.
 * @param userId - The user's ID.
 * @param expirationMinutes - The token's expiration time in minutes.
 * @returns A reset token string.
 */
export const generateResetToken = (
  email: RegisterTypes['email'],
  userId: RegisterTypes['id'],
  expirationMinutes: number
): string => {
  // Create a base token with user-specific information
  const baseToken = `${email}-${userId}-${Date.now()}`;

  // Generate a hash of the base token
  const hash = crypto.createHash('sha256').update(baseToken).digest('hex');

  // Calculate expiration time
  const expirationTime = Date.now() + expirationMinutes * 60 * 1000;

  // Combine the hash with the expiration time
  return `${hash}-${expirationTime}`;
};



// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'abenezergetachew0923@gmail.com',
//     pass: 'fknzsukojgdlejch',
//   },
// });

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

export const sendEmail = (subject: string, text: string, to: string): void => {
  if (!to) {
    console.error('Recipient address is missing');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to,                           // Recipient address
    subject,
    text,
  };

  // Log mail options for debugging
  console.log('Mail Options:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};







export const generateActivationCode = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let activationCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      activationCode += characters[randomIndex];
    }
    return activationCode;
  };
  

// Sends a success response
export const successMessage = (
  res: Response,
  message?: string,
  data?: any
): void => {
  res.json({
    code: 200,
    message: message ? message : 'Your request was successful',
    success: true,
    data: data || null,
  });
};

// Sends a generic error response
export const catchMessage = (res: Response, error?: any): void => {
  if (error) {
    console.error('Error details:', error.message || error); // Log the error details
  } else {
    console.error('Unknown error occurred');
  }
  res.status(500).json({
    code: 500,
    message: 'An error occurred. Please try again later.',
    success: false,
  });
};



// Sends a validation error response
export const validationMessage = (
  res: Response,
  error: string
): void => {
  res.status(400).json({
    code: 400,
    message: error,
    success: false,
  });
};
