"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const userController = __importStar(require("../controllers/userController"));
const jwt_middlewares_1 = require("../middlewares/jwt_middlewares");
const admin_middelwares_1 = require("../middlewares/admin_middelwares");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized. The request lacks valid credentials.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Unauthorized access
 */
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Registers a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user.
 *                 example: 01234567890
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *                 example: Password123!
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your account has been created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: First name is required
 */
/**
 * @swagger
 * /api/user/updateuser:
 *   post:
 *     tags:
 *       - User
 *     summary: Update user details
 *     description: Updates user details based on the provided information.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Updated first name of the user.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Updated last name of the user.
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 description: Updated phone number of the user.
 *                 example: 01234567890
 *               email:
 *                 type: string
 *                 description: Updated email address of the user.
 *                 example: john.doe@example.com
 *               address:
 *                 type: string
 *                 description: Updated address of the user.
 *                 example: 123 Main St, Springfield
 *               id:
 *                 type: string
 *                 description: User ID to update.
 *                 example: 60c72b2f5f1b2c001f6478a8
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your information has been successfully updated
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Phone number is already in use
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
/**
 * @swagger
 * /api/user/getuserbyid:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: Retrieves user details by user ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: User ID to retrieve.
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f6478a8
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                       example: 60c72b2f5f1b2c001f6478a8
 *                     firstName:
 *                       type: string
 *                       description: User's first name
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: User's last name
 *                       example: Doe
 *                     phoneNumber:
 *                       type: string
 *                       description: User's phone number
 *                       example: 01234567890
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                       example: john.doe@example.com
 *                     address:
 *                       type: string
 *                       description: User's address
 *                       example: 123 Main St, Springfield
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
/**
 * @swagger
 * /api/user/admin/getallusers:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (Admin only)
 *     description: Retrieves a list of all users. Only accessible to admin users with valid Bearer Token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User ID
 *                         example: 60c72b2f5f1b2c001f6478a8
 *                       firstName:
 *                         type: string
 *                         description: User's first name
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         description: User's last name
 *                         example: Doe
 *                       phoneNumber:
 *                         type: string
 *                         description: User's phone number
 *                         example: 01234567890
 *                       email:
 *                         type: string
 *                         description: User's email address
 *                         example: john.doe@example.com
 *                       address:
 *                         type: string
 *                         description: User's address
 *                         example: 123 Main St, Springfield
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/user/admin/deleteuser:
 *   post:
 *     tags:
 *       - User
 *     summary: Delete a user (Admin only)
 *     description: Deletes a specific user by ID. Only accessible to admin users with valid Bearer Token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to be deleted
 *                 example: 60c72b2f5f1b2c001f6478a8
 *     responses:
 *       200:
 *         description: User has been successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User has been successfully deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", userController.register);
router.post("/updateuser", jwt_middlewares_1.authenticateJWT, userController.updateUser);
router.get("/getuserbyid", jwt_middlewares_1.authenticateJWT, userController.getUserById);
router.get("/getuserspage", jwt_middlewares_1.authenticateJWT, userController.getUsersPage);
router.get("/admin/getallusers", jwt_middlewares_1.authenticateJWT, admin_middelwares_1.authorizeAdmin, userController.getAllUsersAsAdmin);
router.post("/admin/deleteuser", jwt_middlewares_1.authenticateJWT, admin_middelwares_1.authorizeAdmin, userController.deleteUserAsAdmin);
exports.default = router;
