<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '开票信息',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="ez-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: themeColor }">
      <view @click="goBackFf">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">开票信息</text>
      </view>
    </view>

    <view class="content-container">
      <!-- 发票类型选择 -->
      <view class="section-title">请选择发票类型</view>
      <view class="type-container">
        <view
          :class="['type-option', param.invoiceType === 0 ? 'active' : '']"
          @click="onDefonInvoiceSelect"
        >
          <text>电子发票</text>
          <text :class="['type-subtitle', param.invoiceType === 0 ? 'active-text' : '']">
            增值税普通发票
          </text>
        </view>

        <view
          :class="['type-option', param.invoiceType === 1 ? 'active' : '']"
          @click="onInvoiceSelect"
        >
          <text>电子发票</text>
          <text :class="['type-subtitle', param.invoiceType === 1 ? 'active-text' : '']">
            增值税专用发票
          </text>
        </view>
      </view>

      <view class="type-tip">
        温馨提示：应国家税务总局要求，您若开具增值税普通发票，须同时提供企业抬头及纳税人识别号，否则发票将无法用于企业报销
      </view>

      <!-- 发票详情 -->
      <view class="section-title">
        发票详情
        <view class="select-button" @click="chooseInvoiceTitle">选择发票抬头</view>
      </view>

      <view class="info-container">
        <!-- 名称 -->
        <view class="info-row">
          <view class="info-label">名称</view>
          <input v-model="invoiceTitle.title" placeholder="请填写" class="input-field" />
        </view>

        <!-- 抬头类型 -->
        <view class="info-row compact">
          <view class="info-label">抬头类型</view>
          <radio-group class="radio-group" @change="radioChange">
            <view class="radio-option">
              <text style="margin-right: 20px">企业</text>
              <radio value="0" :checked="param.type === 0" color="#2F72F6" />
            </view>

            <view class="radio-option">
              <text style="margin-right: 20px">个人/非企业</text>
              <radio value="1" :checked="param.type === 1" color="#2F72F6" />
            </view>
          </radio-group>
        </view>

        <!-- 企业信息区域 -->
        <template v-if="param.type === 0">
          <view class="info-row">
            <view class="info-label">抬头税号</view>
            <input v-model="invoiceTitle.taxNumber" placeholder="请填写" class="input-field" />
          </view>

          <view class="info-row">
            <view class="info-label">单位地址</view>
            <input v-model="invoiceTitle.companyAddress" placeholder="请填写" class="input-field" />
          </view>

          <view class="info-row">
            <view class="info-label">电话号码</view>
            <input v-model="invoiceTitle.telephone" placeholder="请填写" class="input-field" />
          </view>

          <view class="info-row">
            <view class="info-label">开户银行</view>
            <input v-model="invoiceTitle.bankName" placeholder="请填写" class="input-field" />
          </view>

          <view class="info-row">
            <view class="info-label">银行账号</view>
            <input v-model="invoiceTitle.bankAccount" placeholder="请填写" class="input-field" />
          </view>
        </template>

        <!-- 邮箱地址 -->
        <view class="info-row">
          <view class="info-label">邮箱地址</view>
          <input v-model="param.email" placeholder="用于接收电子发票（必填）" class="input-field" />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-button" @click="toSubmit">提交开票</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { invoiceIsuse } from '@/service/invoice/invoiceApi'

let themeColor = inject('themeColor')
// 参数对象
const param = ref({
  orderId: '',
  invoiceType: 0, // 0:普通发票, 1:专用发票
  type: 0, // 0:企业, 1:个人
  email: '',
})

// 发票抬头信息
const invoiceTitle = ref({
  title: '',
  type: 0, // 0:企业, 1:个人
  taxNumber: '',
  companyAddress: '',
  telephone: '',
  bankName: '',
  bankAccount: '',
})

// 页面加载
onLoad((d) => {
  console.log('onLoad d=', d.orderId)

  param.value.orderId = d.orderId

  console.log('onLoad orderId:', param.value.orderId)
})

// 方法定义
const goBackFf = () => {
  uni.navigateBack({ delta: 1 })
}

const onDefonInvoiceSelect = () => {
  if (param.value.invoiceType !== 0) {
    resetInvoiceTitle()
  }
  param.value.invoiceType = 0
}

const onInvoiceSelect = () => {
  if (param.value.invoiceType !== 1) {
    resetInvoiceTitle()
  }
  param.value.invoiceType = 1
  param.value.type = 0 // 专用发票只能是企业
}

