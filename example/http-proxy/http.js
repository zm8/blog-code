const http = require('http');
const server = http.createServer();
require('./www/code')(server).listen(9990, () => {
  console.log('打开 http://localhost.meetsocial.cn:9990');
});
