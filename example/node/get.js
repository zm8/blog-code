const http = require('http');
const url = require('url');

/*
    创建服务器调用 http.createServer();
    服务器每次收到 http 请求后都会调用这个回调函数,
*/
var server = http.createServer().on('request', (req, res) => {
  // req.method 查看用的是哪个 HTTP 方法
  switch (req.method) {
    case 'GET':
      showGet(res, req);
      break;
  }
});

server.listen(3000);

function showGet(res, req) {
  const obj = url.parse(req.url, true);
  let data = obj.query;
  data = JSON.stringify(data);

  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许跨域
  res.setHeader('Contenty-Type', 'application/json;charset=utf-8');
  res.statusCode = 200;
  res.end(data);
}
