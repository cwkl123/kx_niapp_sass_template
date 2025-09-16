<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '上门费支付',
  },
}
</route>
<template>
  <view class="ez-page">
    <view v-if="payStatus == 0">
      <!-- 顶部导航栏 -->
      <view class="nav-bar">
        <view @click="goBack()">
          <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
          <text class="nav-title">付款详情</text>
        </view>
      </view>

      <!-- 金额区域 -->
      <view class="amount-section">
        <view class="payment-label">上门服务费</view>
        <view class="amount">￥{{ payment.price }}</view>
      </view>
      <!-- 内容区域 -->
      <view class="content-container">
        <view class="payment-title">请选择付款方式</view>
        <!-- 支付方式 -->
        <view class="payment-card">
          <view class="payment-method">
            <image
              src="/static/images/mine/order/wechatPay.png"
              class="wechatPay"
              mode="aspectFit"
            />
            <view class="method-info">
              <view class="method-name">微信支付</view>
            </view>

            <radio checked="true" value="1" @click="payType = 1" />
          </view>
        </view>
      </view>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="confirmPayment">确认付款</button>
    </view>
    <view v-if="payStatus == 1">
      <!-- 顶部导航栏 -->
      <view class="nav-bar"></view>

      <view class="v-pay">
        <view class="v-pay-success-box">
          <view class="v-success-icon">
            <image
              class="i-success-icon"
              src="/static/images/mine/order/paySuccess.png"
              mode="aspectFit"
            ></image>
          </view>
          <text class="t-success-title">支付成功</text>
          <text class="t-success-hint">本次交易支付完成</text>
        </view>

        <view class="v-pay-btn">
          <text class="t-pay-btn" @click="goMine">个人中心 {{ currentTime }}s</text>
        </view>
      </view>
    </view>
    <view v-if="payStatus == 2">
      <view class="nav-bar" style="background-color: #fa6a6a">
        <view @click="goBack()">
          <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
          <text class="nav-title">支付失败</text>
        </view>
      </view>

      <view class="v-pay">
        <view class="v-pay-fail-box">
          <view class="v-fail-icon">
            <image
              class="i-fail-icon"
              src="/static/images/mine/order/payFail.png"
              mode="aspectFit"
            />
          </view>
          <view class="v-fail-title">
            <text class="t-fail-title">支付失败</text>
            <text class="t-fail-hint">请尝试重新支付</text>
          </view>
        </view>
        <button class="confirm-btn" @click="repayment">重新支付</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDetail, goPay } from '@/service/order/orderApi'
import { onLoad } from '@dcloudio/uni-app'
import { tabbarStore } from '@/components/au-tabbar/tabbar'

const orderId = ref('')
const payment = ref({
  couponText: '', // 优惠券描述文本
  price: '0.00', // 需支付金额（格式化字符串）
})
const payType = ref(1)
const payStatus = ref(0) //0待支付,1支付成功,2支付失败
const currentTime = ref(6) // 倒计时秒数（初始6秒）
let countdownTimer: ReturnType<typeof setInterval> | null = null
onLoad((options) => {
  if (options.orderId) {
    orderId.value = options.orderId
    uni.showLoading({
      title: '加载中...',
    })
    loadOrderDetail()
  }
})

const loadOrderDetail = async () => {
  try {
    const res = await getDetail({
      orderId: orderId.value,
    })
    if (res.code == '000') {
      if (res.value.orderPayInfo !== null) {
        res.value.orderPayInfo.forEach((item) => {
          if (1 == item.type) {
            payment.value.price = formatMoney(item.serveFee)
          }
        })
      }
      console.log('res.value', res.value)
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    })
    console.error('获取订单数据失败:', error)
  }
}

const requestPay = async () => {
  try {
    let res = await goPay({ orderId: orderId.value })
    if (res.code == '000') {
      console.log('pay', res.value)
      // 微信支付
      if (payType.value == 1) {
        wx.requestPayment({
          timeStamp: res.value.timeStamp,
          nonceStr: res.value.nonceStr,
          package: res.value.packageValue,
          signType: res.value.signType,
          paySign: res.value.paySign,
          success: (wxRes) => {
            console.log('微信支付成功', wxRes)
            paySuccess()
          },
          fail: (error) => {
            console.error('微信支付失败:', error)
            payFail()
          },
          complete: () => {
            console.log('支付流程结束')
            uni.hideLoading()
          },
        })
      } else {
        console.log('其它支付方式:', payType.value)
      }
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    })
    console.error('支付失败:', error)
  }
}

