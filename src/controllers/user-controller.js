import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  deleteUser as deleteUserModel,
} from '../models/users-model.js';

const getUsers = async (req, res) => {
  const result = await listAllUsers();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({error: 404, message: 'User not found'});
  }
  if (user.error) {
    return res.status(500).json(user);
  }
  res.json(user);
};

const postUser = async (req, res) => {
  const {username, password, email} = req.body;
  if (username && password && email) {
    const result = await addUser(req.body);
    if (result.user_id) {
      res.status(201).json({message: 'New user added.', ...result});
    } else {
      res.status(500).json(result);
    }
  } else {
    res.status(400).json({error: 400, message: 'Missing required fields'});
  }
};

const putUser = async (req, res) => {
  const {username, password, email} = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({
      error: 400,
      message: 'Missing required fields (username, password, email)',
    });
  }
  const result = await modifyUser(req.params.id, req.body);
  if (!result) {
    return res.status(404).json({error: 404, message: 'User not found'});
  }
  if (result.error) {
    return res.status(500).json(result);
  }
  res.json(result);
};

const deleteUser = async (req, res) => {
  const result = await deleteUserModel(req.params.id);
  if (!result) {
    return res.status(404).json({error: 404, message: 'User not found'});
  }
  if (result.error) {
    return res.status(500).json(result);
  }
  res.json(result);
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
