'use strict';

import {items, notFound} from '../data.js';

export const deleteHandler = (req, res, id) => {
  if (!id) {
    notFound(res);
    return;
  }
  const index = items.findIndex((item) => id == item.id);
  if (index === -1) {
    notFound(res);
    return;
  }
  items.splice(index, 1); // Remove item from array
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(`{"message": "Item ${id} deleted"}`);
};
