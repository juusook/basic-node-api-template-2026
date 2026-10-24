'use strict';

import {items, notFound} from '../data.js';
import {generateEmail} from './post.js';

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

    // Check if index exists
    const index = items.findIndex((item) => id == item.id);
    if (index === -1) {
      notFound(res);
      return;
    }

    // Change json data to object
    const inputData = JSON.parse(data);
    const updateName = inputData.name || items[index].name;
    const updateAge = inputData.age || items[index].age;
    const updateCity = inputData.city || items[index].city;

    const updatedItem = {
      id: parseInt(id), // Make sure id does not change
      name: updateName,
      email: inputData.email || generateEmail(updateName),
      age: updateAge,
      city: updateCity,
    };

    items[index] = updatedItem; // Update item in array
    res.writeHead(200, {'Content-Type': 'application/json'}); // Set response headers
    res.end(JSON.stringify(updatedItem)); // Send response with message
  });
};
