'use strict';

import {items, notFound} from '../data.js';

export const getHandler = (req, res, id) => {
  if (id) {
    const item = items.find((item) => id == item.id);
    if (!item) {
      notFound(res);
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(item));
  } else {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(items));
  }
  res.end();
};
