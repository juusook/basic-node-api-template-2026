import {
  addMedia,
  findMediaById,
  listAllMedia,
  modifyMedia,
  removeMedia,
} from '../models/media-model.js';

const getMedia = async (req, res) => {
  const result = await listAllMedia(req.query.limit);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
};

const getMediaById = async (req, res) => {
  const media = await findMediaById(req.params.id);
  if (media) {
    res.json(media);
  } else {
    res.sendStatus(404);
  }
};

const postMedia = async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  const {filename, size, mimetype} = req.file;
  const {title, description} = req.body;
  const user_id = req.user.user_id;

  if (filename && title && user_id) {
    const result = await addMedia({
      filename,
      size,
      mimetype,
      title,
      description,
      user_id,
    });
    if (result.media_id) {
      res.status(201);
      res.json({message: 'New media item added.', ...result});
    } else {
      res.status(500);
      res.json(result);
    }
  } else {
    res.sendStatus(400);
  }
};

const putMedia = async (req, res) => {
  const result = await modifyMedia(req.params.id, req.body, req.user);
  if (!result) {
    return res.status(404).json({error: 404, message: 'Media item not found'});
  }
  if (result.error) {
    return res.status(500).json(result);
  }
  res.json(result);
};

const deleteMedia = async (req, res) => {
  const result = await removeMedia(req.params.id, req.user);
  if (!result) {
    return res.status(404).json({error: 404, message: 'Media item not found'});
  }
  if (result.error) {
    return res.status(500).json(result);
  }
  res.json(result);
};

export {getMedia, getMediaById, postMedia, putMedia, deleteMedia};
