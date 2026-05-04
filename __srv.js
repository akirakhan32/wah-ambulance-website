const http = require('http');
const fs = require('fs');
const path = require('path');
const PROJECT = 'D:\\PROJECTS\\ambulance website';
const ASSETS = path.join(PROJECT, 'assets');
const PORT = 3000;
const mime = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req, res) => {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  for (const fp of [path.join(PROJECT, p), path.join(ASSETS, p)]) {
    if (fs.existsSync(fp) && !fs.statSync(fp).isDirectory()) {
      res.writeHead(200, {'Content-Type': mime[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
      return fs.createReadStream(fp).pipe(res);
    }
  }
  res.writeHead(404); res.end('404');
}).listen(PORT);
