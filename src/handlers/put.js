'use strict';

import {items, notFound} from '../data.js';

export const putHandler = (req, res, id) => {
  if (!id) {
    notFound(res);
    return;
  }
  let data = '';
  req.on('data', (chunk) => {
    data += chunk.toString();
  });
  req.on('end', () => {
    console.log('PUT data:', data);
    const index = items.findIndex((item) => id == item.id);
    // Check if index exists
    if (index === -1) {
      notFound(res);
      return;
    }
    // Change json data to object
    const updatedItem = JSON.parse(data);
    updatedItem.id = parseInt(id); // Make sure id does not change
    items[index] = updatedItem; // Update item in array
    res.writeHead(200, {'Content-Type': 'application/json'}); // Set response headers
    res.end(`{"message": "Item ${id} updated"}`); // Send response with message
  });
};
