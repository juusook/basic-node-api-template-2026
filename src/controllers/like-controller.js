import {
  addLike,
  findLikesByMediaId,
  findLikesByUserId,
  removeLike,
} from '../models/like-model.js';

const getLikesByMediaId = async (req, res) => {
  const result = await findLikesByMediaId(req.params.id);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const getLikesByUserId = async (req, res) => {
  const result = await findLikesByUserId(req.params.id);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const postLike = async (req, res) => {
  const {media_id, user_id} = req.body;
  if (!media_id || !user_id) {
    return res
      .status(400)
      .json({error: 400, message: 'media_id and user_id are required'});
  }
  const result = await addLike(req.body);
  if (result.conflict) {
    return res.status(409).json({error: 409, message: result.message});
  }
  if (result.like_id) {
    res.status(201).json({message: 'Like added.', ...result});
  } else {
    res.status(500).json(result);
  }
};

const deleteLike = async (req, res) => {
  const result = await removeLike(req.params.id);
  if (!result) {
    return res.status(404).json({error: 404, message: 'Like not found'});
  }
  if (result.error) {
    return res.status(500).json(result);
  }
  res.json(result);
};

export {getLikesByMediaId, getLikesByUserId, postLike, deleteLike};
