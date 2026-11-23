import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrors} from '../middlewares/error-handler.js';
import {body} from 'express-validator';

const authRouter = express.Router();

authRouter
  .route('/login')
  .post(
    body('username').trim().notEmpty(),
    body('password').trim().notEmpty(),
    validationErrors,
    postLogin,
  );
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
