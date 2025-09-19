<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '礼包详情',
    enableShareAppMessage: true, // 允许转发
    enableShareTimeline: true,
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page">
    <view class="top" :style="{ backgroundColor: themeColor }">
      <view class="top-bg" :style="{ backgroundColor: themeColor }"></view>
      <view class="logo flex" @click="goBack">
        <view class="flex center">
          <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
          <span style="color: white; font-size: 18px">{{ programName }}</span>
        </view>
        <view>
          <image src="/static/images/home.icon.zf.png" mode="widthFix" style="width: 20rpx"></image>
        </view>
      </view>
    </view>
    <scroll-view :scroll-y="true" style="height: calc(100vh - 296rpx)" class="scroll-box">
      <view
        class="content"
        :style="`background: linear-gradient(to bottom, ${themeColor} 0%, #2f72f600 300rpx)`"
      >
        <view class="content-box">
          <view class="content-top">
            <image :src="imgUrl" mode="widthFix" class="content-img"></image>
            <view
              class="content-price"
              :style="{
                background: `linear-gradient(${getLightenedColor(themeColor, 0.3)}, ${themeColor})`,
              }"
            >
              <view class="content-price-num">
                <view style="margin-bottom: 10rpx">
                  ￥
                  <span style="font-weight: 600; font-size: 60rpx">{{ giftDetail.price }}</span>
                  元
                </view>
                <view>
                  已售{{ sales }}
                  <span v-if="sales > 400">+</span>
                  <span style="margin: 0 14rpx">|</span>
                  <span style="color: #dcedfd">
                    原价
                    <span style="text-decoration: line-through">
                      ￥{{ giftDetail.originalPrice }}
                    </span>
                  </span>
                </view>
              </view>
              <image src="/static/images/home/logo/topLogo.png" class="logoImg"></image>
            </view>
            <view class="content-text">
              <view class="text-box1">
                <view class="data-name">{{ giftDetail.giftName }}</view>
                <view class="service-tags">
                  <view class="red-tag">
                    <view class="tag-hole"></view>
                    <text class="tag-text">赠送服务</text>
                  </view>
                  <view class="tag top-sales">销量TOP1</view>
                  <view class="tag service-time">好评400+</view>
                  <view class="tag service-time">3950人正在抢购</view>
                </view>
              </view>
              <view class="coupon-box">
                <view class="coupon-list">
                  <swiper
                    class="indexGift-swiper"
                    autoplay="true"
                    circular="true"
                    vertical="true"
                    interval="2500"
                  >
                    <swiper-item v-for="(item, index) in giftDetail.couponList" :key="index">
                      <view>礼包内容：{{ item.name }}*{{ item.count }}张</view>
                    </swiper-item>
                  </swiper>
                  <swiper
                    class="indexGift-swiper"
                    autoplay="true"
                    circular="true"
                    vertical="true"
                    interval="2500"
                  >
                    <swiper-item
                      v-for="(item, index) in giftDetail.giveCouponList"
                      :key="index"
                      class="coupon-list-text"
                    >
                      <view>赠送服务：{{ item.name }}*{{ item.count }}张</view>
                    </swiper-item>
                  </swiper>
                </view>
                <view class="coupon-list">
                  <view class="talk-top">
                    <view class="talk-top-left">
                      <image
                        src="/static/images/home/icon/talk.png"
                        style="width: 40rpx; height: 40rpx; margin-right: 20rpx"
                      ></image>
                      <view>评价（{{ appraiseNum }}）</view>
                    </view>
                  </view>
                  <view class="talk-tag">
                    <view v-for="(tag, index) in commentTags" :key="index" class="talk-tag-item">
                      {{ tag.name }} {{ tag.count }}
                    </view>
                  </view>
                  <view v-for="(item, index) in visibleComments" :key="index" class="flex talk-box">
                    <view class="talk-text-box">
                      <view>
                        <image src="/static/images/service/avator.jpg" class="talk-head"></image>
                        {{ formatName(item.name) }}
                      </view>
                      <view class="talk-text">{{ item.content }}</view>
                    </view>
                  </view>
                </view>
                <view class="coupon-list">
                  <view class="talk-top">
                    <view class="talk-top-left">
                      <image
                        src="/static/images/home/icon/book.png"
                        style="width: 40rpx; height: 40rpx; margin-right: 20rpx"
                      ></image>
                      <view>购买须知</view>
                    </view>
                  </view>
                  <view class="book-date" v-if="giftDetail.effectiveTime">
                    礼包有效期：{{ giftDetail.effectiveTime }}个月
                  </view>
                  <view class="book-date" v-if="giftDetail.effectiveTo">
                    礼包有效期至：{{ formatDate(giftDetail.effectiveTo) }}
                  </view>
                </view>

                <view class="service-card">
                  <view v-html="giftDetail.description"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="foot">
      <view class="foot-box">
        <image src="/static/tabbar/logo.png" class="logo-img"></image>
        <view @click="showModel" class="buy-button">立即购买</view>
      </view>
    </view>
    <!-- 弹窗 -->
    <view class="agreement-modal" v-if="showAgreement">
      <view class="modal-mask" @click="showAgreement = false"></view>
      <view class="modal-content">
        <view class="text-box">
          <view class="modal-title">知情书</view>
          <view class="modal-text">
            1.礼包自支付后开始生效，有效期请看礼包详情
            <br />
            2.因礼包低于市场价格，非特殊情况不可申请退款
            <br />
            3.点击同意后进入付款页面，付款后礼包即可生效
          </view>
        </view>
        <view class="button-box">
          <button class="button1" @click="closeAgree">不同意</button>
          <button class="button2" @click="goBuy">同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getGiftDetails, getCommentCount, addBuyView } from '@/service/gifts/giftsApi'
