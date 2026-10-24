import {notFound} from './data.js';
import {getHandler} from './handlers/get.js';
import {postHandler} from './handlers/post.js';
import {putHandler} from './handlers/put.js';
import {deleteHandler} from './handlers/delete.js';
import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log('Request', req.method, req.url);
  // split request url to resource name and resource id
  const [, resource, id] = req.url.split('/');

  // GET root
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'}); // Set response headers
    res.end('<h1 style="color: blue">Tervetuloa harjoitusrajapintaan</h1>'); // Send response with message

    // GET /items
  } else if (req.method === 'GET' && resource === 'items') {
    getHandler(req, res, id);

    // POST /items
  } else if (req.method === 'POST' && resource === 'items') {
    postHandler(req, res);

    // PUT items by id
  } else if (req.method === 'PUT' && resource === 'items') {
    putHandler(req, res, id);

    // DELETE items by id
  } else if (req.method === 'DELETE' && resource === 'items') {
    deleteHandler(req, res, id);

    // Default 404 error responsse
  } else {
    notFound(res);
  }
});

// Start server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
