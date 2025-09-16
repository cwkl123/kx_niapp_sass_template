<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '付款详情',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page">
    <view
      class="top"
      :class="{
        'status-default': pay.payStatus === 0,
        'status-success': pay.payStatus === 1,
        'status-fail': pay.payStatus === 2,
      }"
    >
      <view class="logo flex" @click="goBack">
        <image src="/static/images/home/icon/go2.png" class="back-icon"></image>
        <view class="text">
          {{ pay.payStatus === 0 ? '付款详情' : pay.payStatus === 1 ? '支付成功' : '支付失败' }}
        </view>
      </view>
    </view>
    <view v-if="pay.payStatus === 0" class="card-box">
      <view class="content">
        <view class="card flex">
          <image :src="giftDetail.icon" class="img"></image>
          <view class="box">
            <view class="name-box">
              <view class="name">{{ giftDetail.giftName }}</view>
              <view class="price">￥{{ giftDetail.price }}</view>
            </view>
            <view class="coupon-list">
              <view
                v-for="(item, index) in giftDetail.couponList"
                :key="index"
                class="coupon-list-text"
              >
                礼包内容：{{ item.name }}*{{ item.count }}张
              </view>
              <view v-for="(item, index) in giftDetail.giveCouponList" :key="index">
                赠送服务：{{ item.name }}*{{ item.count }}张
              </view>
            </view>
            <view class="num-position">
              <view class="num-box">
                <view @click="delNum" style="color: #b1b1b1">-</view>
                |
                <view style="color: #000">{{ num }}</view>
                |
                <view @click="addNum" style="color: #4d4d4d">+</view>
              </view>
            </view>
          </view>
        </view>
        <view class="card flex" @click="toggleCheck">
          <view class="pay-box">
            <view class="flex">
              <image
                src="/static/images/home/icon/wx.png"
                mode="widthFix"
                style="width: 50rpx"
              ></image>
              <view class="pay-text">微信支付</view>
            </view>
            <image
              :src="
                isChecked
                  ? '/static/images/home/icon/check2.png'
                  : '/static/images/home/icon/check.png'
              "
              style="width: 40rpx; height: 40rpx"
            ></image>
          </view>
        </view>
      </view>
      <view class="foot">
        <view class="foot-box">
          <view class="buy-button" @click="createOrder">
            确认付款
            <span style="font-size: 24rpx">￥</span>
            <span style="font-size: 32rpx; font-weight: 500">{{ giftDetail.price }}</span>
          </view>
        </view>
      </view>
    </view>
    <view v-else-if="pay.payStatus === 1" class="v-pay">
      <view class="v-pay-success-box">
        <view class="v-success-icon">
          <image class="i-success-icon" :src="pay.payStyle.success" mode="aspectFit"></image>
        </view>
        <view class="v-success-title">
          <text class="t-success-title">支付成功</text>
          <text class="t-success-hint">本次交易支付完成</text>
        </view>
      </view>
      <!-- <view class="v-pay-success-detail-header"></view> -->
      <view class="v-pay-success-detail">
        <!-- <view class="v-pay-success-detail-title"></view> -->

        <view class="v-success-detail">
          <view class="v-success-detail-title">
            <text class="t-success-detail-title">交易金额</text>
            <text class="t-success-detail-title">¥{{ orderInfo.price }}</text>
          </view>
          <view class="v-success-detail-title">
            <text class="t-success-detail-title">订单编号</text>
            <text class="t-success-detail-title">{{ orderInfo.orderNo }}</text>
          </view>
          <view class="v-success-detail-title">
            <text class="t-success-detail-title">交易方式</text>
            <text class="t-success-detail-title">微信支付</text>
          </view>
          <view class="v-success-detail-title">
            <text class="t-success-detail-title">支付时间</text>
            <text class="t-success-detail-title">{{ orderInfo.payTime }}</text>
          </view>
        </view>
      </view>
      <view class="v-user-center-btn">
        <text class="t-user-center-btn" @click="userCenter">个人中心 {{ pay.currentTime }}s</text>
      </view>
    </view>
    <view v-else-if="pay.payStatus === 2" class="v-pay">
      <view class="v-pay-fail-box">
        <view class="v-fail-icon">
          <image class="i-fail-icon" :src="pay.payStyle.fail" mode="aspectFit"></image>
        </view>
        <view class="v-fail-title">
          <text class="t-fail-title">支付失败</text>
          <text class="t-fail-hint">请尝试重新支付</text>
        </view>
      </view>
      <view class="v-pay-btn">
        <text class="t-pay-btn" @click="repayment">重新支付</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getGiftDetails, createGiftsOrders, buyGifts, getGiftOrder } from '@/service/gifts/giftsApi'