import { formatDate } from '@/service/cfgUrl'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { generateComments, formatName, startAutoScroll } from '@/service/commentUtils'
import { useLoginStore } from '@/store'

let programName = inject('programName')
let themeColor = inject('themeColor')
// 页面分享给好友
onShareAppMessage(() => {
  return {
    title: giftDetail.giftName,
    path: `/pages-sub/home/giftDetail?id=${id.value}`,
    imageUrl: imgUrl.value,
  }
})
const loginInfoStore = useLoginStore()
const imgUrl = ref()
// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: giftDetail.giftName,
    imageUrl: giftDetail.icon,
  }
})
const n = Number(import.meta.env.VITE_N)
const showAgreement = ref(false)
const id = ref('')
const giftDetail = ref([])
const currentCommentIndex = ref(0)
const visibleCommentCount = 2
const comments = ref([])

const appraiseNum = ref()
const commentTags = ref([])
const sales = ref()
const visibleComments = computed(() => {
  const start = currentCommentIndex.value
  const end = Math.min(start + visibleCommentCount, comments.value.length)
  return comments.value.slice(start, end)
})
let stopScroll = startAutoScroll(comments.value, visibleCommentCount, (index) => {
  currentCommentIndex.value = index
})
onUnmounted(() => {
  if (stopScroll) stopScroll()
})
// 评价总数
const getAppraiseNum = async () => {
  // const params = {
  //   id: id.value,
  // }
  // const res = await getCommentCount(params)
  const res = giftDetail.value.sales
  sales.value = n + res + Number(id.value)
  console.log('已经售出', res, id.value)
  appraiseNum.value = n + res
  commentTags.value = [
    { name: '回头客', count: Math.floor(appraiseNum.value * 0.3 * 0.8) },
    { name: '服务很好', count: Math.floor(appraiseNum.value * 0.4 * 0.8) },
    { name: '性价比高', count: Math.floor(appraiseNum.value * 0.3 * 0.8) },
  ]
  comments.value = generateComments(10)
  if (stopScroll) stopScroll()
  stopScroll = startAutoScroll({
    currentIndex: currentCommentIndex,
    commentCount: comments.value.length,
    visibleCount: visibleCommentCount,
  })
}

onLoad(async (options) => {
  id.value = options.id
  await getDetailData()
  getAppraiseNum()
  getBuyView()
})

