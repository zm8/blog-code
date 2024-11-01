<script setup lang="ts">
import { http } from "./http-service";

type ResponseGet = {
  message: string;
  query: {
    name: string;
  };
  time: string;
};

type ResponsePost = {
  message: string;
  body: {
    name: string;
  };
  time: string;
};

type ResponseUpload = {
  message: string;
  fileInfo: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
  };
  time: string;
};

// GET 请求测试
async function testGet() {
  const promise = http.get<ResponseGet>({
    url: "/api/test",
    params: {
      name: "测试 get",
    },
    showError: false,
  });
  // setTimeout(() => {
  //   promise.cancel();
  // }, 1000);
  const res = await promise;
  console.log(res, res.query);
}

async function testPOST() {
  const res = await http.post<ResponsePost>({
    url: "/api/test",
    params: { name: "测试 post" },
  });
  console.log(res, res.body);
}

async function testUpload() {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  if (!fileInput?.files?.[0]) {
    throw new Error("请先选择文件");
  }
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  const res = await http.upload<ResponseUpload>({
    url: "/api/upload",
    params: formData,
    onProgress: (percent) => {
      console.log("百分比:", percent);
    },
  });
  console.log(res, res.fileInfo);
}

async function testDownload() {
  const promise = http.download({
    url: "/api/download/",
    params: { filename: "foo.txt" },
  });
  const res = await promise;
  console.log(res);
}
</script>

<template>
  <div>
    <button @click="testGet">GET 请求</button>
  </div>
  <div class="mt-6">
    <button @click="testPOST">POST 请求</button>
  </div>
  <div class="mt-6">
    <input type="file" id="fileInput" />
    <button @click="testUpload">Upload 请求</button>
  </div>
  <div class="mt-6">
    <button @click="testDownload">Download 请求</button>
  </div>
</template>
