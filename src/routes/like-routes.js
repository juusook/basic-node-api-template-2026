import express from 'express';
import {
  deleteLike,
  getLikesByMediaId,
  getLikesByUserId,
  postLike,
} from '../controllers/like-controller.js';

const likeRouter = express.Router();

likeRouter.route('/').post(postLike);
likeRouter.route('/media/:id').get(getLikesByMediaId);
likeRouter.route('/user/:id').get(getLikesByUserId);
likeRouter.route('/:id').delete(deleteLike);

export default likeRouter;
