<route lang="json5">
{
  style: {
    navigationBarTitleText: '邀请码',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="ez-page" :style="{ backgroundColor: themeColor }">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: themeColor }">
      <view @click="goBack()">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">邀请码</text>
      </view>
    </view>

    <view class="root-view" :style="{ backgroundColor: themeColor }">
      <!-- 整体布局 -->
      <view class="container-view">
        <!-- 上部分：邀请码输入区域 -->
        <view class="top-view-bg">
          <view class="top-hint-code">请填写您的邀请码</view>
          <view class="top-hint-rules">6位字符，请注意字母大小写</view>

          <!-- 6位输入框布局 -->
          <view class="code-input-view">
            <!-- 隐藏的输入框用于实际输入 -->
            <input
              id="hidden-input"
              maxlength="6"
              :value="actualCode"
              @input="handleInput"
              :focus="inputFocused"
              :adjust-position="false"
              class="hidden-input"
            />
            <!-- 视觉展示框 -->
            <view
              v-for="i in 6"
              :key="i"
              class="code-display-box"
              @click="focusInput"
              :style="{
                backgroundColor: i === actualCode.length + 1 ? '#FFFFFF' : '#F5F5F5',
                borderColor: i === actualCode.length + 1 ? '#2F72F6' : '#E0E0E0',
              }"
            >
              {{ actualCode[i - 1] || '' }}
            </view>
          </view>

          <!-- 确定按钮 -->
          <view
            :style="{ backgroundColor: isCompleted ? '#2F72F6' : '#dedfe1' }"
            class="code-next-def-view"
            @click="submitInviteCode"
          >
            确定
          </view>
        </view>
        <!-- 下部分：我的邀请码展示 -->
        <view class="bottom-view-bg">
          <image
            class="bottom-image-bg-view"
            src="/static/images/mine/invite/code_qr_bg.png"
            mode="aspectFit widthFix"
          ></image>
          <view class="bottom-content">
            <view class="bottom-hint-code">我的邀请码</view>
            <view class="bottom-code">{{ bottom.code }}</view>

            <view class="bottom-count">
              <text>{{ bottom.peopleCountTitle }}：{{ bottom.peopleCount }}</text>
              <text>{{ bottom.dealCountTitle }}：{{ bottom.dealCount }}</text>
            </view>

            <view class="bottom-hint-rules">
              注：首次登录可输入邀请码。您也可以使用
              <br />
              我的推广二维码进行推广。
            </view>

            <!-- 二维码区域 -->
            <view class="bottom-qr-view">
              <!-- <view class="qr-placeholder"> -->
              <uqrcode
                ref="qrcodeRef"
                canvas-id="qrcode"
                value="https://run.huichenghuijia.com/wx/invite?inviteCode=275440"
                size="145"
              ></uqrcode>
              <!-- </view> -->
            </view>

            <!-- 保存按钮 -->
            <view class="code-save-view" @click="save">{{ bottom.save }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import { bindInviteUser } from '@/service/code/codeApi'

let themeColor = inject('themeColor')
const qrcodeRef = ref(null)
const userStore = useUserStore()
// 实际输入的邀请码字符串
const actualCode = ref('')
// 控制隐藏输入框的焦点
const inputFocused = ref(false)
// 底部展示数据
const bottom = ref({
  hintCode: '我的邀请码',
  code: '',
  codeValue: '',
  options: {
    size: 290,
    sizeUnit: 'rpx',
    margin: 10,
    start: true,
  },
  peopleCountTitle: '邀请人数',
  peopleCount: 0,
  dealCountTitle: '成交量',
  dealCount: 0,
  save: '保存到相册',
})

// 用户信息初始化
onLoad(() => {
  bottom.value.code = userStore.userInfo.inviteCode || ''
  bottom.value.codeValue =
    import.meta.env.VITE_SERVER_BASEURL +
    '/wx/invite?inviteCode=' +
    (userStore.userInfo.inviteCode || '')
  console.log('邀请码', bottom.value.codeValue)
  bottom.value.peopleCount = userStore.userInfo.inviteNumber || 0
  bottom.value.dealCount = userStore.userInfo.inviteUserFinishOrderNumber || 0
})

// 提交邀请码绑定
const submitBindInviteUser = async (inviteCode) => {
  if (!inviteCode || inviteCode.length !== 6) {
    return
  }

  try {
    const res = await bindInviteUser({
      inviteCode: inviteCode,
    })

    if (res.code == '000') {
      uni.showToast({
        title: '绑定成功！',
        duration: 800,
      })
      // 清空输入框
      actualCode.value = ''
      console.log('bindInviteUser 绑定邀请码成功 res=', res)
    } else {
      // 根据不同的错误码显示不同的提示信息
      let errorMessage = '绑定失败'

      // 如果有服务端返回的错误信息，优先使用
      if (res.message) {
        errorMessage = res.message
      } else if (res.errorMessage) {
        errorMessage = res.errorMessage
      }

      uni.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000,
      })
      console.log('bindInviteUser 失败 res=', res)
    }
  } catch (error) {
    console.error('绑定邀请码异常:', error)
    uni.showToast({
      title: '绑定失败',
      icon: 'none',
    })
  }
}

