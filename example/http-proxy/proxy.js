const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('./cert/local.key'),
  cert: fs.readFileSync('./cert/local.crt'),
};
const server = https.createServer(options);
require('./www/codeProxy')(server).listen(7771, () => {
  console.log('打开 https://david.cn:7771');
});