import { tabbarStore } from '@/components/au-tabbar/tabbar'

const id = ref('')
const giftDetail = ref([])
const num = ref('1')

// 支付参数
const pay = ref({
  payStatus: 0, //0待支付,1支付成功,2支付失败
  payType: 1, //1.微信支付
  currentTime: 6,
  clearInterval: false,
  payStyle: {
    success: '/static/images/home/icon/paySuccess.png',
    fail: '/static/images/home/icon/payFail.png',
  },
})

// 订单数据
const orderInfo = ref()

// 是否选中
const isChecked = ref(false)

// 切换选中状态
// const toggleCheck = () => {
//   isChecked.value = !isChecked.value
// }
function addNum() {
  // num.value++
}
function delNum() {
  if (num.value > 1) {
    num.value--
  }
}

// 重新支付
function repayment() {
  pay.value.payStatus = 0
  createOrder()
}
// 创建订单
const createOrder = async () => {
  if (!isChecked.value) {
    const params = {
      giftId: id.value,
    }
    const res = await createGiftsOrders(params)
    console.log('创建订单', res)
    payOrder(res.value.orderId)
    // getOrder(res.value.orderId)
  }
}

// 支付订单
const payOrder = async (orderId) => {
  const params = {
    orderId: orderId,
  }
  const res = await buyGifts(params)
  console.log('支付测试', res)
  if (res.value) {
    const payData = res.value
    if (pay.value.payType == 1) {
      wx.requestPayment({
        timeStamp: payData.timeStamp,
        nonceStr: payData.nonceStr,
        package: payData.packageValue,
        signType: payData.signType,
        paySign: payData.paySign,
        success: function (res) {
          console.log('success:', res)
          getOrder(orderId)
        },
        fail: function (res) {
          console.log('fail:', res)
          pay.value.payStatus = 2
        },
        complete: function (res) {
          console.log('complete:', res)
        },
      })
    }
  }
}

// 查询订单
const getOrder = async (orderId) => {
  const params = {
    orderId: orderId,
  }
  const res = await getGiftOrder(params)
  res.value.price = (res.value.price / 100).toFixed(2)
  orderInfo.value = res.value
  console.log('测试查询', res)
  pay.value.payStatus = 1
  paySuccess()
}

function paySuccess() {
  setTimeout(function () {
    countdown()
  }, 100)
}

function countdown() {
  var interval = ''
  interval = setInterval(function () {
    if (pay.value.clearInterval) {
      clearInterval(interval)
      return
    }
    pay.value.currentTime--
    if (pay.value.currentTime <= 0) {
      clearInterval(interval)
      pay.value.currentTime = 6
      userCenter()
    }
  }, 1000)
}

function userCenter() {
  pay.value.clearInterval = true
  tabbarStore.setCurIdx(4)
  uni.switchTab({
    url: '/pages/mine/index',
  })
}

onLoad((options) => {
  id.value = options.id
  getDetailData()
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
    if (!img.startsWith('/')) {
      res.value.icon = '/static/images/home/card/photo1.png'
    } else {
      res.value.icon = urlHost(res.value.icon)
    }
  }
  // 转换价格字段
  res.value.originalPrice = (res.value.originalPrice / 100).toFixed(2)
  res.value.price = (res.value.price / 100).toFixed(2)
  giftDetail.value = res.value
  console.log('测试数据详情', giftDetail.value)
}

