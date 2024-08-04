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
exports.deleteUserAsAdmin = exports.getAllUsersAsAdmin = exports.requestPasswordReset = exports.resetPassword = exports.emailActivation = exports.sendEmailActivationCode = exports.getUsersByQuery = exports.deleteUser = exports.getUsersPage = exports.getUsers = exports.getUserById = exports.updateUser = exports.vUpdateUser = exports.register = exports.vRegister = void 0;
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const index_1 = require("../utils/index");
const mongoose_1 = __importDefault(require("mongoose"));
const vRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phoneNumber, password, email } = req.body;
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
        (0, index_1.validationMessage)(res, error.details[0].message);
        return;
    }
    const existPhoneNumber = yield user_1.User.find({ phoneNumber }).countDocuments();
    if (existPhoneNumber > 0) {
        (0, index_1.validationMessage)(res, "Phone number is already in use");
        return;
    }
    next();
});
exports.vRegister = vRegister;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phoneNumber, password, email } = req.body;
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.User({
            firstName,
            lastName,
            phoneNumber,
            role: "customer",
            password: hashPassword,
            email,
        });
        const savedUser = yield newUser.save();
        if (!savedUser) {
            (0, index_1.catchMessage)(res);
        }
        else {
            (0, index_1.successMessage)(res, "Your account has been created successfully");
        }
    }
    catch (err) {
        (0, index_1.catchMessage)(res);
    }
});
exports.register = register;
const vUpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phoneNumber, email, address, id, } = req.body;
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
        (0, index_1.validationMessage)(res, error.details[0].message);
        return;
    }
    const existPhoneNumber = yield user_1.User.find({
        phoneNumber,
        _id: { $ne: id },
    }).countDocuments();
    if (existPhoneNumber > 0) {
        (0, index_1.validationMessage)(res, "Phone number is already in use");
        return;
    }
    next();
});
exports.vUpdateUser = vUpdateUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phoneNumber, email, address, id, } = req.body;
        const updateUser = yield user_1.User.findByIdAndUpdate(id, {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
        });
        if (!updateUser) {
            (0, index_1.catchMessage)(res);
        }
        else {
            (0, index_1.successMessage)(res, "Your information has been successfully updated");
        }
    }
    catch (err) {
        (0, index_1.catchMessage)(res);
    }
});
exports.updateUser = updateUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        let user = yield user_1.User.findById(userId).populate({
            path: "address",
        });
        if (!user) {
            return (0, index_1.validationMessage)(res, "User not found");
        }
        (0, index_1.successMessage)(res, "", user);
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.getUserById = getUserById;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield user_1.User.find({ isDeleted: { $ne: true } }).sort({
            createdAt: 1,
        });
        if (!users.length) {
            return (0, index_1.validationMessage)(res, "No users found");
        }
        (0, index_1.successMessage)(res, "", users);
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.getUsers = getUsers;
const getUsersPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rowsPerPage, page, search } = {
            rowsPerPage: Number(req.query.rowsPerPage),
            page: Number(req.query.page),
            search: req.query.search,
        };
        if (typeof rowsPerPage !== "number" || typeof page !== "number") {
            return (0, index_1.validationMessage)(res, "Invalid input values");
        }
        const conditions = { isDeleted: { $ne: true } };
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
        let [data] = yield user_1.User.aggregate(pipeline);
        if (!data || !data.datas.length) {
            return (0, index_1.validationMessage)(res, "No users found");
        }
        const totalRecords = data.totalDataCount.length > 0 ? data.totalDataCount[0].count : 0;
        (0, index_1.successMessage)(res, "", { datas: data.datas, totalRecords });
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.getUsersPage = getUsersPage;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const deleteUser = yield user_1.User.findByIdAndUpdate(userId, {
            isDeleted: true,
        });
        if (!deleteUser) {
            return (0, index_1.validationMessage)(res, "User not found");
        }
        (0, index_1.successMessage)(res, "User has been successfully deleted");
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.deleteUser = deleteUser;
const getUsersByQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters and provide default values
        const rowsPerPage = Number(req.query.rowsPerPage) || 10; // Default to 10 if not provided
        const page = Number(req.query.page) || 1; // Default to page 1 if not provided
        const search = req.query.search || "";
        const filterBy = req.query.filterBy || "";
        // Ensure rowsPerPage and page are valid numbers
        if (isNaN(rowsPerPage) || isNaN(page)) {
            return (0, index_1.validationMessage)(res, "Invalid input values for pagination");
        }
        const conditions = { isDeleted: { $ne: true } };
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
        const users = yield user_1.User.find(conditions)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Count total records for pagination info
        const totalRecords = yield user_1.User.countDocuments(conditions);
        if (!users.length) {
            return (0, index_1.validationMessage)(res, "No users found");
        }
        (0, index_1.successMessage)(res, "", { users, totalRecords });
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.getUsersByQuery = getUsersByQuery;
const sendEmailActivationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
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
            return (0, index_1.validationMessage)(res, error.details[0].message);
        }
        const emailActivationCode = (0, index_1.generateActivationCode)(6);
        const user = yield user_1.User.findOneAndUpdate({ email }, { emailActivationCode }, { new: true } // Return the updated document
        );
        if (!user) {
            return (0, index_1.validationMessage)(res, 'Email is invalid');
        }
        (0, index_1.successMessage)(res, 'An activation code has been sent to you. Please use this code to set your new password.');
        (0, index_1.sendEmail)('Activation code for password reset', // Subject
        `Your activation code is: ${emailActivationCode}`, // Body
        email // Recipient email
        );
    }
    catch (error) {
        return (0, index_1.catchMessage)(res, error);
    }
});
exports.sendEmailActivationCode = sendEmailActivationCode;
const emailActivation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailActivationCode } = req.body;
        const schema = Joi.object({
            emailActivationCode: Joi.string().required().messages({
                "any.required": `"Email activation code" is required`,
                "string.empty": `"Email activation code" should not be empty`,
            }),
        });
        const { error } = schema.validate({ emailActivationCode });
        if (error) {
            return (0, index_1.validationMessage)(res, error.details[0].message);
        }
        // Check if req.user is defined
        if (!req.user || !req.user.id) {
            return (0, index_1.validationMessage)(res, "User not authenticated");
        }
        const user = yield user_1.User.findById(req.user.id);
        if (!user) {
            return (0, index_1.catchMessage)(res);
        }
        else if (user.emailActivationCode !== emailActivationCode) {
            return (0, index_1.validationMessage)(res, "The code is invalid");
        }
        else if (user.emailActivationExpiresAt &&
            user.emailActivationExpiresAt < new Date()) {
            return (0, index_1.validationMessage)(res, "The code has expired. Please try again.");
        }
        else {
            user_1.User.findOneAndUpdate({ _id: user._id }, { isEmailActivated: true }, (err, doc) => {
                if (err || !doc) {
                    return (0, index_1.catchMessage)(res);
                }
                else {
                    return (0, index_1.successMessage)(res, "Your email has been successfully verified");
                }
            });
        }
    }
    catch (error) {
        return (0, index_1.catchMessage)(res);
    }
});
exports.emailActivation = emailActivation;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resetToken, newPassword } = req.body;
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
            return (0, index_1.validationMessage)(res, error.details[0].message);
        }
        // Decode the token to get user details
        const decoded = (0, index_1.decodeResetToken)(resetToken);
        if (!decoded) {
            return (0, index_1.validationMessage)(res, "Invalid or expired reset token");
        }
        const { userId } = decoded;
        // Find the user by ID
        const user = yield user_1.User.findById(userId);
        if (!user) {
            return (0, index_1.validationMessage)(res, "User not found");
        }
        // Hash the new password
        const hashPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update the user's password
        const updateUser = yield user_1.User.findByIdAndUpdate(userId, {
            password: hashPassword,
        });
        if (!updateUser) {
            return (0, index_1.catchMessage)(res, new Error('User not found'));
        }
        else {
            return (0, index_1.successMessage)(res, "Password has been successfully updated");
        }
    }
    catch (error) {
        return (0, index_1.catchMessage)(res, error);
    }
});
exports.resetPassword = resetPassword;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
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
            return (0, index_1.validationMessage)(res, error.details[0].message);
        }
        // Check if the user exists with the provided email
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return (0, index_1.validationMessage)(res, "Email not found");
        }
        console.log("User found:", user);
        // Convert user._id to mongoose.Types.ObjectId if needed
        const userId = new mongoose_1.default.Types.ObjectId(user._id); // Convert to ObjectId
        // Generate reset token
        const resetToken = (0, index_1.generateResetToken)(email, userId, 15); // Ensure `generateResetToken` accepts ObjectId
        // Send the password reset email
        try {
            yield (0, index_1.sendEmail)("Password Reset Request", `Here is your password reset token: ${resetToken}. It is valid for 15 minutes.`, email);
            // Send success response
            (0, index_1.successMessage)(res, "A password reset token has been sent to your email.");
        }
        catch (emailError) {
            return (0, index_1.catchMessage)(res, new Error('Failed to send password reset email'));
        }
    }
    catch (error) {
        return (0, index_1.catchMessage)(res, error);
    }
});
exports.requestPasswordReset = requestPasswordReset;
// Admin-specific functions
const getAllUsersAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Admins should have unrestricted access
        const users = yield user_1.User.find({ isDeleted: { $ne: true } }).sort({ createdAt: 1 });
        if (!users.length) {
            return (0, index_1.validationMessage)(res, "No users found");
        }
        (0, index_1.successMessage)(res, "", users);
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.getAllUsersAsAdmin = getAllUsersAsAdmin;
const deleteUserAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        // Ensure userId is provided
        if (!userId) {
            return (0, index_1.validationMessage)(res, "User ID is required");
        }
        const deleteUser = yield user_1.User.findByIdAndUpdate(userId, { isDeleted: true });
        if (!deleteUser) {
            return (0, index_1.validationMessage)(res, "User not found");
        }
        (0, index_1.successMessage)(res, "User has been successfully deleted");
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.deleteUserAsAdmin = deleteUserAsAdmin;
