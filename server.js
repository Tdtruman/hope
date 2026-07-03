const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TYPES = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const file = clean === '/' ? '/index.html' : clean;
  const resolved = path.resolve(ROOT, `.${file}`);
  return resolved.startsWith(ROOT) ? resolved : path.join(ROOT, 'index.html');
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'content-type':'text/plain; charset=utf-8'});
      res.end('Not found');
      return;
    }
    res.writeHead(200, {'content-type': TYPES[path.extname(filePath)] || 'application/octet-stream'});
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Condo maintenance manager running at http://localhost:${PORT}`);
});