const confirmPayment = () => {
  console.log('confirmPay ')
  requestPay()
}

const payFail = () => {
  payStatus.value = 2
}
const paySuccess = () => {
  payStatus.value = 1
  startCountdown() // 支付成功时启动倒计时
}
const repayment = () => {
  payStatus.value = 0
  requestPay()
}
// 除百
const formatMoney = (fen) => {
  const amount = fen || 0
  return (amount / 100).toFixed(2)
}
const startCountdown = () => {
  // 清除现有倒计时（如果存在）
  clearCountdown()

  countdownTimer = setInterval(() => {
    if (currentTime.value <= 1) {
      // 倒计时结束自动跳转
      clearCountdown()
      goMine()
    } else {
      currentTime.value--
    }
  }, 1000)
}

const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  // 重置倒计时时间
  currentTime.value = 6
}
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    tabbarStore.setCurIdx(0)
    uni.switchTab({
      url: '/pages/home/index',
    })
  }
}
const goMine = () => {
  clearCountdown() // 清除倒计时
  tabbarStore.setCurIdx(4)
  uni.switchTab({
    url: '/pages/mine/index',
  })
}
onUnmounted(() => {
  clearCountdown()
})
</script>

<style lang="scss" scoped>
.ez-page {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
}

/* 导航栏样式 */
.nav-bar {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 10px 16px;
  background-color: #2f72f6;

  .back-icon {
    width: 12px;
    height: 16px;
    margin-bottom: 2px;
    margin-right: 8px;
  }

  .nav-title {
    margin-left: 4px;
    color: white;
    font-size: 18px;
    font-weight: 500;
  }
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 500;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 内容区域 */
.content-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 100px;
  margin-top: 10px;
}

/* 金额区域 */
.amount-section {
  text-align: center;
  background-color: #2f72f6;
  color: white;
  padding: 20px 0 50px 0;
}

.payment-label {
  font-size: 14px;
  margin-bottom: 12px;
}

.amount {
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -1px;
}

/* 费用详情卡片 */
.details-card {
  margin-top: 10px;
  background: white;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 20px;
  color: #333;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.fee-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
}

.fee-label {
  font-size: 14px;
}

.fee-value {
  font-size: 14px;
  font-weight: 500;
  color: #ff5252;
}

.fee-viewider {
  padding-top: 16px;
  border-top: 1px dashed #f0f0f0;
  margin-top: 16px;
}

/* 支付方式卡片 */
.payment-card {
  background: white;
  border-radius: 8px;
  padding: 7px 9px;
  color: #333;
}

.payment-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 12px;
}

.method-info {
  display: flex;
  flex: 1;
}

.method-name {
  font-size: 15px;
  font-weight: 500;
}

.check-icon {
  color: #2f72f6;
  font-size: 22px;
}

