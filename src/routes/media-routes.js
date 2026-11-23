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
