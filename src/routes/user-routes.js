import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {body, param} from 'express-validator';
import {validationErrors} from '../middlewares/error-handler.js';
import {authenticateToken} from '../middlewares/authentication.js';

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: New user created
 *       400:
 *         description: Validation error or missing required fields
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 */

userRouter
  .route('/')
  .get(getUsers)
  .post(
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('password').trim().isLength({min: 8}),
    body('email').trim().isEmail().normalizeEmail(),
    validationErrors,
    postUser,
  );

userRouter
  .route('/:id')
  .get(param('id').isInt(), validationErrors, getUserById)
  .put(
    authenticateToken,
    param('id').isInt(),
    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('password').optional().trim().isLength({min: 8}),
    body('email').optional().trim().isEmail().normalizeEmail(),
    validationErrors,
    putUser,
  )
  .delete(authenticateToken, param('id').isInt(), validationErrors, deleteUser);

export default userRouter;