function goBack() {
  pay.value.clearInterval = true
  uni.navigateBack()
}
</script>

<style scoped>
.custom-checkbox {
  position: relative;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fake-checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ccc;
  border-radius: 6rpx;
  background-color: #fff;
}
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.card-box {
  flex: 1;
  position: relative;
  background: linear-gradient(to bottom, #c8e7fb 0%, #f4f4f4 20%);
}
.top {
  padding: 32rpx;
  padding-top: 100rpx;
}

.status-default {
  background: #c8e7fb;
}
.status-success {
  color: #fff;
  background: #2f72f6;
}
.status-fail {
  color: #fff;
  background: #fa6a6a;
}
.logo {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  font-size: 32rpx;
}
.back-icon {
  width: 12px;
  height: 16px;
  margin-bottom: 2px;
  margin-right: 8px;
}
.content {
  width: 100%-64rpx;
  margin: 0 32rpx;
  padding-top: 30rpx;
}
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}
.box {
  flex: 1;
  margin-left: 20rpx;
}
.img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 20rpx;
}
.name-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.pay-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.pay-text {
  margin-left: 10rpx;
}
.coupon-list {
  color: #595959;
  margin-top: 15rpx;
  font-size: 24rpx;
}
.coupon-list-text {
  margin-bottom: 5rpx;
}
.num-position {
  display: flex;
  flex-direction: row-reverse;
}
.num-box {
  width: 25%;
  background: #f4f4f4;
  padding: 3rpx 15rpx;
  border-radius: 10rpx;
  color: #d9d9d9;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  height: 100%;
  margin: 0 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.buy-button {
  color: #fff;
  background: linear-gradient(to left, #3f96f6, #75c6ff);
  width: 90%;
  height: 70%;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}

/* 支付成功样式 */
.v-pay {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.v-pay-success-box {
  width: 100%;
  height: 300rpx;
  background-color: #2f72f6;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  justify-items: center;
}
.v-success-icon {
  width: 128rpx;
  height: 128rpx;
}

.i-success-icon {
  width: 100%;
  height: 100%;
}

.v-success-title {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 44rpx;
}

.t-success-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 56rpx;
}

.t-success-hint {
  font-size: 28rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
}

.v-pay-success-detail-header {
  margin-top: -64rpx;
  margin-left: 36rpx;
  margin-right: 36rpx;
  height: 24rpx;
  background: #000000;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  opacity: 0.2;
}

.v-pay-success-detail-title {
  margin-top: -12rpx;
  height: 44rpx;
  background: linear-gradient(180deg, #98bbff 0%, #ffffff 100%);
  box-shadow: 0rpx 0rpx 20rpx 0rpx #f1f1f3;
  opacity: 1;
}
.v-success-detail {
  padding-left: 26rpx;
  padding-right: 26rpx;
}

.v-success-detail-title {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  justify-items: center;
}

.t-success-detail-title {
  font-size: 28rpx;
  font-weight: 400;
  color: #999999;
  line-height: 92rpx;
}

.v-user-center-btn {
  margin-top: 200rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-user-center-btn {
  width: 450rpx;
  height: 80rpx;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  box-shadow: 0rpx 6rpx 18rpx -4rpx rgba(55, 120, 248, 0.48);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 38rpx;
}
.v-pay-fail-box {
  width: 100%;
  height: 300rpx;
  background-color: #fa6a6a;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  justify-items: center;
}
.v-fail-title {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 44rpx;
}

.t-fail-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 56rpx;
}

.t-fail-hint {
  font-size: 28rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
}
.v-pay-btn {
  margin-top: 200rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.t-pay-btn {
  width: 450rpx;
  height: 80rpx;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  box-shadow: 0rpx 6rpx 18rpx -4rpx rgba(55, 120, 248, 0.48);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 38rpx;
}
.v-fail-icon {
  width: 128rpx;
  height: 128rpx;
}

.i-fail-icon {
  width: 100%;
  height: 100%;
}
</style>
