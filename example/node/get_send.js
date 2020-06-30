const http = require('http');

const options = {
  host: '127.0.0.1',
  port: '3000',
  path: '/?a=111&b=222',
  method: 'GET',
  timeout: 20 * 1000, // 设置超时时间
};

// 或 http.get('http://127.0.0.1:3000/?a=111&b=222', res=>{})
const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');

  let data = '';
  res
    .on('data', chunk => {
      // console.log(`BODY: ${chunk}`);
      data += chunk;
    })
    .on('end', () => {
      console.log('=====end=====');
      console.log(data);
    });
});

req.on('timeout', () => {
  req.abort(); // 中止
});

req.on('error', e => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
