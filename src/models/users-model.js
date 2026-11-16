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

const modifyUser = async (id, user) => {
  const {username, password, email} = user;
  if (!username || !password || !email) {
    return {error: 'Missing required fields'};
  }
  const sql = `UPDATE Users SET username = ?, password = ?, email = ?
               WHERE user_id = ?`;
  const params = [username, password, email, id];
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

const deleteUser = async (id) => {
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

export {listAllUsers, findUserById, addUser, modifyUser, deleteUser};
