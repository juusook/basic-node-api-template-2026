// index.js simple backend server using Node.js
import http from 'http';
const hostname = '127.0.0.1';
const port = 3000;

const htmlContent =
  '<h1 style="color: blue;">Welcome to my REST API!</h1><p>This is a simple REST API built with Node.js and Express.</p>';

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(htmlContent);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
