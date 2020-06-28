/*

// 修改金额 post
fetch('http://localhost.meetsocial.cn:8888/update', {
    body: JSON.stringify({amount: 2}),
    method: 'POST'
});

// 修改金额 get
fetch('http://localhost.meetsocial.cn:8888/update?amount=1');

// 移除cookie
document.cookie =`token=true;expires=${new Date(null)}`

// 其它地址
http://localhost:44441

*/

const http = require('http');
const server = http.createServer();
const { writeFile, readFile } = require('fs').promises;
const url = require('url');
const qs = require('querystring');

server.on('request', async function(req, res) {
  const { url, headers } = req;
  const { cookie } = headers;

  // console.log(headers);
  // console.log(url);

  try {
    await readFile('./note.txt', 'utf8');
  } catch (e) {
    await writeFile('./note.txt', '0');
  }

  if (isTokenExit(cookie) && url.indexOf('/update') === 0) {
    update(req, res);
    return;
  }

  let body = '';
  if (isTokenExit(cookie)) {
    let cnt = '';
    try {
      cnt = await readFile('./note.txt', 'utf8');
      cnt = JSON.parse(cnt);
    } catch (e) {
      //
    }
    body = `当前银行设置的金额为: ${cnt}`;
  } else {
    body = '未登录';
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');

  const html = `<!DOCTYPE html>
  <head>
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
  </head>
  <html>
    <body>
      ${body}
    </body>
  </html>`;
  res.write(html);
  res.end();
});

server.listen('8888');
console.log('Server is running at: http://localhost.meetsocial.cn:8888');

function isTokenExit(cookie) {
  return cookie && cookie.indexOf('token') > -1;
}

function update(req, res) {
  switch (req.method) {
    case 'POST':
      getPostData(req, data => {
        showData(res, data);
      });
      break;
    case 'GET':
      getGetData(req, data => {
        showData(res, data);
      });
      break;
  }
}

function getGetData(req, callback) {
  const obj = url.parse(req.url, true);
  const data = obj.query;
  callback(data);
}

function getPostData(req, callback) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = qs.parse(body);
    }
    callback(body);
  });
}

async function showData(res, data = {}) {
  const amount = data.amount;
  await writeFile('./note.txt', JSON.stringify(amount || 0));
  res.setHeader('Contenty-Type', 'application/json;charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ code: 0, meessage: 'success', amount }));
}
