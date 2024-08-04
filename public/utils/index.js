"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMessage = exports.catchMessage = exports.successMessage = exports.generateActivationCode = exports.sendEmail = exports.generateResetToken = exports.comparePasswords = exports.decodeResetToken = exports.generateToken = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Generate JWT token
const generateToken = (userId, userRole) => {
    const payload = { id: userId, role: userRole };
    // Retrieve JWT secret and expiration from environment variables
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    return token;
};
exports.generateToken = generateToken;
// Function to decode the JWT token
const decodeResetToken = (token) => {
    try {
        // Retrieve JWT secret from environment variables
        const secret = process.env.JWT_SECRET || 'default_secret';
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Return the decoded information
        return { userId: decoded.id, role: decoded.role };
    }
    catch (error) {
        // Handle error (invalid token or expired)
        return null;
    }
};
exports.decodeResetToken = decodeResetToken;
/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A boolean indicating if the passwords match.
 */
const comparePasswords = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
});
exports.comparePasswords = comparePasswords;
/**
 * Generate a secure reset token.
 * @param email - The user's email address.
 * @param userId - The user's ID.
 * @param expirationMinutes - The token's expiration time in minutes.
 * @returns A reset token string.
 */
const generateResetToken = (email, userId, expirationMinutes) => {
    // Create a base token with user-specific information
    const baseToken = `${email}-${userId}-${Date.now()}`;
    // Generate a hash of the base token
    const hash = crypto_1.default.createHash('sha256').update(baseToken).digest('hex');
    // Calculate expiration time
    const expirationTime = Date.now() + expirationMinutes * 60 * 1000;
    // Combine the hash with the expiration time
    return `${hash}-${expirationTime}`;
};
exports.generateResetToken = generateResetToken;
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
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});
const sendEmail = (subject, text, to) => {
    if (!to) {
        console.error('Recipient address is missing');
        return;
    }
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Recipient address
        subject,
        text,
    };
    // Log mail options for debugging
    console.log('Mail Options:', mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
};
exports.sendEmail = sendEmail;
const generateActivationCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let activationCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        activationCode += characters[randomIndex];
    }
    return activationCode;
};
exports.generateActivationCode = generateActivationCode;
// Sends a success response
const successMessage = (res, message, data) => {
    res.json({
        code: 200,
        message: message ? message : 'Your request was successful',
        success: true,
        data: data || null,
    });
};
exports.successMessage = successMessage;
// Sends a generic error response
const catchMessage = (res, error) => {
    if (error) {
        console.error('Error details:', error.message || error); // Log the error details
    }
    else {
        console.error('Unknown error occurred');
    }
    res.status(500).json({
        code: 500,
        message: 'An error occurred. Please try again later.',
        success: false,
    });
};
exports.catchMessage = catchMessage;
// Sends a validation error response
const validationMessage = (res, error) => {
    res.status(400).json({
        code: 400,
        message: error,
        success: false,
    });
};
exports.validationMessage = validationMessage;
