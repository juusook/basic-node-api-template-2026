import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrors} from '../middlewares/error-handler.js';
import {body} from 'express-validator';
import rateLimit from 'express-rate-limit';

const authRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuuttia
  max: 10, // Enintään 10 yritystä per IP
  message: {error: 'Too many login attempts, please try again later.'},
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login and JWT token generation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: PattiSmith
 *               password:
 *                 type: string
 *                 example: salasana
 *     responses:
 *       200:
 *         description: Login successful, returns user info and JWT token
 *       401:
 *         description: Invalid username or password
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *       401:
 *         description: Missing or invalid token
 */

authRouter
  .route('/login')
  .post(
    loginLimiter,
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    validationErrors,
    postLogin,
  );
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
