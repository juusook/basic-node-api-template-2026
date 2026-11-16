import {addMedia, findMediaById, listAllMedia} from '../models/media-model.js';

const getMedia = async (req, res) => {
  const result = await listAllMedia();
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
  const {title, description, user_id} = req.body;
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

const putMedia = (req, res) => {
  // not implemented in this example, this is/(or already was) homework!!!
  res.sendStatus(200);
};

const deleteMedia = (req, res) => {
  // not implemented in this example, this is/was homework!!!
  res.sendStatus(200);
};

export {getMedia, getMediaById, postMedia, putMedia, deleteMedia};
