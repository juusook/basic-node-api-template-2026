// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../utils/database.js';

const listAllMedia = async (limit) => {
  try {
    let result;
    if (limit) {
      result = await promisePool.execute('SELECT * FROM MediaItems LIMIT ?', [
        parseInt(limit, 10),
      ]);
    } else {
      result = await promisePool.execute('SELECT * FROM MediaItems');
    }
    const [rows] = result;
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findMediaById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM MediaItems WHERE media_id = ?',
      [id],
    );
    console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addMedia = async (media) => {
  if (!media.description) {
    media.description = '';
  }

  const {user_id, filename, size, mimetype, title, description} = media;
  const sql = `INSERT INTO MediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, filename, size, mimetype, title, description];
  try {
    const rows = await promisePool.execute(sql, params);
    console.log('rows', rows);
    return {media_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const modifyMedia = async (id, media) => {
  const {title, description} = media;
  const sql =
    'UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?';
  const params = [title, description, id];
  try {
    const [result] = await promisePool.execute(sql, params);
    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'Media item updated', media_id: id};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const removeMedia = async (id) => {
  const sql = 'DELETE FROM MediaItems WHERE media_id = ?';
  try {
    const [result] = await promisePool.execute(sql, [id]);
    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'Media item deleted', media_id: id};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {listAllMedia, findMediaById, addMedia, modifyMedia, removeMedia};