// url拼接
const urlHost = (url) => {
  const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
  return baseUploadUrl + url
}

// 数据获取
const getDetailData = async () => {
  const params = {
    id: id.value,
  }
  const res = await getGiftDetails(params)

  // 图片可用
  if (res.value && res.value.icon) {
    const img = res.value.icon
    imgUrl.value = res.value.icon
    if (!imgUrl.value.startsWith('/')) {
      imgUrl.value = '/static/images/home/card/photo1.png'
    } else {
      imgUrl.value = urlHost(imgUrl.value)
    }
  }
  // 转换价格字段
  res.value.originalPrice = (res.value.originalPrice / 100).toFixed(2)
  res.value.price = (res.value.price / 100).toFixed(2)
  giftDetail.value = res.value
  console.log('测试详细数据', giftDetail.value)
}

// 获取知情书
const getBuyView = async () => {
  const params = {
    id: id.value,
  }
  const res = await addBuyView(params)
  console.log('测试数据文本', res)
}
function getLightenedColor(themeColor, percentage) {
  // 将主题色转换为RGB对象
  const color = hexToRgb(themeColor)
  // 计算偏白色
  const lightColor = {
    r: Math.min(255, Math.floor(color.r + (255 - color.r) * percentage)),
    g: Math.min(255, Math.floor(color.g + (255 - color.g) * percentage)),
    b: Math.min(255, Math.floor(color.b + (255 - color.b) * percentage)),
  }
  // 将RGB对象转换回十六进制字符串
  return rgbToHex(lightColor)
}

function hexToRgb(hex) {
  // 解析十六进制颜色字符串
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHex(rgb) {
  // 将RGB对象转换为十六进制颜色字符串
  return (
    '#' +
    rgb.r.toString(16).padStart(2, '0') +
    rgb.g.toString(16).padStart(2, '0') +
    rgb.b.toString(16).padStart(2, '0')
  )
}

function showModel() {
  if (loginInfoStore.loginInfo.isLogin) {
    showAgreement.value = true
  } else {
    tabbarStore.setCurIdx(4)
    uni.switchTab({ url: '/pages/mine/index' })
  }
}

function closeAgree() {
  showAgreement.value = false
}
function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    tabbarStore.setCurIdx(0)
    uni.switchTab({ url: '/pages/home/index' })
  }
}
// 付款详情跳转
function goBuy() {
  showAgreement.value = false
  uni.navigateTo({
    url: '/pages-sub/home/payment?id=' + id.value,
  })
}
</script>

