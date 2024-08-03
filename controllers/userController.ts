import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

import {
  successMessage,
  catchMessage,
  validationMessage,
  generateActivationCode,
  sendEmail,
  generateResetToken,
  decodeResetToken,
} from "../utils/index";

import { RegisterTypes } from "../types/auth";
import mongoose, { Types } from "mongoose";
import { UserRequestParams } from "../types/user";

export const vRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, phoneNumber, password , email }: RegisterTypes =
    req.body;

  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"First name" must be at least {#limit} characters long`,
        "string.max": `"First name" must be at most {#limit} characters long`,
        "any.required": `"First name" is required`,
        "string.empty": "First name is required",
        "string.pattern.base": "First name should contain only English letters",
      }),
    lastName: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"Last name" must be at least {#limit} characters long`,
        "string.max": `"Last name" must be at most {#limit} characters long`,
        "any.required": `"Last name" is required`,
        "string.empty": "Last name is required",
        "string.pattern.base": "Last name should contain only English letters",
      }),
    phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
      "any.required": `"Phone number" is required`,
      "string.empty": `"Phone number" is required`,
      "string.length": `"Phone number" should be 11 digits`,
      "string.pattern.base": `"Phone number" should be in the standard format`,
    }),
    password: Joi.string().required().min(8).max(256).messages({
      "string.min": `"Password" must be at least {#limit} characters long`,
      "string.max": `"Password" must be at most {#limit} characters long`,
      "any.required": `"Password" is required`,
      "string.empty": "Password is required",
    }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": `"Email" must be a valid email address`,
        "any.required": `"Email" is required`,
        "string.empty": "Email is required",
      }),
  });

  const { error } = schema.validate({
    firstName,
    lastName,
    password,
    phoneNumber,
    email,
  });

  if (error) {
    validationMessage(res, error.details[0].message);
    return;
  }

  const existPhoneNumber = await User.find({ phoneNumber }).countDocuments();
  if (existPhoneNumber > 0) {
    validationMessage(res, "Phone number is already in use");
    return;
  }

  next();
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phoneNumber, password, email }: RegisterTypes =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      role: "customer",
      password: hashPassword,
      email,
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
      catchMessage(res);
    } else {
      successMessage(res, "Your account has been created successfully");
    }
  } catch (err) {
    catchMessage(res);
  }
};

export const vUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
    id,
  }: RegisterTypes = req.body;

  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"First name" must be at least {#limit} characters long`,
        "string.max": `"First name" must be at most {#limit} characters long`,
        "any.required": `"First name" is required`,
        "string.empty": "First name is required",
        "string.pattern.base": "First name should contain only English letters",
      }),
    lastName: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"Last name" must be at least {#limit} characters long`,
        "string.max": `"Last name" must be at most {#limit} characters long`,
        "any.required": `"Last name" is required`,
        "string.empty": "Last name is required",
        "string.pattern.base": "Last name should contain only English letters",
      }),
    phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
      "any.required": `"Phone number" is required`,
      "string.empty": `"Phone number" is required`,
      "string.length": `"Phone number" should be 11 digits`,
      "string.pattern.base": `"Phone number" should be in the standard format`,
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": `"Email" should be in a standard format`,
      }),
    address: Joi.objectId().required().messages({
      "any.required": `"Address" is required`,
      "objectId.empty": `"Address" is required`,
      "string.empty": `"Address" is required`,
    }),
  });

  const { error } = schema.validate({
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
  });

  if (error) {
    validationMessage(res, error.details[0].message);
    return;
  }

  const existPhoneNumber = await User.find({
    phoneNumber,
    _id: { $ne: id },
  }).countDocuments();
  if (existPhoneNumber > 0) {
    validationMessage(res, "Phone number is already in use");
    return;
  }

  next();
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      id,
    }: RegisterTypes = req.body;

    const updateUser = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
    });
    if (!updateUser) {
      catchMessage(res);
    } else {
      successMessage(res, "Your information has been successfully updated");
    }
  } catch (err) {
    catchMessage(res);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.query.userId as string;

    let user = await User.findById(userId).populate({
      path: "address",
    });
    if (!user) {
      return validationMessage(res, "User not found");
    }
    successMessage(res, "", user);
  } catch (error) {
    catchMessage(res);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    let users = await User.find({ isDeleted: { $ne: true } }).sort({
      createdAt: 1,
    });
    if (!users.length) {
      return validationMessage(res, "No users found");
    }
    successMessage(res, "", users);
  } catch (error) {
    catchMessage(res);
  }
};

