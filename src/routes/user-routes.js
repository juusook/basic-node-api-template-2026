import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {
  deleteUser,
  getUserById,
  getUsers,
  postUser,
  putUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(authenticateToken, postUser);

userRouter
  .route('/:id')
  .get(authenticateToken, getUserById)
  .put(authenticateToken, putUser)
  .delete(deleteUser);

export default userRouter;
