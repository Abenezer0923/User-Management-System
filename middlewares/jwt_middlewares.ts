import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';

// Load environment variables from .env file
dotenv.config();

// Extend Express's Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        role: string;
      };
    }
  }
}

// Define an interface for the JWT payload
interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

// Middleware to check JWT token
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer" scheme
    const secret = process.env.JWT_SECRET || 'default_secret'; // Retrieve JWT secret from environment variables

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      // Type assertion to ensure decoded payload is of type JwtPayload
      const user = decoded as JwtPayload;

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
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
