'use strict';

// mock data
export const items = [
  {id: 1, name: 'Item 1'},
  {id: 2, name: 'Item 2'},
  {id: 6, name: 'Item 6'},
  {id: 8, name: 'Item 8'},
];

//  404 errors handler / not found handler
export const notFound = (response) => {
  response.writeHead(404, {'Content-Type': 'text/html'});
  response.end('<p>404 - Not Found</p>');
};