export const getUsersPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rowsPerPage, page, search }: UserRequestParams = {
      rowsPerPage: Number(req.query.rowsPerPage),
      page: Number(req.query.page),
      search: req.query.search as string,
    };

    if (typeof rowsPerPage !== "number" || typeof page !== "number") {
      return validationMessage(res, "Invalid input values");
    }

    const conditions: any = { isDeleted: { $ne: true } };
    const searchRegex = new RegExp(search, "i");
    const searchClauses = [
      { phoneNumber: { $regex: searchRegex } },
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ];

    if (search && search !== "") {
      conditions.$or = searchClauses;
    }

    let pipeline = [
      {
        $match: conditions,
      },
      {
        $facet: {
          datas: [{ $skip: rowsPerPage * (page - 1) }, { $limit: rowsPerPage }],
          totalDataCount: [{ $count: "count" }],
        },
      },
    ];

    let [data] = await User.aggregate(pipeline);
    if (!data || !data.datas.length) {
      return validationMessage(res, "No users found");
    }
    const totalRecords =
      data.totalDataCount.length > 0 ? data.totalDataCount[0].count : 0;
    successMessage(res, "", { datas: data.datas, totalRecords });
  } catch (error) {
    catchMessage(res);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.query.userId as string;

    const deleteUser = await User.findByIdAndUpdate(userId, {
      isDeleted: true,
    });
    if (!deleteUser) {
      return validationMessage(res, "User not found");
    }
    successMessage(res, "User has been successfully deleted");
  } catch (error) {
    catchMessage(res);
  }
};

export const getUsersByQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract query parameters and provide default values
    const rowsPerPage: number = Number(req.query.rowsPerPage) || 10; // Default to 10 if not provided
    const page: number = Number(req.query.page) || 1; // Default to page 1 if not provided
    const search: string = (req.query.search as string) || "";
    const filterBy: string = (req.query.filterBy as string) || "";

    // Ensure rowsPerPage and page are valid numbers
    if (isNaN(rowsPerPage) || isNaN(page)) {
      return validationMessage(res, "Invalid input values for pagination");
    }

    const conditions: any = { isDeleted: { $ne: true } };

    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      const searchClauses = [
        { phoneNumber: { $regex: searchRegex } },
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];
      conditions.$or = searchClauses;
    }

    if (filterBy && filterBy !== "") {
      conditions["role"] = filterBy;
    }

    // Pagination setup
    const skip = rowsPerPage * (page - 1);
    const limit = rowsPerPage;

    // Query users with pagination
    const users = await User.find(conditions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total records for pagination info
    const totalRecords = await User.countDocuments(conditions);

    if (!users.length) {
      return validationMessage(res, "No users found");
    }

    successMessage(res, "", { users, totalRecords });
  } catch (error) {
    catchMessage(res);
  }
};

export const sendEmailActivationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          'string.email': `"Email" should be in a valid format`,
          'any.required': `"Email" is required`,
          'string.empty': `"Email" should not be empty`,
        }),
    });

    const { error } = schema.validate({ email });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }

    const emailActivationCode: string = generateActivationCode(6);

    const user = await User.findOneAndUpdate(
      { email },
      { emailActivationCode },
      { new: true } // Return the updated document
    );

    if (!user) {
      return validationMessage(res, 'Email is invalid');
    }

    successMessage(
      res,
      'An activation code has been sent to you. Please use this code to set your new password.'
    );

    sendEmail(
      'Activation code for password reset', // Subject
      `Your activation code is: ${emailActivationCode}`, // Body
      email // Recipient email
    );
  } catch (error) {
    return catchMessage(res, error);
  }
};