// 提交邀请码
const submitInviteCode = () => {
  if (actualCode.value.length < 6) {
    uni.showToast({
      title: '请输入完整邀请码',
      icon: 'none',
    })
    return
  }
  submitBindInviteUser(actualCode.value)
}

// 保存功能
const save = () => {
  qrcodeRef.value.save({
    success: () => {
      uni.showToast({
        icon: 'success',
        title: '保存成功',
      })
    },
  })
}

// 计算是否完成所有输入
const isCompleted = computed(() => {
  return actualCode.value.length === 6
})

// 聚焦输入框
const focusInput = () => {
  inputFocused.value = true
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    query.select('#hidden-input').fields({
      node: true,
      size: true,
    })
    query.exec((res) => {
      if (res[0] && res[0].node) {
        res[0].node.focus()
      }
    })
  }, 100)
}

// 处理输入
const handleInput = (e) => {
  const value = e.detail.value
  // 过滤非字母数字字符
  const filtered = value.replace(/[^a-zA-Z0-9]/g, '')
  // 只取前6位
  actualCode.value = filtered.slice(0, 6)
}

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
</script>

<style scoped>
/* 添加页面基本样式 */
.ez-page {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* 导航栏样式 */
.nav-bar {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 10px 16px;
}

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

.root-view {
  width: 100%;
  padding-bottom: 20rpx;
}

.container-view {
  display: flex;
  flex-direction: column;
  padding: 0 32rpx;
}

.top-view-bg {
  margin-top: 20rpx;
  height: 480rpx;
  background: #ffffff;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-hint-code {
  padding-top: 40rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #202224;
  line-height: 72rpx;
}

.top-hint-rules {
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #929292;
  line-height: 72rpx;
}

.code-input-view {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 40rpx;
}

.code-display-box {
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  border-width: 2rpx;
  border-style: solid;
  border-color: #e0e0e0;
  background-color: #f5f5f5;
}

.code-next-def-view {
  margin-top: 30rpx;
  width: calc(100% - 80rpx);
  height: 90rpx;
  border-radius: 45rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 90rpx;
  letter-spacing: 4px;
}

.bottom-view-bg {
  position: relative;
  margin-top: 20rpx;
  border-radius: 32rpx;
  overflow: hidden;
  height: 880rpx;
}

.bottom-image-bg-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bottom-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.bottom-hint-code {
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #202224;
  line-height: 36rpx;
}

.bottom-code {
  height: 80rpx;
  margin-top: 20rpx;
  text-align: center;
  font-size: 80rpx;
  font-weight: 600;
  color: #2f72f6;
  line-height: 80rpx;
  letter-spacing: 2px;
}

.bottom-count {
  width: 70%;
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  font-size: 28rpx;
  font-weight: normal;
  color: #2f72f6;
  line-height: 30rpx;
}

.bottom-hint-rules {
  margin-top: 84rpx;
  width: 80%;
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #929292;
  line-height: 56rpx;
}

.bottom-qr-view {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24rpx;
  background-color: #eee;
  width: 290rpx;
  height: 290rpx;
  border-radius: 16rpx;
}

.code-save-view {
  display: flex;
  width: 400rpx;
  margin-top: 30rpx;
  height: 84rpx;
  border-radius: 45rpx;
  border: 4rpx solid #2f72f6;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 32rpx;
  font-weight: 400;
  color: #2f72f6;
  line-height: 84rpx;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
</style>
