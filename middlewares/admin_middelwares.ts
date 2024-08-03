import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import {validationMessage , catchMessage} from "../utils/index"

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Check if userId is available and fetch user from database
    if (!userId) {
      return validationMessage(res, "User not authenticated");
    }
    
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return validationMessage(res, "Access denied");
    }

    next();
  } catch (error) {
    catchMessage(res);
  }
};
