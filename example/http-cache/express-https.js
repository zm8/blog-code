const express = require('express');
const app = express();
var https = require('https');
var fs = require('fs');
var privateKey = fs.readFileSync('cert/local.key', 'utf8');
var certificate = fs.readFileSync('cert/local.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);

var options = {
  etag: false, // 禁用协商缓存
  // lastModified: false,
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': 'max-age=100',
    });
  },
};
app.use(express.static(__dirname + '/public', options));
httpsServer.listen(3000);
console.log('打开 https://localhost.meetsocial.cn:3000');
