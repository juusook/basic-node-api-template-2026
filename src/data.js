'use strict';

// mock data
export const items = [
  {
    id: 1,
    name: 'Aku Ankka',
    age: 85,
    city: 'Ankkalinna',
    email: 'aku.ankka@gmail.com',
  },
  {
    id: 2,
    name: 'Mikki Hiiri',
    age: 75,
    city: 'Disnelyland',
    email: 'mikki.hiiri@gmail.com',
  },
  {
    id: 6,
    name: 'Paavo Pesusieni',
    age: 90,
    city: 'Bikini Bottom',
    email: 'paavo.pesusieni@gmail.com',
  },
  {
    id: 8,
    name: 'Homer Simpson',
    age: 40,
    city: 'Springfield',
    email: 'homer.simpson@gmail.com',
  },
];

//  404 errors handler / not found handler
export const notFound = (response) => {
  response.writeHead(404, {'Content-Type': 'text/html'});
  response.end('<p>404 - Not Found</p>');
};
