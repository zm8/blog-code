const http = require('http');
const server = http.createServer();

server.on('request', function(req, res) {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  // 从数据库拿出来的内容
  const sqlCnt = '<script>console.log(1)</script>';
  const html = `<!DOCTYPE html><html>
    <body>
      我发表了内容:
      xxxx
      ${sqlCnt}
    </body>
  </html>`;
  res.write(html);
  res.statusCode = 200;
  res.end();
});

server.listen('8888');
console.log('Server is running at: http://localhost.meetsocial.cn:8888');