export const emailActivation = async (
  req: Request & { user?: { id: string } },
  res: Response
): Promise<void> => {
  try {
    const { emailActivationCode }: { emailActivationCode: string } = req.body;

    const schema = Joi.object({
      emailActivationCode: Joi.string().required().messages({
        "any.required": `"Email activation code" is required`,
        "string.empty": `"Email activation code" should not be empty`,
      }),
    });

    const { error } = schema.validate({ emailActivationCode });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }

    // Check if req.user is defined
    if (!req.user || !req.user.id) {
      return validationMessage(res, "User not authenticated");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return catchMessage(res);
    } else if (user.emailActivationCode !== emailActivationCode) {
      return validationMessage(res, "The code is invalid");
    } else if (
      user.emailActivationExpiresAt &&
      user.emailActivationExpiresAt < new Date()
    ) {
      return validationMessage(res, "The code has expired. Please try again.");
    } else {
      User.findOneAndUpdate(
        { _id: user._id },
        { isEmailActivated: true },
        (err: any, doc: any) => {
          if (err || !doc) {
            return catchMessage(res);
          } else {
            return successMessage(
              res,
              "Your email has been successfully verified"
            );
          }
        }
      );
    }
  } catch (error) {
    return catchMessage(res);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      resetToken,
      newPassword
    }: {
      resetToken: string;
      newPassword: string;
    } = req.body;

    const schema = Joi.object({
      resetToken: Joi.string().required().messages({
        "any.required": `"Reset token" is required`,
        "string.empty": `"Reset token" is required`
      }),
      newPassword: Joi.string().required().min(8).max(256).messages({
        "string.min": `"Password" must be at least {#limit} characters long`,
        "string.max": `"Password" must be at most {#limit} characters long`,
        "any.required": `"Password" is required`,
        "string.empty": `"Password" is required`
      })
    });

    const { error } = schema.validate({
      resetToken,
      newPassword
    });

    if (error) {
      return validationMessage(res, error.details[0].message);
    }

    // Decode the token to get user details
    const decoded = decodeResetToken(resetToken);

    if (!decoded) {
      return validationMessage(res, "Invalid or expired reset token");
    }

    const { userId } = decoded;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return validationMessage(res, "User not found");
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updateUser = await User.findByIdAndUpdate(userId, {
      password: hashPassword,
    });

    if (!updateUser) {
      return catchMessage(res, new Error('User not found'));
    } else {
      return successMessage(res, "Password has been successfully updated");
    }
  } catch (error) {
    return catchMessage(res, error);
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;

    // Validate the email format
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": `"Email" is required`,
        "string.empty": `"Email" is required`,
        "string.email": `"Email" must be a valid email address`,
      }),
    });

    const { error } = schema.validate({ email });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });
    
    if (!user) {
      return validationMessage(res, "Email not found");
    }
    console.log("User found:", user);

    // Convert user._id to mongoose.Types.ObjectId if needed
    const userId = new mongoose.Types.ObjectId(user._id); // Convert to ObjectId

    // Generate reset token
    const resetToken = generateResetToken(email, userId, 15); // Ensure `generateResetToken` accepts ObjectId

    // Send the password reset email
    try {
      await sendEmail(
        "Password Reset Request",
        `Here is your password reset token: ${resetToken}. It is valid for 15 minutes.`,
        email
      );
      // Send success response
      successMessage(
        res,
        "A password reset token has been sent to your email."
      );
    } catch (emailError) {
      return catchMessage(res, new Error('Failed to send password reset email'));
    }

  } catch (error) {
    return catchMessage(res, error);
  }
};

// Admin-specific functions

export const getAllUsersAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Admins should have unrestricted access
    const users = await User.find({ isDeleted: { $ne: true } }).sort({ createdAt: 1 });
    if (!users.length) {
      return validationMessage(res, "No users found");
    }
    successMessage(res, "", users);
  } catch (error) {
    catchMessage(res);
  }
};

export const deleteUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId }: { userId: string } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return validationMessage(res, "User ID is required");
    }

    const deleteUser = await User.findByIdAndUpdate(userId, { isDeleted: true });
    if (!deleteUser) {
      return validationMessage(res, "User not found");
    }
    successMessage(res, "User has been successfully deleted");
  } catch (error) {
    catchMessage(res);
  }
};


