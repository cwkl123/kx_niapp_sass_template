<!--
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-16 14:27:13
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-16 14:28:36
 * @FilePath: \huijiashenghuo_niapp\src\pages-sub\home\web.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <view v-if="wxurl">
    <web-view :src="url" :update-title="false"></web-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const wxurl = ref(false)
const url = ref('')

onLoad((d) => {
  console.log('onLoad d=', d)
  url.value = decodeURIComponent(d.url)
  wxurl.value = true
  console.log('onLoad url=', url.value)
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