.wechatPay {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* 确认按钮 */
.confirm-btn {
  position: fixed;
  bottom: 200px;
  left: 50px;
  right: 50px;
  background: linear-gradient(90deg, #a8cffe, #3476f6);
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.menu-item {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 15px;

  &::after {
    content: '';
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    bottom: 0;
    height: 1rpx;
    background-color: #f1f1f1;
    transform: scaleY(0.5);
  }

  &:last-child::after {
    display: none;
  }

  .menu-text {
    flex: 1;
    font-weight: 500;
    font-size: 14px;
    color: #333;
  }

  .menu-tip {
    font-size: 25rpx;
    color: #999;
    margin-right: 5rpx;
  }

  .menu-tip2 {
    font-size: 25rpx;
    color: #2f72f6;
    margin-right: 5rpx;
  }

  .menu-tip1 {
    font-size: 20rpx;
    background-color: #2f72f6;
    color: #ffffff;
    margin-right: 5rpx;
    border-radius: 4px;
    padding: 2px 4px;
  }

  .menu-arrow {
    width: 40rpx;
    height: 40rpx;
  }
}

/* 抽屉样式 */
.drawer-container {
  position: fixed;
  bottom: -100%;
  left: 0;
  right: 0;
  z-index: 10;
  transition: bottom 0.3s ease;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  max-height: 80vh;
}

/* 抽屉关闭按钮 */
.close-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #999;
}

.drawer-visible {
  bottom: 0;
}

.drawer-content {
  background-color: #f4f4f4;
  height: 100%;
}

.popuptop {
  width: 92%;
  margin: 0px auto 0pt;
  padding-bottom: 10pt;
  padding-top: 10pt;
}

.popup-title {
  color: #3e4041;
  font-size: 17pt;
}

.popup-label {
  color: #a7a7a7;
  font-size: 12pt;
  margin-top: 5pt;
}

.popup-label label {
  color: #2f72f6;
}

.drawer-main {
  flex: 1;
  /* 占据剩余空间 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 防止内容溢出 */
}

.drawer-body {
  flex: 1;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  max-height: 52vh;
  max-width: 92%;
  padding: 30rpx;
}

.rules-text {
  font-size: 28rpx;
  line-height: 1.5;
  color: #555555;
}

.drawer-footer {
  padding: 20rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 11;
}

.drawer-close-btn {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  background: linear-gradient(90deg, #87ceff, #4a7bff);
  color: white;
  font-size: 30rpx;

  &::after {
    border: none;
  }
}

/* 提示优惠劵弹窗样式 */
.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  /* 遮罩层样式 */
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;

    .modal-title {
      font-size: 16px;
      font-weight: bold;
      color: #2a2b2c;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
    }

    .modal-icon {
      width: 80px;
      height: 80px;
    }

    .modal-text {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #2a2b2c;
      line-height: 24px;
      margin-bottom: 20px;
    }

    /* 按钮容器样式 */
    .btn-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-top: 20px;

      .cancel-btn,
      .canuse-btn {
        flex: 1;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 500;
      }

      .cancel-btn {
        background-color: #eeeeee;
        color: #333333;
        border: none;
      }

      .canuse-btn {
        background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
        color: white;
        border: none;
      }
    }
  }
}

.coupon-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 15rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.coupon-body {
  align-items: center;
  margin-top: 20rpx;
  /* 为标签腾出空间 */
  margin-bottom: 20rpx;

  .coupon-content {
    display: flex;
    min-height: 148rpx;
  }

  .icon-section {
    flex-shrink: 0;
    width: 148rpx;
    height: 148rpx;
    margin-right: 20rpx;
  }

  .info-section {
    flex: 1;
    min-width: 0;
  }

  .action-section {
    flex-shrink: 0;
    min-width: 180rpx;
  }

  .coupon-icon {
    width: 148rpx;
    height: 148rpx;
    border-radius: 16rpx;
    flex-shrink: 0;
  }

  .coupon-info {
    flex: 1;
    padding: 0 20rpx;

    .coupon-name {
      font-size: 30rpx;
      font-weight: bold;
      color: #494949;
      line-height: 1.4;
    }

    .coupon-name.used,
    .coupon-name.expired {
      color: #bebebe;
    }

    .coupon-date {
      display: block;
      font-size: 26rpx;
      color: #bebebe;
      margin-top: 10rpx;
    }
  }

  .coupon-action {
    text-align: center;

    /* 隐藏原生样式，使用自定义样式 */
    radio {
      position: relative;
      width: 24px;
      height: 24px;

      /* 隐藏原生单选框 */
      &::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid #ccc;
        background: white;
      }

      &:checked::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #2f72f6;
      }
    }
  }
}

