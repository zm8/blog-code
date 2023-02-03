const httpProxy = require('http-proxy');
const fs = require('fs');
const https = require('https');

const agent = new https.Agent();
agent.options.ca = fs.readFileSync('./cert/rootCA.pem', 'utf8');

const options = {
	key: fs.readFileSync('./cert/local.key', 'utf8'),
	cert: fs.readFileSync('./cert/local.crt', 'utf8'),
};

const proxy = new httpProxy.createProxyServer({
	target: 'https://localhost.meetsocial.cn:9991',
	cookiePathRewrite: {
		'/api/aa/bb/cc': '/',
	},
	cookieDomainRewrite: {
		'localhost.meetsocial.cn': 'david.cn',
	},
	changeOrigin: true,
	ssl: options,
	agent,
	secure: true,
});

proxy.on('error', function (err, req, res) {
	res.writeHead(500, {
		'Content-Type': 'text/plain',
	});
	res.end(err.toString());
});

https
	.createServer(options)
	.on('request', function (req, res) {
		const { url } = req;
		if (url.indexOf('/api/') > -1) {
			proxy.web(req, res);
		} else {
			res.end('proxy proxy get get');
		}
	})
	.listen(1111, () => {
		console.log('打开 https://david.cn:1111');
	});
