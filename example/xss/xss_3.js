// http://localhost.meetsocial.cn:8888/?t=<img src='1' onerror='alert(1)' />

const http = require('http');
const server = http.createServer();
server.on('request', function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  const html = `<!DOCTYPE html><html>
    <body>
    哈哈哈哈~
    <div id='tttt'></div>
    <script>
    document.getElementById("tttt").innerHTML=decodeURIComponent(location.search.substr(3));
    </script>
    </body>
  </html>`;
  res.write(html);
  res.end();
});

server.listen('8888');
console.log('Server is running at: http://localhost.meetsocial.cn:8888');
