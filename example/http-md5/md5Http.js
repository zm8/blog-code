const http = require('http');
const httpProxy = require('http-proxy');
const md5 = require('md5');

const PORT = 5050;
const host = `http://localhost:${PORT}`;
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

module.exports = function (target) {
	const proxy = httpProxy.createServer({
		target,
		changeOrigin: true,
		secure: false,
	});

	console.log(`listening on port ${PORT}`);
	proxy.listen(PORT);
	// 开始执行
	setTimeout(() => start(), 1000);
};

const start = async () => {
	let version = await httpGetBuffer(`${host}/version.json`);
	version = bufferToJSON(version);
	let list = Object.entries(version);
	console.log('Total: ', list.length);
	// list = list.slice(0, 11);
	let total = list.length;
	let errMd5 = [];
	const MAX = 50;
	const time = Math.ceil(total / MAX);
	console.log('共循环几次:', time);
	let i = 0;
	while (i < time) {
		console.log('循环:', i + 1);
		const errList = await compareMd5(list.slice(i * MAX, (i + 1) * MAX));
		await delay(100);
		errMd5 = [...errMd5, ...errList];
		i++;
	}
	console.log('错误的 MD5 列表:', errMd5);
	console.log('done');
};

// buffer 转换成 md5
const bufferToJSON = (buffer) => JSON.parse(buffer.toString());

// 对比 md5
const compareMd5 = async (list) => {
	const err = [];
	const listP = list.map(async ([key, { md5: md5File }]) => {
		const md5Http = md5(await httpGetBuffer(`${host}/${key}`));
		if (md5Http !== md5File) {
			err.push(key);
		}
	});
	await Promise.all(listP);
	return err;
};

// http 获取 buffer
const httpGetBuffer = (url) => {
	return new Promise((resolve) => {
		http.get(url, (res) => {
			const data = [];
			res
				.on('data', (chunk) => {
					data.push(chunk);
				})
				.on('end', () => {
					resolve(Buffer.concat(data));
				});
		});
	});
};
