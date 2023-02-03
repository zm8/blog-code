module.exports = function (server) {
	return server
		.on('request', (req, res) => {
			const { method, url, headers } = req;
			const { origin, cookie } = headers;

			console.log('method: ', method);
			console.log('url: ', url);
			console.log('headers: ', headers);
			console.log('');
			const myUrl = getUrl(req);

			// 屏蔽请求 favicon.ico
			if (url === '/favicon.ico') {
				handleFavicon(req, res);
				return;
			}

			// 返回预检头
			if (method === 'OPTIONS') {
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
				origin && res.setHeader('Access-Control-Allow-Origin', origin);
				res.end();
				return;
			}

			if (method === 'POST') {
				// const cookieObj = getCookie(cookie);
				// console.log(cookieObj);

				// myUrl.hostname 为 localhost.meetsocial.cn, host 去掉端口号
				res.setHeader('Set-Cookie', [
					`a=1; domain=${myUrl.hostname}; path=${url}`,
					`b=2; domain=${myUrl.hostname}; path=${url}`,
				]);

				res.setHeader('Access-Control-Allow-Credentials', 'true');
				origin && res.setHeader('Access-Control-Allow-Origin', origin);
				handlePOST(req, res);
				return;
			}

			if (method === 'GET') {
				handleGET(req, res);
				return;
			}
		})
		.on('error', (err) => {
			console.error(err.stack);
		});

	function handleGET(req, res) {
		res.end('get get get');
	}

	function handlePOST(req, res) {
		let body = [];
		req
			.on('data', (chunk) => {
				body.push(chunk);
			})
			.on('end', () => {
				// body: a=1&b=2
				body = Buffer.concat(body).toString();
				res.end(body);
			});
	}

	function handleFavicon(req, res) {
		res.statusCode = 404;
		res.end();
	}
};

// getCookie, 返回 {a: 1, b: 2}
function getCookie(cookie) {
	let obj = {};
	cookie &&
		cookie.split(';').forEach((item) => {
			let arr = item.split('=');
			obj[arr[0].trim()] = arr[1].trim();
		});
	return obj;
}

/*
  new URL("https://localhost.meetsocial.cn:9991/a/b")
  URL {
    href: 'https://localhost.meetsocial.cn:9991/a/b',
    origin: 'https://localhost.meetsocial.cn:9991',
    protocol: 'https:',
    username: '',
    password: '',
    host: 'localhost.meetsocial.cn:9991',
    hostname: 'localhost.meetsocial.cn',
    port: '9991',
    pathname: '/a/b',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  }
*/
function getUrl(req) {
	const { url, headers } = req;
	// host 当前自己起的主机名, origin 是请求的主机名
	const { host } = headers;
	let protocol = req.connection.encrypted ? 'https:' : 'http:';
	let href = protocol + '//' + host + url;
	console.log(href);
	return new URL(href);
}