const resetInvoiceTitle = () => {
  invoiceTitle.value = {
    title: '',
    type: 0,
    taxNumber: '',
    companyAddress: '',
    telephone: '',
    bankName: '',
    bankAccount: '',
  }
}

const radioChange = (e) => {
  const value = e.target.value
  param.value.type = parseInt(value)

  // 专用发票只能是企业
  if (param.value.type === 1 && param.value.invoiceType === 1) {
    param.value.invoiceType = 0
  }

  resetInvoiceTitle()
}

const chooseInvoiceTitle = () => {
  wx.chooseInvoiceTitle({
    success(res) {
      // 类型强制转换 + 日志验证
      const resType = Number(res.type)
      const currentType = Number(param.value.type)

      // 类型检查（使用转换后的数字比较）
      if (resType === 1 && param.value.invoiceType === 1) {
        console.log('触发条件1')
        showToast('当前发票类型为专用发票,无法选择个人抬头类型')
        return
      }

      if (resType === 0 && currentType === 1) {
        console.log('触发条件2')
        showToast('当前抬头类型为个人/非企业,无法选择企业抬头类型')
        return
      }

      if (param.value.invoiceType === 0 && currentType === 0 && resType === 1) {
        console.log('触发条件3')
        showToast('当前抬头类型为企业,无法选择个人抬头类型')
        return
      }

      console.log('通过所有条件检查，应用发票抬头')

      // 更新状态
      invoiceTitle.value = {
        ...res,
        type: resType, // 确保使用转换后的类型
      }

      // 如果需要，可以同步更新 param.value.type
      param.value.type = resType
    },
    fail(res) {
      console.log('选择发票抬头失败:', res)
    },
  })
}

const toSubmit = async () => {
  console.log('toSubmit invoiceTitle:', invoiceTitle.value)
  console.log('toSubmit param:', param.value)
  // 表单验证
  if (!invoiceTitle.value.title) {
    showToast('请填写名称')
    return
  }

  if (param.value.type === 0 && !invoiceTitle.value.taxNumber) {
    showToast('请填写抬头税号')
    return
  }

  if (!param.value.email) {
    showToast('请填写邮箱地址')
    return
  }
  // 邮箱格式验证
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(param.value.email)) {
    showToast('请填写有效的邮箱地址')
    return
  }

  // 准备请求数据
  const body = {
    orderId: param.value.orderId,
    invoiceType: param.value.invoiceType === 0 ? 62 : 61, // 62:普票, 61:专票
    buyerName: invoiceTitle.value.title,
    buyerEmail: param.value.email,
    buyerType: param.value.type === 0 ? '01' : '03', // 01:企业, 03:个人
    buyerAddress: invoiceTitle.value.companyAddress,
    buyerTaxNo: invoiceTitle.value.taxNumber,
  }

  // 调用API
  const res = await invoiceIsuse(body)
  if (res.code) {
    uni.showToast({ title: '提交成功!', icon: 'success' })
    uni.$emit('invoice_order', { msg: '提交成功' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
}

// 显示提示信息
const showToast = (message: string) => {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  })
}
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
  padding: 40px 16px 0px 16px;

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

.content-container {
  flex: 1;
  padding: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.select-button {
  height: 56rpx;
  padding: 0 20rpx;
  background: #2f72f6;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 56rpx;
}

.type-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45%;
  height: 112rpx;
  border-radius: 8rpx;
  border: 2rpx solid #b4b0b0;
  font-size: 26rpx;
  color: #666;
  padding: 12rpx;

  &.active {
    border: 2rpx solid #2f72f6;
    color: #2f72f6;
    background-color: rgba(47, 114, 246, 0.05);
  }
}

.type-subtitle {
  font-size: 24rpx;
  font-weight: 500;
  margin-top: 6rpx;

  &.active-text {
    color: #2f72f6;
  }
}

.type-tip {
  font-size: 22rpx;
  color: #ff663d;
  line-height: 1.5;
  padding: 8rpx 0;
  margin-bottom: 16rpx;
}

.info-container {
  flex: 1;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 20rpx 0 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;

  &.compact {
    margin-bottom: 10rpx;
    padding: 10rpx 0;
  }
}

.info-label {
  width: 140rpx;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.input-field {
  flex: 1;
  height: 72rpx;
  font-size: 26rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  background-color: #f8f8f8;
}

.radio-group {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.radio-option {
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.submit-button {
  flex-shrink: 0;
  height: 88rpx;
  margin: 0 32rpx 32rpx;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(55, 120, 248, 0.3);
}
</style>
