<script setup lang="ts">
import { http } from "./http";

type TestResponse = {
  message: string;
  query: {
    name: string;
  };
  time: string;
};

// GET 请求测试
async function testGet() {
  const promise = http.get<TestResponse>({
    url: "/api/test",
    params: {
      name: "测试 get",
    },
    showError: false,
  });
  // setTimeout(() => {
  //   promise.cancel();
  // }, 1000);
  console.log(promise.cancel);
  const res = await promise;
  console.log(res.message);
}

async function testPOST() {
  const res = await http.post<TestResponse>({
    url: "/api/test",
    params: { name: "测试 post" },
  });
  console.log(res.message);
}

async function testUpload() {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  if (!fileInput?.files?.[0]) {
    throw new Error("请先选择文件");
  }
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  const res = await http.upload<TestResponse>({
    url: "/api/upload",
    params: formData,
    onProgress: (percent) => {
      console.log("百分比:", percent);
    },
  });
  console.log(res.message);
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
