'use strict';

import {items} from '../data.js';

export const postHandler = (request, response) => {
  let data = '';

  // Vastaanotetaan dataa POST-pyynnöstä
  request.on('data', (chunk) => {
    data += chunk.toString();
  });
  request.on('end', () => {
    console.log('POST data:', data);

    // Create new object based on posted json data
    try {
      const newItem = JSON.parse(data);
      newItem.id = items[items.length - 1].id + 1;
      items.push(newItem);
      response.writeHead(201, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({message: 'Data received'}));
    } catch {
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({message: 'Invalid JSON data'}));
    }
  });
};
