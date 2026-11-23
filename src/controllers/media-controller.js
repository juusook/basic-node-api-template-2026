import {
  addMedia,
  findMediaById,
  listAllMedia,
  modifyMedia,
  removeMedia,
} from '../models/media-model.js';

const getMedia = async (req, res, next) => {
  const result = await listAllMedia(req.query.limit);
  if (!result.error) {
    res.json(result);
  } else {
    const error = new Error(result.error);
    error.status = 500;
    return next(error);
  }
};

const getMediaById = async (req, res, next) => {
  const media = await findMediaById(req.params.id);
  if (media) {
    res.json(media);
  } else {
    const error = new Error('Media item not found');
    error.status = 404;
    return next(error);
  }
};

const postMedia = async (req, res, next) => {
  if (!req.file) {
    const error = new Error('Invalid or missing file');
    error.status = 400;
    return next(error);
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
      const error = new Error('Failed to add media item');
      error.status = 500;
      return next(error);
    }
  } else {
    res.sendStatus(400);
  }
};

const putMedia = async (req, res, next) => {
  const result = await modifyMedia(req.params.id, req.body, req.user);
  if (!result) {
    const error = new Error('Media item not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    const error = new Error(result.error);
    error.status = 500;
    return next(error);
  }
  res.json(result);
};

const deleteMedia = async (req, res, next) => {
  const result = await removeMedia(req.params.id, req.user);
  if (!result) {
    const error = new Error('Media item not found');
    error.status = 404;
    return next(error);
  }
  if (result.error) {
    const error = new Error(result.error);
    error.status = 500;
    return next(error);
  }
  res.json(result);
};

export {getMedia, getMediaById, postMedia, putMedia, deleteMedia};
