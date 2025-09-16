<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '项目分类列表',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page">
    <view class="bg"></view>
    <z-paging
      ref="paGing"
      v-model="category"
      :default-page-size="16"
      refresher-enabled
      @query="onQuery"
    >
      <template #top>
        <view class="top">
          <view class="logo flex" @click="goBack">
            <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
            <view class="text">项目分类列表</view>
          </view>
        </view>
      </template>
      <view class="category-box-view">
        <view class="category-item-view" v-for="(item, index) in category" :key="index">
          <view class="category-item-box-view" @click="toCategory(item.extraData)">
            <image class="category-item-image" :src="urlHost(item.url)"></image>
            <view class="category-item-text-box">
              <text class="category-item-title">
                {{ getExtraData(item.extraData).categoryName }}
              </text>
              <text class="category-item-price">
                {{ formatAmount(getExtraData(item.extraData).price) }}元起
              </text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { requestAdvertList } from '@/service/base/homeApi'
import { formatAmount } from '@/service/cfgUrl'
import { tabbarStore } from '@/components/au-tabbar/tabbar'

const paGing = ref(null)

// 分页参数
const pageNum = ref(1)
const pageSize = 16
const finished = ref(false)
// 点击返回
function goBack() {
  uni.navigateBack()
}

const getExtraData = (json) => {
  return JSON.parse(json)
}

const category = ref([])

const onQuery = async (page, limit) => {
  let requestParam = {
    classType: 2,
  }
  requestParam.pageNum = page
  requestParam.pageSize = limit
  pageNum.value = page
  try {
    const res = await requestAdvertList(requestParam)
    let list = res?.value?.list || []
    list.forEach((item) => {
      const extra = JSON.parse(item.extraData)
      if (extra.price !== undefined) {
        extra.price = (extra.price / 100).toFixed(2)
        item.extraData = JSON.stringify(extra)
      }
    })
    // 清空数据
    if (page === 1) {
      category.value = list
    } else {
      category.value = category.value.concat(list)
    }
    console.log('测试礼包数据', category.value)
    paGing.value.complete(list)
  } catch (e) {
    paGing.value.complete(false)
    console.error('分页请求失败:', e)
  }
}

// 图片地址拼接
const urlHost = (url) => {
  const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
  return baseUploadUrl + url
}

const toCategory = (extra, key) => {
  let cateId = null
  if (extra) {
    cateId = JSON.parse(extra).cateId
  }
  if (key) {
    cateId = key
  }
  uni.setStorageSync('cateID_key', cateId)
  tabbarStore.setCurIdx(1)
  uni.switchTab({
    url: '/pages/service/index',
  })
}
</script>

<style scoped>
/* 设置整个页面背景 */
.page {
  background-color: #f2f2f2;
  position: relative;
}

.bg {
  position: absolute;
  top: 0%;
  left: 0%;
  height: 100vh;
  width: 100vw;
  background: #f2f2f2;
}
.top {
  padding: 32rpx;
  padding-top: 100rpx;
  background: #3073f6;
}
.logo {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #3073f6;
}
.back-icon {
  width: 12px;
  height: 16px;
  margin-bottom: 2px;
  margin-right: 8px;
  background: #3073f6;
}
.text {
  color: #fff;
  background: #3073f6;
}

/* .pages{
    height: 100vh;
    background: #f2f2f2;
    padding: 20rpx;
} */

.category-box-view {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
}

.category-item-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 49%;
  height: 120rpx;
  margin-top: 18rpx;
}

.category-item-box-view {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.category-item-image {
  width: 100rpx;
  height: 100rpx;
  margin: 0 20rpx;
  flex-shrink: 0;
}

.category-item-text-box {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.category-item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #23183d;
  line-height: 33rpx;
  margin-bottom: 15rpx;
  -webkit-background-clip: text;

  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.category-item-price {
  margin-top: 4rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #717171;
  line-height: 23rpx;
  background: #fff;
}
</style>
