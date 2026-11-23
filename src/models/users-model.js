import promisePool from '../utils/database.js';

const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Users');
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findUserById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM Users WHERE user_id = ?',
      [id],
    );
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findUserByUsername = async (username) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username],
    );
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addUser = async (user) => {
  const {username, password, email, user_level_id} = user;
  // Jos user_level_id jätetään antamatta, asetetaan oletukseksi peruskäyttäjä (2)
  const levelId = user_level_id || 2;
  const sql = `INSERT INTO Users (username, password, email, user_level_id)
               VALUES (?, ?, ?, ?)`;
  const params = [username, password, email, levelId];
  try {
    const [result] = await promisePool.execute(sql, params);
    return {user_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const modifyUser = async (id, user, currentUser) => {
  const {username, password, email} = user;
  if (!username || !password || !email) {
    return {error: 'Missing required fields'};
  }

  // If the user is not an admin, restrict the update to their own user information
  let sql =
    'UPDATE Users SET username = ?, password = ?, email = ? WHERE user_id = ?';
  const params = [username, password, email, id];
  if (currentUser.user_level_id !== 1) {
    sql += ' AND user_id = ?';
    params.push(currentUser.user_id);
  }

  try {
    const [result] = await promisePool.execute(sql, params);
    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'User updated', user_id: id};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const deleteUser = async (id, currentUser) => {
  // If the user is not an admin, only allow deletion of their own user information
  if (currentUser.user_level_id !== 1) {
    if (currentUser.user_id !== Number(id)) {
      return {error: 'You are not allowed to delete this user'};
    }
  }

  const sql = 'DELETE FROM Users WHERE user_id = ?';
  try {
    const [result] = await promisePool.execute(sql, [id]);
    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'User deleted', user_id: id};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  modifyUser,
  deleteUser,
};
