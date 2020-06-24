const express = require('express');
const app = express();

var options = {
  etag: true,
  lastModified: true,
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': 'max-age=1000',
    });
  },
};
app.use(express.static(__dirname + '/public', options));
app.listen(3000);
console.log('打开 http://localhost.meetsocial.cn:3000');
