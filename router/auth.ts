import * as express from "express";
import * as authController from "../controllers/authController";
import { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a user
 *     description: Logs in a user and returns an authentication token along with user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The authentication token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                     firstName:
 *                       type: string
 *                       description: The first name of the user.
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: The last name of the user.
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       description: The role of the user.
 *                       example: user
 *                     id:
 *                       type: string
 *                       description: The ID of the user.
 *                       example: "60c72b2f5f1b2c001f6478a8"
 *                     authenticated:
 *                       type: boolean
 *                       description: Indicates whether the user is authenticated.
 *                       example: true
 *                     wallet:
 *                       type: object
 *                       description: Wallet details of the user.
 *                       properties:
 *                         balance:
 *                           type: number
 *                           description: The balance in the user's wallet.
 *                           example: 100.0
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *       400:
 *         description: Bad request, email or password is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Email and password are required"
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure of the request.
 *                   example: false
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid email or password"
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure of the request.
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "An error occurred. Please try again later."
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   description: Indicates the failure of the request.
 *                   example: false
 */
router.post("/login", (req: Request, res: Response) =>
    authController.handleAuthentication(req, res)
);

export default router;
