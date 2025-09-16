<!--
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-09-08 15:04:27
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-11 11:11:10
 * @FilePath: \kx_niapp_sass\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { usePageAuth } from '@/hooks/usePageAuth'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { useConfigStore } from '@/store'
const configStore = useConfigStore()

const themeColor = ref()
provide('themeColor', themeColor)

usePageAuth()

onLaunch(async () => {
  console.log('App Launch')
  configStore.fetchConfig()
})
onShow(async () => {
  tabbarStore.setCurIdx(0)
  uni.setStorageSync('app-tabbar-index', 0)
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
watch(
  () => configStore.themeColor,
  (newColor) => {
    themeColor.value = newColor
    uni.setStorageSync('themeColor', newColor)
  },
  { immediate: true }, // 立即执行一次，以应用默认值
)
</script>

<style lang="scss">
page {
  --theme-color: #0652d5;
}
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

// 滚动条隐藏
::-webkit-scrollbar {
  display: none;
  width: 0 !important ;
  height: 0 !important ;
  -webkit-appearance: none;
  background: transparent;
}
</style>
