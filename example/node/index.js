var http = require('http');
var server = http.createServer();
let url = require('url');

server.on('request', function(req, res) {
  console.log(req.headers);

  // let obj = url.parse(req.url, true);
  // // query 获取? 后面的参数
  // let query = obj.query;
  // var fn = query.callback;
  // res.writeHead(200, {
  //   "Content-Type": "application/javascript; charset=utf-8"
  // });
  // res.write(fn + "(" + JSON.stringify(query) + ")");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  res.write('hello world');
  res.end();
});

server.listen('8888');
console.log('Server is running at port 8888...');
