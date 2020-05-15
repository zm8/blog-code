'use strict';

const fs = require('fs');

const html = `
<!DOCTYPE html>
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <h1>Test3</h1>
      <script src="/test.js"></script>
    </body>
</html>`;

var options = {
  key: fs.readFileSync('./cert/local.key'),
  cert: fs.readFileSync('./cert/local.crt'),
};

const https = require('https');
https
  .createServer(options)
  .on('request', (req, res) => {
    const { url } = req;

    if (url === '/') {
      let d = new Date();
      d.setSeconds(d.getSeconds() + 100);
      res.writeHead(200, {
        expires: d.toUTCString(),
        // 'cache-control': 'max-age=10',
        // etag: '111111',
        'content-type': ' text/html; charset=utf-8',
      });
      res.end(html);
      return;
    }
    if (url === '/test.js') {
      let d = new Date();
      d.setSeconds(d.getSeconds() + 10);
      res.writeHead(200, {
        expires: d.toUTCString(),
        // 'cache-control': 'max-age=10',
        'content-type': 'application/javascript; charset=utf-8',
      });
      res.end('console.log(1)');
      return;
    }
    res.statusCode = 404;
    res.end('');
  })
  .listen(9990, () => {
    console.log('打开 https://localhost.meetsocial.cn:9990');
  });
