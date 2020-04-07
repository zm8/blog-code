const qs = require('querystring');
const https = require('https');
const fs = require('fs');

// https.globalAgent.options.ca = fs.readFileSync("cert/rootCA.pem");
const agent = new https.Agent();
agent.options.ca = fs.readFileSync('./cert/rootCA.pem', 'utf8');

// 转发
function forward({ reqOrg, resOrg, data }) {
  const { method, url, headers } = reqOrg;
  console.log('method: ', method);
  console.log('url: ', url);
  console.log('req headers===', headers);
  delete headers.host;

  const options = {
    hostname: 'localhost.meetsocial.cn',
    port: 9991,
    path: url,
    method,
    agent,
    headers,
  };
  const req = https.request(options, res => {
    res.setEncoding('utf8');
    const { headers, statusCode } = res;
    console.log('res headers===', headers);

    let data = '';
    res
      .on('data', chunk => {
        data += chunk;
      })
      .on('end', () => {
        if (statusCode === 200) {
          console.log(resOrg.set);
          // 去掉 domain, 只取cookie 的value值
          const cookies = headers['set-cookie'].map(item => {
            return item.split(';')[0] + '; path=/';
          });
          headers['set-cookie'] = cookies;
          resOrg.writeHead(200, headers);
          /*
            由于是同域, 所以只执行下面的方法也是可以的:

            resOrg.writeHead(200, {
              "set-cookie": cookies
            });
          */
          resOrg.end(data);
        }
      });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });
  req.write(data);
  req.end();
}

module.exports = function(server) {
  return server
    .on('request', (req, res) => {
      const { method, url } = req;

      // 屏蔽请求 favicon.ico
      if (url === '/favicon.ico') {
        handleFavicon(req, res);
        return;
      }

      if (method === 'POST') {
        handlePOST(req, res, data => {
          forward({
            reqOrg: req,
            resOrg: res,
            data,
          });
        });
        return;
      }

      if (method === 'GET') {
        handleGET(req, res);
        return;
      }
    })
    .on('error', err => {
      console.error(err.stack);
    });

  function handleGET(req, res) {
    res.end('codeMid get get get');
  }

  function handlePOST(req, res, callback) {
    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        // body: a=1&b=2
        body = Buffer.concat(body).toString();
        callback(body);
      });
  }

  function handleFavicon(req, res) {
    res.statusCode = 404;
    res.end();
  }
};
