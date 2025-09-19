<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '搜索页面',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page">
    <view class="top" :style="{ backgroundColor: themeColor }">
      <view class="logo flex" @click="goHome">
        <image src="/static/images/mine/back.png" class="back-icon" />
        <view class="text">轻工物业</view>
      </view>
    </view>
    <view class="search-box">
      <view class="search-content">
        <wd-icon color="#c4c4c4" name="search" size="15px"></wd-icon>
        <input
          v-model="searchText"
          placeholder="输入关键词搜索"
          :autofocus="isFocus"
          @focus="isFocus = true"
          @blur="getSearchData"
          class="search-input"
          type="text"
        />
        <button class="search-button" v-if="searchText" @click="clearText">×</button>
      </view>
      <view @click="goHome" class="clear">取消</view>
    </view>
    <view class="search-return">
      <view v-if="isShow" class="no-data-loading">
        <wd-icon color="#c4c4c4" name="refresh" size="22px"></wd-icon>
        <view class="no-data-text">正在加载中...</view>
      </view>
      <view v-else class="content-box">
        <view v-if="searchData.length > 0">
          <view v-for="(item, index) in searchData" :key="index">
            <view class="title">
              <view>
                <text>{{ item.cateName }}</text>
              </view>
            </view>

            <view class="service-shortcuts-view">
              <view
                class="shortcuts-item-view"
                @click="toServiceInfoPage(item.serviceId)"
                v-for="(item, index) in item.serviceItems"
                :key="index"
              >
                <image
                  class="shortcuts-item-image"
                  :src="urlHost(item.url)"
                  mode="aspectFit"
                ></image>
                <text class="shortcuts-item-title">{{ item.serviceTitle }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="no-data">
          <image class="no-data-img" :src="empty.icon" mode="widthFix"></image>
          <view class="no-data-text">{{ empty.title }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { search_service_item_list } from '@/service/serve/serveApi'
import { useUserStore } from '@/store'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { useLoginStore } from '@/store'

let themeColor = inject('themeColor')
const loginInfoStore = useLoginStore()
const userStore = useUserStore()
const empty = ref({
  icon: '/static/images/home/icon/service_empty.png',
  title: '暂无可提供服务项',
})
const searchText = ref('')
const isFocus = ref(false)
const searchData = ref([])
const isShow = ref(false)
// 导航到服务详情
const toServiceInfoPage = (serviceId) => {
  if (loginInfoStore.loginInfo.isLogin) {
    // 检查登录状态

    if (serviceId == 487) {
      uni.navigateToMiniProgram({
        appId: 'wx76c98516a2e8ef44',
        path: 'pages/home/home',
      })
    } else {
      uni.navigateTo({
        url: `/pages-sub/service/serviceInfo?data=${JSON.stringify({
          serveItemId: serviceId,
          orderId: '',
        })}`,
      })
    }
  } else {
    tabbarStore.setCurIdx(4)
    uni.switchTab({ url: '/pages/mine/index' })
  }
}
function clearText() {
  console.log('first')
  searchText.value = ''
  getSearchData()
}
const getSearchData = async () => {
  isFocus.value = false
  isShow.value = true
  if (!searchText.value || searchText.value.trim() === '') {
    searchData.value = []
    isShow.value = false
    return
  }
  const userInfo = userStore.userInfo.uId
  const params = {
    type: 1,
    search: searchText.value,
    uId: userInfo,
  }
  const res = await search_service_item_list(params)
  searchData.value = res.value
  isShow.value = false
}
// url拼接
const urlHost = (url) => {
  const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
  return baseUploadUrl + url
}
// 点击返回
function goHome() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    tabbarStore.setCurIdx(0)
    uni.switchTab({ url: '/pages/home/index' })
  }
}
function onCancel() {
  searchText.value = ''
}
onLoad((query) => {
  if (query.keyword) {
    searchText.value = query.keyword
    getSearchData()
  }
})
onMounted(() => {})
</script>

<style scoped>
.page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  padding: 32rpx;
  padding-top: 100rpx;
  /*background-image: url('@/static/images/home/background/bg.png');
  background-size: cover;*/
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.back-icon {
  width: 14px;
  height: 14px;
}
.text {
  color: #fff;
}
.search-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  padding: 10rpx;
}
.search-icon {
  margin-right: 10rpx;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 28rpx;
  margin-left: 20rpx;
}
.search-content {
  display: flex;
  flex-direction: row;
  width: 90%;
  background: #f8f8f8;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
  border-radius: 100px;
}
.search-return {
  flex: 1;
  position: relative;
  padding: 20rpx;
}
.no-data {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.no-data-loading {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.no-data-img {
  width: 300rpx;
}
.no-data-text {
  font-size: 28rpx;
  color: #c4c4c4;
}
.title {
  width: 100%;
  margin-top: 20px;
  margin-right: 10px;
  font-size: 15px;
  font-family:
    PingFangSC-Medium,
    PingFang SC;
  font-weight: 700;
  color: #2b2b2b;
  line-height: 17px;

  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.service-shortcuts-view {
  padding-top: 20rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
  display: flex;
  flex-flow: wrap;
  align-items: flex-start;
}
.shortcuts-item-view {
  margin-top: 20rpx;
  width: 33%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.shortcuts-item-image {
  border-radius: 10rpx;
  width: 94rpx;
  height: 94rpx;
}
.shortcuts-item-title {
  margin-top: 10rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #000000;
  line-height: 33rpx;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.wd-search-bar {
  width: 100%;
  padding: 0 24rpx;
  background-color: #f8f8f8;
  border-radius: 100rpx;
}
.clear {
  width: 10%;
  font-size: 28rpx;
  white-space: nowrap;
  padding: 0 10rpx;
  color: #2b2b2b;
}
.search-button {
  height: 18px;
  width: 18px;
  font-size: 15px;
  line-height: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #c0c4cc;
  border-radius: 100px;
  padding: 0%;
  margin-top: -1rpx;
}
.content-box {
  width: 90%;
  height: 90%;
}
</style>
