const http = require("http");

const port = 3000;

const server = http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", req.headers.origin); // 允许跨域
	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.end();
		return;
	}
	if (req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				const { content } = JSON.parse(body);

				// 设置响应头
				res.writeHead(200, {
					"Content-Type": "text/plain; charset=utf-8",
					"Transfer-Encoding": "chunked",
					"Access-Control-Allow-Origin": "*",
				});

				// 将内容分割成小块
				const chunks = content.split("");

				// 使用 setInterval 模拟流式传输
				let index = 0;
				const intervalId = setInterval(() => {
					if (index < chunks.length) {
						res.write(chunks[index]);
						index++;
					} else {
						clearInterval(intervalId);
						res.end();
					}
				}, 10); // 每10毫秒发送一个字符
			} catch (error) {
				res.writeHead(400, { "Content-Type": "text/plain" });
				res.end("Invalid JSON");
			}
		});
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not Found");
	}
});

server.listen(port, () => {
	console.log(`服务器运行在 http://localhost:${port}/`);
});
