import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  getMedia,
  getMediaById,
  postMedia,
  putMedia,
  deleteMedia,
} from '../controllers/media-controller.js';
import upload from '../middlewares/upload.js';

const mediaRouter = express.Router();

mediaRouter
  .route('/')
  .get(getMedia)
  .post(authenticateToken, upload.single('file'), postMedia);

mediaRouter
  .route('/:id')
  .get(getMediaById)
  .put(authenticateToken, putMedia)
  .delete(authenticateToken, deleteMedia);

export default mediaRouter;