.coupon-rules {
  padding-top: 20rpx;

  .rules-title {
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    font-size: 28rpx;
    color: #545454;

    .arrow-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }

  .rules-content {
    padding-top: 10rpx;
    font-size: 26rpx;
    color: #999999;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

.couponitem {
  width: 92%;
  margin: 10px auto;
  background-color: #fff;
  padding: 15px 15px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  color: #494949;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.couponleft {
  flex: 1;
  min-width: 0;
}

.coupontitle {
  font-size: 14pt;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.coupontype {
  font-size: 11pt;
  margin-bottom: 10px;
  color: #666;
  display: block;
}

.coupontime {
  font-size: 11pt;
  color: #bebebe;
  display: block;
  margin-top: 8px;
}

.couponright {
  text-align: right;
  min-width: 120px;
}

.couponright h4 {
  font-size: 25pt;
  color: #2f72f6;
  text-align: center;
  margin-bottom: 5px;
}

.couponright h4 span {
  font-size: 16pt;
  padding: 0 5px;
}

.couponamount {
  font-size: 12pt;
  color: #ff4923;
  padding: 2px 5px;
  text-align: center;
  background-color: #fff8f6;
  border-radius: 4px;
}

.couponbottom {
  margin-top: 12pt;
  border-top: 1pt dashed #eee;
  padding-top: 10px;
}

.sytype {
  margin-top: 10px;
}

.invalid .couponright h4 {
  color: #bebebe !important;
}

.invalid .couponamount {
  color: #bebebe !important;
  background-color: #f8f8f8;
}

.expire {
  background-color: #feece9;
  color: #ff4923;
  border-radius: 6pt;
  padding: 2px 3px;
  font-size: 10pt;
}

/* 支付组件容器 */
.v-pay {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 支付成功容器 */
.v-pay-success-box {
  padding-top: 20px;
  width: 100%;
  height: 300rpx;
  background-color: #2f72f6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 成功图标容器 */
.v-success-icon {
  width: 110rpx;
  height: 110rpx;
}

/* 成功图标 */
.i-success-icon {
  width: 100%;
  height: 100%;
}

/* 成功标题 */
.t-success-title {
  margin-top: 20rpx;
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 56rpx;
}

/* 成功提示 */
.t-success-hint {
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
}

/* 评价盒子 */
.v-evaluate-box {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 20rpx;
  margin-top: -50rpx;
  margin-left: 30rpx;
  margin-right: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0px 1px 6px #ddd;
}

/* 支付失败容器 */
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

/* 失败图标容器 */
.v-fail-icon {
  width: 128rpx;
  height: 128rpx;
}

/* 失败图标 */
.i-fail-icon {
  width: 100%;
  height: 100%;
}

/* 失败标题容器 */
.v-fail-title {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 44rpx;
}

/* 失败标题 */
.t-fail-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 56rpx;
}

/* 失败提示 */
.t-fail-hint {
  font-size: 28rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
}

/* 按钮容器（支付/返回） */
.v-pay-btn {
  margin-top: 150rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按钮文本 */
.t-pay-btn {
  position: fixed;
  bottom: 25px;
  width: 120px;
  height: 37px;
  border: none;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #737373;
}

/* 底部返回按钮（评价页面） */
.v-user-center-btn {
  margin-bottom: 20rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 底部返回按钮文本 */
.t-user-center-btn {
  height: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #b9b9b9;
  line-height: 40rpx;
}

.rate-container {
  display: flex;
  gap: 40rpx;
}

.rate-star {
  font-size: 65rpx;
  color: #ccc;
}

.rate-star.active {
  color: #ffc107;
}
/* 星星评分容器 */
.stars-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30rpx;
}

/* 标签容器 */
.tags-container {
  display: flex;
  margin-left: 32rpx;
  margin-top: 16rpx;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

/* 标签项基础样式 */
.tag-item {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  padding: 16rpx 30rpx;
  border-radius: 72rpx;
  font-weight: 400;
  line-height: 50rpx;
  font-size: 28rpx;
  text-align: center;
  letter-spacing: 0px;
  margin-right: 30rpx;
  margin-top: 24rpx;
}

/* 激活状态的标签 */
.tag-active {
  background: #2f72f6;
  color: #ffffff;
}

/* 非激活状态的标签 */
.tag-inactive {
  background: #f9f9f9;
  color: #333333;
}

/* 文本区域容器 */
.textarea-container {
  display: flex;
  background: #f6f7f9;
  border-radius: 20rpx;
  margin-left: 32rpx;
  margin-top: 40rpx;
  margin-right: 32rpx;
}

/* 评价文本区域 */
.evaluation-textarea {
  height: 180rpx;
  width: 100%;
  font-size: 28rpx;
  color: #333333;
  padding: 22rpx 20rpx;
  line-height: 32rpx;
}

/* 提交按钮容器 */
.submit-container {
  padding: 20px 15px;
  display: flex;
  margin-left: 80rpx;
  margin-right: 80rpx;
}

/* 提交按钮样式 */
.submit-btn {
  letter-spacing: 2px;
  line-height: 40px;
  color: white;
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  border-radius: 100px;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  box-shadow: 0px 3px 9px -2px rgba(55, 120, 248, 0.48);
  border-radius: 20px;
}
</style>
