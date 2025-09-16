<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '服务人员招募',
  },
}
</route>

<template>
  <view class="ez-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: themeColor }">
      <view @click="goBack">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">服务人员招募</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 顶部横幅插画 -->
      <view style="height: 460rpx; align-items: center; flex-shrink: 0">
        <image
          src="/static/images/mine/recruiters/recruiters_bg.png"
          style="height: 100%; width: 100%"
        ></image>
      </view>
      <!-- 招募说明和表单区域 -->
      <view class="recruit-info">
        <!-- 说明文字 -->
        <view class="rules-hint">
          <text>
            1、我们正在招募维修人员及保洁人员，工作时间自由，订单多，按照距离及时间段等进行分配或者自由接单
          </text>
          <text>2、更多消息请留您的手机号码，会有专门的工作人员进行联系讲解。</text>
        </view>

        <!-- 表单 -->
        <view class="form-section">
          <!-- 姓名输入框 -->
          <view class="form-item">
            <text class="form-label">
              <text class="required">*</text>
              姓名
            </text>
            <input
              v-model="formData.name"
              placeholder="请填写"
              placeholder-class="placeholder-style"
              class="native-input"
            />
          </view>
          <view class="divider"></view>

          <!-- 手机输入框 -->
          <view class="form-item">
            <text class="form-label">
              <text class="required">*</text>
              手机
            </text>
            <input
              v-model="formData.phone"
              placeholder="请填写"
              placeholder-class="placeholder-style"
              class="native-input"
            />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="submit-view" @click="onSubmit">{{ submit }}</view>
    <!-- 弹窗 -->
    <view v-if="modal.show" class="modal-container">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">提交成功</text>
        </view>
        <view class="modal-body">
          <text class="modal-message">
            {{ modal.time }}
            <text class="modal-time-hint">秒后返回“我的”页面</text>
          </text>
        </view>
        <view class="modal-footer">
          <button @click="goBack" class="modal-button">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getRecruitersInfo,
  submitRecruiters,
  updateRecruiters,
} from '@/service/recruiters/recruitersApi'

const formData = ref({
  name: '',
  phone: '',
})

let themeColor = inject('themeColor')
const submit = ref('立即提交')
const modal = ref({
  time: 3,
  show: false,
})

// 获取招募信息
const getrecruitersInfo = async () => {
  const res = await getRecruitersInfo()
  if (res.code === '000') {
    if (res.value != null) {
      formData.value = res.value
      submit.value = '再次提交'
    }
  }
}
const showSuccessModal = () => {
  modal.value.show = true
  let intervalId = setInterval(() => {
    modal.value.time--
    if (modal.value.time <= 0) {
      clearInterval(intervalId)
      modal.value.show = false
      goBack()
    }
  }, 1000)
}
// 提交招募信息
const submitrecruiters = async () => {
  const res = await submitRecruiters(formData.value)
  if (res.code === '000') {
    modal.value.show = true
    let intervalId = setInterval(() => {
      modal.value.time--
      if (modal.value.time <= 0) {
        clearInterval(intervalId)
        modal.value.show = false
        goBack()
      }
    }, 1000)
  }
}

// 更新招募信息
const updaterecruiters = async () => {
  const res = await updateRecruiters(formData.value)
  if (res.code === '000') {
    modal.value.show = true
    let intervalId = setInterval(() => {
      modal.value.time--
      if (modal.value.time <= 0) {
        clearInterval(intervalId)
        modal.value.show = false
        goBack()
      }
    }, 1000)
  }
}

// 表单提交处理
const onSubmit = () => {
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
    })
    return
  }

  if (!/^1[2-9]\d{9}$/.test(formData.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  if (submit.value === '再次提交') {
    updaterecruiters()
  } else {
    submitrecruiters()
  }
  showSuccessModal()
}

// 返回上一页
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/mine/index',
    })
  }
}

// 页面加载时初始化
onMounted(() => {
  getrecruitersInfo()
})
</script>

<style lang="scss">
.ez-page {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f4f4;
}

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

.scroll-container {
  flex: 1;
  background-color: #f4f4f4;
}

.recruit-info {
  position: relative;
  z-index: 100;
  background: #ffffff;
  border-radius: 12px;
  margin-top: -60rpx;
  margin-left: 32rpx;
  margin-right: 32rpx;
  padding: 20px;
  box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(80, 130, 230, 0.1);

  .recruit-title {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #2f72f6;
    margin-bottom: 16px;
    text-align: center;
  }

  .rules-hint {
    padding: 10px 0 20px;

    text {
      display: block;
      font-size: 14px;
      color: #2f72f6;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }

  .form-section {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .form-item {
    display: flex;
    align-items: center;
    padding: 16px 8px;
  }

  .form-label {
    font-size: 16px;
    color: #000;
    width: 70px;
  }

  .required {
    color: #ff3b30;
    margin-right: 4px;
  }

  .input-field {
    flex: 1;
    height: 40px;
    padding-left: 10px;
    font-size: 16px;
  }

  .divider {
    height: 1px;
    background-color: #eeeeee;
    margin: 0 8px;
  }

  .native-input {
    flex: 1;
    height: 40px;
    padding-left: 10px;
    font-size: 16px;
    color: #333;
  }

  .placeholder-style {
    color: #939393 !important;
  }
}

.submit-view {
  margin: 0 16px 16px;
  padding: 14px;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  border-radius: 25px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 6px 18px rgba(55, 120, 248, 0.3);
}
/* 弹窗容器样式 */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保弹窗在最上层 */
}

/* 弹窗内容样式 */
.modal-content {
  background-color: white;
  width: 80%; /* 设置弹窗宽度 */
  max-width: 400px; /* 设置最大宽度 */
  border-radius: 10px;
  overflow: hidden;
  animation: modalFadeIn 0.3s; /* 添加淡入动画 */
}

/* 动画定义 */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 弹窗头部样式 */
.modal-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 弹窗主体样式 */
.modal-body {
  padding: 20px;
  text-align: center;
}

.modal-message {
  font-size: 16px;
  color: #666;
}

.modal-time-hint {
  color: #999;
  font-size: 14px;
}

/* 弹窗底部样式 */
.modal-footer {
  padding: 15px;
  display: flex;
  justify-content: center;
}

.modal-button {
  background-color: #2f72f6;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-button:hover {
  background-color: #1e5cd0;
}
</style>
