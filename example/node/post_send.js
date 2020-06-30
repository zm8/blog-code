const http = require('http');

const options = {
  host: '127.0.0.1',
  port: '3000',
  path: '/',
  method: 'POST',
  timeout: 20 * 1000, // 设置超时时间
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');

  let data = '';
  res
    .on('data', chunk => {
      data += chunk;
    })
    .on('end', () => {
      console.log('\n=====end=====\n');
      console.log(data);
    });
});

req.on('timeout', () => {
  req.abort(); // 中止
});

req.on('error', e => {
  console.error(`problem with request: ${e.message}`);
});

/*
  相当于前端fetch:
  fetch('http://localhost:3000', {
    body: JSON.stringify({ a: 1, b: 2 }),
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    cache: 'no-cache',
    method: 'POST',
    mode: 'cors',
  })
*/
const postData = JSON.stringify({ a: 1, b: 2 });

/*
  或写成:
  const postData = "a=1&b=2";
  const postData = require('querystring').stringify({a: 1, b:2})
  
  相当于前端fetch:
  fetch('http://localhost:3000', {
    body: "a=1&b=2",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    cache: 'no-cache',
    method: 'POST',
    mode: 'cors',
  })
*/

req.write(postData);
req.end();
