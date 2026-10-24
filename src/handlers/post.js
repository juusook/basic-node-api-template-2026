'use strict';

import {items} from '../data.js';

// Function to generate email based on name
const generateEmail = (name) => {
  if (!name) {
    return '';
  }

  const nameParts = name.split(' ');
  const [firstName, lastName] = nameParts;

  if (nameParts.length > 1) {
    const gmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    return gmail;
  }
  return `${nameParts[0]}@gmail.com`;
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

      // Create new item object with unique id and generated email
      const newItem = {
        id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
        name: name,
        email: email,
        age: inputData.age || 0,
        city: inputData.city || 'unknown city',
      };

      // Add new item to the items array
      items.push(newItem);

      // Send response with new item data
      response.writeHead(201, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({newItem}));
      // Handle invalid JSON data
    } catch {
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({message: 'Invalid JSON data'}));
    }
  });
};
