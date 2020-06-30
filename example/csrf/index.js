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

// 跨子域修改金额
fetch('http://david.meetsocial.cn:8888/update', {
    body: JSON.stringify({amount: 2}),
    credentials: 'include',
    method: 'POST'
});

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

  console.log('cookie: ', cookie);
  console.log('url', url);
  console.log('method', req.method);
  console.log('headers', headers);
  console.log('==========\n\n');

  // // 跨子域修改金额
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', headers.origin);
  }

  // 若未登录
  if (!isTokenExit(cookie)) {
    resWriteHtml(res, `未登录`);
    return;
  }

  // 创建本地文件
  try {
    await readFile('./note.txt', 'utf8');
  } catch (e) {
    await writeFile('./note.txt', '0'); // 设置默认值
  }

  // 更新接口
  if (url.indexOf('/update') === 0) {
    update(req, res);
    return;
  }

  // 展示页面
  let cnt = await readFile('./note.txt', 'utf8');
  cnt = JSON.parse(cnt);
  resWriteHtml(res, `当前银行设置的金额为: ${cnt}`);
});

function resWriteHtml(res, body) {
  let html = `<!DOCTYPE html>
  <head>
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
  </head>
  <html>
    <body>
      ${body}
    </body>
  </html>`;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.write(html);
  res.end();
}

function isTokenExit(cookie) {
  return cookie && cookie.indexOf('token') > -1;
}

function update(req, res) {
  switch (req.method) {
    case 'POST':
      postData(req, data => {
        showData(res, data);
      });
      break;
    case 'GET':
      getData(req, data => {
        showData(res, data);
      });
      break;
  }
}

function getData(req, callback) {
  const obj = url.parse(req.url, true);
  const data = obj.query;
  callback(data);
}

function postData(req, callback) {
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

server.listen('8888');
console.log('Server is running at: http://localhost.meetsocial.cn:8888');
