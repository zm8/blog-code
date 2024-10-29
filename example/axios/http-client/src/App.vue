<script setup lang="ts">
import { http } from "./service/httpClient";

// GET 请求测试
async function testGet() {
  const promise = http.get({
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
  console.log(res);
}

async function testPOST() {
  const res = await http.post({
    url: "/api/test",
    params: { name: "测试 post" },
  });
  console.log(res);
}

async function testUpload() {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  if (!fileInput?.files?.[0]) {
    throw new Error("请先选择文件");
  }
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  const res = await http.upload({
    url: "/api/upload",
    params: formData,
    onProgress: (percent) => {
      console.log("百分比:", percent);
    },
  });
  console.log(res);
}

async function testDownload() {
  await http.download({
    url: "/api/download/",
    params: { filename: "foo.txt" },
  });
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
