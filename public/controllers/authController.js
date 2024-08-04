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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthentication = void 0;
const user_1 = require("../models/user");
const index_1 = require("../utils/index");
const handleAuthentication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
                code: 401,
                success: false,
            });
            return; // Ensure you return after sending a response
        }
        // Compare provided password with stored hash
        const isMatch = yield (0, index_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: "Invalid email or password",
                code: 401,
                success: false,
            });
            return; // Ensure you return after sending a response
        }
        // Generate JWT token
        const token = (0, index_1.generateToken)(user._id.toString(), user.role);
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
    }
    catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
            code: 500,
            success: false,
        });
    }
});
exports.handleAuthentication = handleAuthentication;
