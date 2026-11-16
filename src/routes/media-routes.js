import express from 'express';
import {
  getMedia,
  getMediaById,
  postMedia,
  putMedia,
  deleteMedia,
} from '../controllers/media-controller.js';
import upload from '../middlewares/upload.js';

const mediaRouter = express.Router();

mediaRouter.route('/').get(getMedia).post(upload.single('file'), postMedia);

mediaRouter.route('/:id').get(getMediaById).put(putMedia).delete(deleteMedia);

export default mediaRouter;
