import { Request, Response } from "express";
import { User } from "../models/user";
import { comparePasswords, generateToken } from "../utils/index";


export const handleAuthentication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
        code: 400,
        success: false,
      });
      return; // Ensure you return after sending a response
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
        code: 401,
        success: false,
      });
      return; // Ensure you return after sending a response
    }

    // Compare provided password with stored hash
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid email or password",
        code: 401,
        success: false,
      });
      return; // Ensure you return after sending a response
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    const newData = {
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user._id,
      authenticated: true,
      wallet: user.wallet,
    };

    res.json({
      data: newData,
      code: 200,
      success: true,
    });
    
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({
      message: "An error occurred. Please try again later.",
      code: 500,
      success: false,
    });
  }
};
