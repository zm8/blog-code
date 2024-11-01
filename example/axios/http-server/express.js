const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // 需要先安装 cors

const app = express();
const port = 3000;

// 配置 CORS
app.use(
	cors({
		origin: "*", // 允许所有来源访问，仅在开发环境使用
		methods: ["GET", "POST"], // 允许的 HTTP 方法
		allowedHeaders: ["Content-Type"], // 允许的请求头
		exposedHeaders: ["Content-Disposition"], // 允许访问这个返回头
	})
);

// 中间件设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadDir = "uploads/";
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		// 保留原始文件名，但添加时间戳防止重名
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
	},
});

const delay = (num) => new Promise((r) => setTimeout(r, num));

// GET 请求示例
app.get("/api/test", async (req, res) => {
	// await delay(3000);
	console.log("收到 GET 请求:", req.query);
	res.json({
		returnCode: "00000",
		data: [
			{
				message: "这是一个GET请求响应",
				query: req.query,
				time: new Date().toISOString(),
			},
		],
		msg: "成功",
	});
});

// POST 请求示例
app.post("/api/test", (req, res) => {
	console.log("收到 POST 请求:", req.body);
	res.json({
		returnCode: "00000",
		data: [
			{
				message: "这是一个POST请求响应",
				body: req.body,
				time: new Date().toISOString(),
			},
		],
		msg: "成功",
	});
});

// 文件上传处理
app.post("/api/upload", upload.single("file"), (req, res) => {
	console.log("收到文件上传请求");
	if (!req.file) {
		return res.status(400).json({
			error: "没有文件被上传",
		});
	}
	res.json({
		returnCode: "00000",
		data: [
			{
				message: "文件上传成功",
				fileInfo: {
					filename: req.file.filename,
					originalName: req.file.originalname,
					size: req.file.size,
					mimetype: req.file.mimetype,
				},
			},
		],
		msg: "成功",
	});
});

// 文件下载示例
app.get("/api/download/", async (req, res) => {
	const filename = req.query.filename;
	const filePath = path.join(__dirname, "downloads", filename);
	console.log("尝试下载文件:", filename);
	// 检查文件是否存在
	if (!fs.existsSync(filePath)) {
		console.log("文件不存在:", filePath);
		return res.status(404).json({
			error: "文件不存在",
		});
	}
	res.download(filePath, filename, (err) => {
		if (err) {
			console.error("下载文件时发生错误:", err);
			res.status(500).json({
				error: "下载文件时发生错误",
			});
		}
	});
});

// 显示所有上传的文件列表
app.get("/api/files", (req, res) => {
	const uploadDir = "uploads/";
	if (!fs.existsSync(uploadDir)) {
		return res.json([]);
	}
	const files = fs.readdirSync(uploadDir);
	res.json({ code: 200, files });
});

// 错误处理中间件
app.use((err, req, res, next) => {
	console.error("发生错误:", err);
	res.status(500).json({
		error: "服务器内部错误",
		message: err.message,
	});
});

// 启动服务器
app.listen(port, () => {
	console.log(`服务器运行在 http://localhost:${port}`);
	console.log("支持的接口:");
	console.log("- GET  /api/test");
	console.log("- POST /api/test");
	console.log("- POST /api/upload");
	console.log("- GET  /api/download/");
	console.log("- GET  /api/files");
});
