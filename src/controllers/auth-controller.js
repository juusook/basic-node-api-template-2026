import jwt from 'jsonwebtoken';
import {findUserByUsername} from '../models/users-model.js';
import 'dotenv/config';

// User authentication controller functions
const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const user = await findUserByUsername(req.body.username);
  //console.log('user found?', user);
  if (user && user.password === req.body.password) {
    delete user.password;
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({...user, token});
  } else {
    res.sendStatus(401);
  }
};

/**
 * Get user information based on token data
 * @param {*} req
 * @param {*} res
 */
const getMe = (req, res) => {
  res.json(req.user);
};

export {postLogin, getMe};