<style scoped>
.logo-img {
  margin-top: -100rpx;
  height: 180rpx;
  width: 180rpx;
  z-index: 1000;
}
.page {
  position: relative;
  height: 100vh;
}
.foot {
  position: absolute;
  bottom: 0%;
  background: #fff;
  width: 100%;
  height: 100rpx;
}
.foot-box {
  width: 100% - 64px;
  margin: 0 32rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.buy-button {
  color: #fff;
  background: linear-gradient(to left, #3f96f6, #75c6ff);
  width: 70%;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
}
.top {
  padding: 32rpx;
  padding-top: 100rpx;
  padding-bottom: 20rpx;
  position: relative;
}
.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.logo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
  position: relative;
}
.back-icon {
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.content {
  flex: 1;
}
.content-box {
  width: 100% - 64px;
  margin: 32rpx;
  margin-top: 0%;
}
.content-top {
  width: 100%;
  border-radius: 20rpx;
  overflow: hidden;
}
.content-img {
  width: 100%;
  display: block;
}
.content-price {
  padding: 20rpx;
  padding-bottom: 50rpx;
  width: 100%-40rpx;
  border-radius: 20rpx 20rpx 0 0;
  margin-top: -70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.content-price-num {
  color: #fff;
  font-size: 24rpx;
  height: 100rpx;
}
.logoImg {
  height: 120rpx;
  width: 120rpx;
}
.content-text {
  width: 100%;
  background: linear-gradient(to bottom, #fff, #f2f2f2);
  margin-top: -20rpx;
  border-radius: 20rpx;
}
.text-box1 {
  padding: 20rpx 32rpx;
  padding-bottom: 0%;
}
.data-name {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.coupon-box {
  padding: 15rpx;
  padding-top: 0%;
}
.coupon-list {
  background: #fff;
  border-radius: 20rpx;
  border: 1px solid #f4f4f4;
  color: #595959;
  padding: 30rpx;
  margin-bottom: 20rpx;
  font-size: 24rpx;
}
.coupon-list-text {
  margin-bottom: 20rpx;
}

.talk-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-weight: 500;
  font-size: 28rpx;
}
.talk-top-left {
  display: flex;
  align-items: center;
}
.talk-tag {
  display: flex;
  margin-top: 20rpx;
}
.talk-tag-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
  background: #daebfd;
  color: #2564d6;
  border-radius: 10rpx;
  font-size: 24rpx;
  padding: 5rpx 20rpx;
}
.talk-box {
  font-size: 24rpx;
  margin-top: 20rpx;
}
.talk-text-box {
  width: 100%;
}
.talk-text {
  padding: 10rpx 10rpx 10rpx 20rpx;
}
.talk-head {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
}
.talk-photo {
  width: 110rpx;
  height: 100%;
  border-radius: 15rpx;
}
.book-date {
  margin-left: 60rpx;
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #595757;
}
.book-text {
  color: #000;
  font-weight: 500;
  font-size: 32rpx;
}
.service-card {
  background: #e4ecf3;
  border-radius: 20rpx;
  padding: 20rpx;
}
.service-head {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  color: #447fcf;
  padding-top: 32rpx;
}
.service-tag {
  border: 1px solid #447fcf;
  border-radius: 100px;
  font-size: 24rpx;
  padding: 5rpx 10rpx;
  margin: 0 10rpx;
  font-weight: 400;
}
.service-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #eff4fa, #cfe7f3);
  border-radius: 20rpx;
  border: 1px solid #fff;
  margin: 0 20rpx;
  width: 140rpx;
  color: #717171;
  font-size: 24rpx;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}
.img-box {
  height: 100rpx;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}
/* 弹窗 */
.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640rpx;
  background: #ffffff;
  border-radius: 24rpx;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #2a2b2c;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}
.modal-text {
  text-align: left;
  font-size: 14px;
  color: #2a2b2c;
  line-height: 48rpx;
}
.button-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.button1 {
  width: 50%;
  border: 1px solid #e1e1e1;
  color: #979797;
  background: transparent;
  margin: 0;
  border-radius: 0;
  font-size: 16px;
}
.button2 {
  width: 50%;
  margin: 0;
  border-radius: 0;
  border: 1px solid #e1e1e1;
  color: #52a7f9;
  background: transparent;
  font-size: 16px;
}
.text-box {
  padding: 20px;
}
.service-tags {
  display: flex;
  flex-wrap: nowrap; /* 保证一行展示 */
  align-items: center;
  gap: 12rpx; /* 统一间距 */
  margin-bottom: 20rpx;
}
.red-tag {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(#e5524e, #e86f6a);
  color: white;
  border-radius: 0 8rpx 8rpx 0;
  padding: 0 14rpx 0 25rpx; /* 右边固定padding，左边为文本留出空间 */
  height: 40rpx;
  clip-path: polygon(20rpx 0%, 100% 0%, 100% 100%, 20rpx 100%, 0% 50%);
  flex-shrink: 0;
}
.tag-hole {
  position: absolute;
  left: 8rpx;
  width: 12rpx;
  height: 12rpx;
  background: white;
  border-radius: 50%;
}

.tag-text {
  font-size: 23rpx;
  line-height: 40rpx;
  white-space: nowrap;
}
.tag {
  font-size: 23rpx;
  padding: 0 14rpx;
  height: 40rpx;
  line-height: 40rpx;
  border-radius: 6rpx;
  background: #f3f4f4;
  color: #c59c63;
  flex-shrink: 0;
}
.indexGift-swiper {
  font-weight: 500;
  color: #595959;
  font-size: 24rpx;
  width: 600rpx;
  height: 40rpx;
}
</style>
