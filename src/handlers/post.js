'use strict';

import {items} from '../data.js';

const generateEmail = (name) => {
  if (!name) {
    return '';
  }

  const nameParts = name.split(' ');
  const [firstName, lastName] = nameParts;
  const gmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
  return gmail;
};

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
      const inputData = JSON.parse(data);
      const name = inputData.name || 'unknown charachter';
      const email = generateEmail(name);

      const newItem = {
        id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
        name: name,
        email: email,
        age: inputData.age || 0,
        city: inputData.city || 'unknown city',
      };

      items.push(newItem);
      response.writeHead(201, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({message: 'Data received'}));
    } catch {
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({message: 'Invalid JSON data'}));
    }
  });
};
