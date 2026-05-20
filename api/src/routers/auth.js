import express from "express";
import { signup, login, me, guestLogin } from "#controllers/auth.js";
import { requireAuth } from "#middlewares/auth.js";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ryan Joon
 *               email:
 *                 type: string
 *                 example: Ryan@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already registered
 */
authRouter.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: Ryan@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: Create a guest token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Returns a guest token and guest ID
 */
authRouter.post("/guest", guestLogin);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
authRouter.get("/me", requireAuth, me);

export default authRouter;
