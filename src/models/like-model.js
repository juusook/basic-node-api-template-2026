import promisePool from '../utils/database.js';

const findLikesByMediaId = async (mediaId) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM Likes WHERE media_id = ?',
      [mediaId],
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findLikesByUserId = async (userId) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM Likes WHERE user_id = ?',
      [userId],
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addLike = async (like) => {
  const {media_id, user_id} = like;
  try {
    // Tarkistetaan ensin, onko tykkäys jo olemassa
    const [existing] = await promisePool.execute(
      'SELECT * FROM Likes WHERE media_id = ? AND user_id = ?',
      [media_id, user_id],
    );
    if (existing.length > 0) {
      return {
        conflict: true,
        message: 'User has already liked this media item',
      };
    }

    const [result] = await promisePool.execute(
      'INSERT INTO Likes (media_id, user_id) VALUES (?, ?)',
      [media_id, user_id],
    );
    return {like_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const removeLike = async (id) => {
  try {
    const [result] = await promisePool.execute(
      'DELETE FROM Likes WHERE like_id = ?',
      [id],
    );
    if (result.affectedRows === 0) {
      return false;
    }
    return {message: 'Like deleted', like_id: id};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {findLikesByMediaId, findLikesByUserId, addLike, removeLike};
