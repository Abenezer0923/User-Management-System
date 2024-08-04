"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Middleware to check JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer" scheme
        const secret = process.env.JWT_SECRET || 'default_secret'; // Retrieve JWT secret from environment variables
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            // Type assertion to ensure decoded payload is of type JwtPayload
            const user = decoded;
            // Ensure user object has required properties
            req.user = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                role: user.role,
            };
            next();
        });
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
};
exports.authenticateJWT = authenticateJWT;
