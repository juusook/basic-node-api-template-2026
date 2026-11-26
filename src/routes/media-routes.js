import express from 'express';
import {
  deleteMedia as deleteMediaItem,
  getMediaById as getMediaItemById,
  getMedia as getMediaItems,
  postMedia as postMediaItem,
  putMedia as putMediaItem,
} from '../controllers/media-controller.js';
import upload from '../middlewares/upload.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {body, param, query} from 'express-validator';
import {validationErrors} from '../middlewares/error-handler.js';

//import {logRequest} from '../middlewares/logger.js';

const mediaRouter = express.Router();

// use middleware for all routes (mediaRouter)
//mediaRouter.use(logRequest);

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media items
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Limit the number of returned media items
 *     responses:
 *       200:
 *         description: List of media items
 *       400:
 *         description: Invalid limit parameter
 *   post:
 *     summary: Upload a new media item
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, title]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file (image/video)
 *               title:
 *                 type: string
 *                 minLength: 2
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: New media item created
 *       400:
 *         description: Validation error or missing file
 *       401:
 *         description: Unauthorized
 *
 * /api/media/{id}:
 *   get:
 *     summary: Get media item by ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media item details
 *       404:
 *         description: Media item not found
 *   put:
 *     summary: Update media item details
 *     tags: [Media]
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
 *               title:
 *                 type: string
 *                 minLength: 2
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Media item updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Media item not found
 *   delete:
 *     summary: Delete media item
 *     tags: [Media]
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
 *         description: Media item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Media item not found
 */

mediaRouter
  .route('/')
  .get(
    query('limit')
      .custom((value) => {
        console.log(value);
        if (!value || !isNaN(Number(value))) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage('Parameteter not a number'),
    validationErrors,
    getMediaItems,
  )
  .post(
    authenticateToken,
    upload.single('file'),
    body('title').isLength({min: 2}),
    validationErrors,
    postMediaItem,
  );

mediaRouter
  .route('/:id')
  .get(param('id').isInt(), validationErrors, getMediaItemById)
  .put(
    authenticateToken,
    param('id').isInt(),
    body('title').optional().trim().isLength({min: 2}),
    body('description').optional().trim().escape(),
    validationErrors,
    putMediaItem,
  )
  .delete(
    authenticateToken,
    param('id').isInt(),
    validationErrors,
    deleteMediaItem,
  );

export default mediaRouter;
