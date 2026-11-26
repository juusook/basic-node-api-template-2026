import express from 'express';
import {
  deleteLike,
  getLikesByMediaId,
  getLikesByUserId,
  postLike,
} from '../controllers/like-controller.js';

const likeRouter = express.Router();

/**
 * @swagger
 * /api/likes:
 *   get:
 *     summary: Get all likes
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: List of likes
 *   post:
 *     summary: Add a like to a media item
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [media_id]
 *             properties:
 *               media_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Like added
 *       401:
 *         description: Unauthorized
 *
 * /api/likes/{id}:
 *   delete:
 *     summary: Remove a like by ID
 *     tags: [Likes]
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
 *         description: Like deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Like not found
 */

likeRouter.route('/').post(postLike);
likeRouter.route('/media/:id').get(getLikesByMediaId);
likeRouter.route('/user/:id').get(getLikesByUserId);
likeRouter.route('/:id').delete(deleteLike);

export default likeRouter;
