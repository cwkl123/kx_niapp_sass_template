<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '礼包列表',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page">
    <z-paging ref="paGing" :default-page-size="6" refresher-enabled @query="onQuery">
      <template #top>
        <view class="top" :style="{ backgroundColor: themeColor }">
          <view class="logo flex" @click="goBack">
            <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
            <view class="text">{{ title }}</view>
          </view>
        </view>
      </template>
      <view class="column-box">
        <view
          v-for="(item, index) in packageData"
          :key="index"
          class="package-item"
          @click="goGiftDetail(item)"
        >
          <view class="flex center" style="height: 80rpx">
            <image
              src="/static/images/home/icon/blue1.png"
              style="height: 6rpx; width: 50rpx"
            ></image>
            <text class="package-text">华泾镇服务套餐</text>
            <image
              src="/static/images/home/icon/blue2.png"
              style="height: 6rpx; width: 50rpx"
            ></image>
          </view>
          <image :src="urlHost(item.icon)" class="package-image-left"></image>
          <view class="package-box">
            <view class="flex">
              <view class="fire-box">
                <image
                  src="/static/images/home/icon/fire.png"
                  style="width: 30rpx; height: 40rpx"
                ></image>
              </view>
              <view class="text-box">
                <view class="package-text1">{{ item.name }}</view>
                <view class="package-text2 flex">
                  <view class="text-grap">官方立减{{ item.originalPrice - item.price }}元</view>
                  <view v-if="item.sales < 400">已售{{ item.sales + n + item.id }}</view>
                  <view v-else>已售400+</view>
                </view>
              </view>
            </view>
            <view class="flex package-price-box">
              <view class="char-box big">
                <span style="font-size: 22rpx">￥</span>
                {{ item.price }}
              </view>
              <view class="char-box old">
                ￥
                {{ item.originalPrice }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { requestGiftsList } from '@/service/gifts/giftsApi'
let themeColor = inject('themeColor')
const paGing = ref(null)
const title = ref('套餐热销项目')
// 分页参数
const pageNum = ref(1)
const n = Number(import.meta.env.VITE_N)
const pageSize = 6
const finished = ref(false)

// 所有套餐数据
const packageData = ref([])

// 图片地址拼接
const urlHost = (url) => {
  const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
  return baseUploadUrl + url
}

// 点击返回
function goBack() {
  uni.navigateBack()
}

// 获取礼包数据
const onQuery = async (page) => {
  pageNum.value = page
  try {
    const res = await requestGiftsList({
      pageNum: page,
      pageSize: 6,
      tenantId: 'wx3ce16b0a073907cb',
    })
    let list = res?.value?.list || []
    // 转换价格字段（分 -> 元）
    list = list.map((item) => ({
      ...item,
      originalPrice: (item.originalPrice / 100).toFixed(2),
      price: (item.price / 100).toFixed(2),
    }))
    // 清空数据
    if (page === 1) {
      packageData.value = list
    } else {
      packageData.value = packageData.value.concat(list)
    }
    console.log('测试当前页', list)
    console.log('测试礼包数据', packageData.value)
    paGing.value.complete(list)
  } catch (e) {
    paGing.value.complete(false)
    console.error('分页请求失败:', e)
  }
}

// 跳转详情
const goGiftDetail = (item) => {
  uni.navigateTo({
    url: '/pages-sub/home/giftDetail?id=' + item.id,
  })
}
onLoad((query) => {
  console.log('路由参数', query)
  if (query.title) {
    title.value = query.title
  }
})
</script>

<style scoped>
.page {
  width: 100%;
}
.top {
  padding: 32rpx;
  padding-top: 100rpx;
  /*background-image: url('@/static/images/home/background/bg.png');
  background-size: cover;*/
}
.logo {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.back-icon {
  width: 12px;
  height: 16px;
  margin-bottom: 2px;
  margin-right: 8px;
}
.column-box {
  width: calc(100% - 64rpx);
  margin: 0 32rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
}

.package-item {
  display: flex;
  flex-direction: column;
  position: relative;
  width: calc(50% - 10rpx);
  background: linear-gradient(to right, #ccdef2 0%, #d1e8f1 100%);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
  margin-top: 20rpx;
}
.package-text {
  color: #318cf2;
  font-size: 24rpx;
  font-weight: 600;
  margin: 20rpx 10rpx;
}
.package-box {
  height: 150rpx;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  border-radius: 0 0 20rpx 20rpx;
}
.fire-box {
  width: 15%;
  height: 40rpx;
  display: flex;
  justify-content: center;
}
.package-image-right {
  width: 100%;
  height: 250rpx;
  display: block;
  border-radius: 20rpx 20rpx 0 0;
}
.text {
  color: #fff;
}
.text-box {
  width: 85%;
}
.package-text1 {
  display: block;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #595757;
  font-weight: 600;
  margin-bottom: 10rpx;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.package-text2 {
  font-size: 20rpx;
  color: #ff6132;
}
.package-price-box {
  flex: 1;
  padding-bottom: 10rpx;
  padding-left: 10rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}
.char-box {
  display: flex;
  align-items: flex-end;
  font-size: 24rpx;
  line-height: 1;
  color: #333;
  margin-left: 8rpx;
}
.char-box.big {
  font-size: 40rpx;
  color: #ff6132;
  font-weight: 600;
}

.char-box.old {
  text-decoration: line-through;
  font-size: 22rpx;
  color: #999;
}
.char-box.number {
  font-size: 22rpx;
  color: #999;
}
.text-grap {
  margin-right: 10rpx;
}
.package-image-left {
  width: 100%;
  height: 300rpx;
  display: block;
  border-radius: 20rpx 20rpx 0 0;
}
</style>
