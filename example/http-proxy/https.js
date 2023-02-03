const fs = require('fs');
const https = require('https');

var options = {
	key: fs.readFileSync('./cert/local.key'),
	cert: fs.readFileSync('./cert/local.crt'),
};
const server = https.createServer(options);
require('./www/code')(server).listen(9991, () => {
	console.log('打开 https://localhost.meetsocial.cn:9991');
});
