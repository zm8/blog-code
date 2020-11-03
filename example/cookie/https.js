const fs = require('fs');
const https = require('https');
var options = {
  key: fs.readFileSync('./cert/local.key'),
  cert: fs.readFileSync('./cert/local.crt'),
};
const server = https.createServer(options);

server
  .on('request', (req, res) => {
    const { method, url, headers } = req;
    const { origin } = headers;
    // 屏蔽请求 favicon.ico
    if (url === '/favicon.ico') {
      res.statusCode = 404;
      res.end();
      return;
    }

    if (method === 'GET') {
      res.end('get get get');
      return;
    }

    // 返回预检头
    if (method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      origin && res.setHeader('Access-Control-Allow-Origin', origin);
      res.end();
      return;
    }

    if (method === 'POST') {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      origin && res.setHeader('Access-Control-Allow-Origin', origin);
      // 设置 cookie
      res.setHeader('Set-Cookie', [
        `a=11111; domain=.meetsocial.cn; path=/; samesite=none; secure;`,
      ]);
      res.end('POST success');
      return;
    }
  })
  .on('error', err => {
    console.error(err.stack);
  })
  .listen(9999, () => {
    console.log('打开 https://localhost.meetsocial.cn:9999');
  });
