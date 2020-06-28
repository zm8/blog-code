// 网站搜索
// 打开 http://localhost:8888/?s=%22%3E%3Cscript%3Ealert(1)%3C/script%3E
const http = require('http');
const server = http.createServer();
const url = require('url');

server.on('request', function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  const obj = url.parse(req.url, true);
  const query = obj.query;
  const html = `<!DOCTYPE html><html>
    <body>
    当前搜索的内容是: <input type="text" value="${query.s || ''}" />
    </body>
  </html>`;
  res.write(html);
  res.end();
});

server.listen('8888');
console.log('Server is running at: http://localhost.meetsocial.cn:8888');
