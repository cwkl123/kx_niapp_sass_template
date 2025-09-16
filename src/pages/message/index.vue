<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '消息',
    navigationStyle: 'custom',
    disableScroll: true,
  },
}
</route>

<template>
  <view class="page-container">
    <!-- 背景图片容器 -->
    <view class="background-image" :style="{ backgroundColor: themeColor }"></view>
    <!-- <image class="background-image" src="/static/images/msg/bc_ground.png" mode="widthFix"></image> -->
    <view class="message-container">
      <view class="content-wrapper" :style="contentWrapperStyle">
        <view class="read-msg-view">
          <text class="msg-text">消息</text>
          <view class="read-all-view mr-8" @click="showConfirmModal">
            <wd-icon name="check" size="12" color="#ffffff"></wd-icon>
            <text>全部已读</text>
          </view>
        </view>

        <scroll-view
          scroll-y="true"
          class="scroll-area"
          :refresher-enabled="isAtTop"
          :refresher-triggered="isRefreshing"
          @refresherrefresh="refreshList"
          @scrolltolower="loadMore"
          @scroll="handleScroll"
          :scroll-top="scrollTop"
        >
          <view v-if="messageList.length">
            <view
              v-for="(item, index) in messageList"
              :key="index"
              class="msg-view"
              @click="handleMsgClick(item)"
            >
              <view class="msg-time-view">{{ formatTime(item.createTime) }}</view>
              <view class="msg-container">
                <view class="msg-title">系统消息</view>
                <view class="msg-content">{{ item.content }}</view>
                <view class="msg-line"></view>
                <view class="msg-box">
                  <view class="msg-details-title">查看详情</view>
                  <wd-icon name="arrow-right" size="20px" color="#A0A0A0"></wd-icon>
                </view>
              </view>
            </view>
            <view v-if="isLoading" class="loading-view">
              <u-loadmore status="loading" />
            </view>
            <view v-else-if="noMoreData" class="no-more-view">
              <text>没有更多了</text>
            </view>
            <view style="color: #f4f4f4">.</view>
          </view>
          <view v-else class="empty-view">
            <image class="empty-image" :src="emptyIcon" mode="aspectFit"></image>
            <text class="empty-text">{{ emptyTitle }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
    <view class="back-top" v-show="showBackTop" @click="scrollToTop">
      <wd-icon name="arrow-up" size="20" color="#ffffff"></wd-icon>
    </view>
  </view>

  <wd-popup v-model="showModelParam" custom-style="border-radius:32rpx;">
    <view class="box">
      <view style="padding: 10px">
        <view class="popup-text">提示</view>
        <view class="popup-text">需要先登录</view>
      </view>
      <view class="popup-view">
        <button size="mini" class="popup popup-cancel" @click="showModelParam = false">取消</button>
        <view style="width: 1px; background-color: #dedede"></view>
        <button @click="getUserInfo" lang="zh_CN" size="mini" class="popup popup-confirm">
          确认
        </button>
      </view>
    </view>
  </wd-popup>
  <wd-popup v-model="showModel" custom-style="border-radius:32rpx;">
    <view class="box">
      <view style="padding: 10px">
        <view class="popup-text">提示</view>
        <view class="popup-text">需要绑定手机号</view>
      </view>
      <view class="popup-view">
        <button size="mini" class="popup popup-cancel" @click="showModel = false">取消</button>
        <view style="width: 1px; background-color: #dedede"></view>
        <button
          open-type="getPhoneNumber"
          lang="zh_CN"
          @getphonenumber="getWxPhoneNumber"
          size="mini"
          class="popup popup-confirm"
        >
          确认
        </button>
      </view>
    </view>
  </wd-popup>

  <wd-popup v-model="showModelLogout" custom-style="border-radius:32rpx;">
    <view class="box">
      <view style="padding: 10px">
        <view class="popup-text">提示</view>
        <view class="popup-text">您确定要登出吗？</view>
      </view>
      <view class="popup-view">
        <button size="mini" class="popup popup-cancel" @click="showModelLogout = false">
          取消
        </button>
        <view style="width: 1px; background-color: #dedede"></view>
        <button @click="logout" lang="zh_CN" size="mini" class="popup popup-confirm">确认</button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { getSafeAreaInsets } from '@/utils'
import { getMsgList, getMsgCount, getMsgReadAll } from '@/service/msg/msgApi'
import { useMessage } from '/node_modules/wot-design-uni'
import { useLoginStore, useUserStore, useConfigStore } from '@/store'
import { getWXPhone, getWxUserInfo } from '@/service/base/loginApi'
import { receiveDiscount } from '@/service/coupon/ordercoupon'

// 安全区域
const { safeAreaInsets } = getSafeAreaInsets()
// 使用 Wot Design 的消息组件
const message = useMessage()
const userStore = useUserStore()
const loginInfoStore = useLoginStore()
const configStore = useConfigStore()
let themeColor = inject('themeColor')
const loginSuccessBack = ref(false)
const isAtTop = ref(true)
const showBackTop = ref(false)
const scrollTop = ref(0)
const scrollPosition = ref(0)
// 数据模型
const emptyIcon = ref('/static/images/msg/order_empty.png')
const emptyTitle = ref('暂无消息')
const messageList = ref([])
const modalVisible = ref(false)
const modalText = ref('确定后，则未读消息全部显示为已读状态，是否确定？')
const isLoading = ref(false)
const isRefreshing = ref(false)
const showModel = ref(false)
const showModelParam = ref(false)
const showModelLogout = ref(false)
const noMoreData = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const userInfo = ref({
  name: '未登录',
  phone: '登录后享受更多服务',
  avatar: '/static/images/mine/index/user_images.png',
})

// 初始化加载
onShow(async () => {
  configStore.fetchConfig()
  showLogin()
  if (loginInfoStore.loginInfo.isLogin) {
    loadMessages()
  }
  loginSuccessBack.value = uni.getStorageSync('LOGIN_SUCCESS_BACK')
  console.log('onShow  LOGIN_SUCCESS_BACK:', loginSuccessBack.value)
})

// 监听滚动事件
const handleScroll = (e) => {
  scrollPosition.value = e.detail.scrollTop
  // 当滚动超过300rpx时显示返回顶部按钮
  showBackTop.value = e.detail.scrollTop > 300
}

// 返回顶部功能
const scrollToTop = () => {
  scrollTop.value = scrollPosition.value
  nextTick(() => {
    scrollTop.value = 0
    showBackTop.value = false
  })
}

// 确认登录弹窗
const showLogin = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showModelParam.value = true
  }
}
// 获取微信信息
const getUserInfo = () => {
  showModelParam.value = false
  wx.getUserProfile({
    desc: '用于完善用户基本信息',
    success: (wxUserData) => {
      wx.login({
        success(wxLoginData) {
          if (wxLoginData.code) {
            doLogin(wxLoginData.code, wxUserData)
          }
        },
      })
    },
  })
}
// 登录接口
const doLogin = async (code, wxUserData) => {
  const res = await loginInfoStore.toLogin(code, wxUserData)
  if (res) {
    if (userStore.userInfo.nickName) {
      userInfo.value.name = userStore.userInfo.nickName
      userInfo.value.phone = '未绑定手机号'
    }
    if (userStore.userInfo.avatar) {
      userInfo.value.avatar = userStore.userInfo.avatar
    }
    showBindPhone()
  }
}
// 绑定手机号弹窗
const showBindPhone = () => {
  if (!userStore.userInfo.phone) {
    showModel.value = true
  }
}
// 手机号
const getWxPhoneNumber = (e) => {
  showModel.value = false
  if (e.detail.encryptedData) {
    getPhone(e.detail)
  }
}
// 获取手机号
const getPhone = async (data) => {
  await checkSession()
  console.log(loginInfoStore.loginInfo)
  let phoneInfo = {
    encryptedData: data.encryptedData,
    iv: data.iv,
    sessionKey: loginInfoStore.loginInfo.loginData.sessionKey,
  }
  let res = await getWXPhone(phoneInfo)
  if (res.code == '000') {
    if (res.value != null) {
      register(phoneInfo, res.value.phoneNumber)
    }
    if (userStore.userInfo.phone) {
      userInfo.value.phone = userStore.userInfo.phone
    }
  }
}
// 登录信息
const register = async (data, phone) => {
  await checkSession()
  const res = await loginInfoStore.regLogin(phone)
  if (res) {
    if (userStore.userInfo.phone) {
      userInfo.value.phone = userStore.userInfo.phone
    }
  }
}
// 检查登录状态
const checkSession = async (data) => {
  const checkResult = await wxCheckSession()
  if (checkResult) {
  } else {
    showLogin()
    return
  }
}
// 检查登录状态
const wxCheckSession = () =>
  new Promise((resolve, reject) => {
    wx.checkSession({
      success(res) {
        resolve(true)
      },
      fail(res) {
        resolve(false)
      },
    })
  })
const contentWrapperStyle = computed(() => ({
  backgroundColor: messageList.value.length ? '#f4f4f4' : '#fff',
}))

// 下拉刷新
const refreshList = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true
  currentPage.value = 1
  noMoreData.value = false

  await loadMessages(true)

  isRefreshing.value = false
}

// 上拉加载更多
const loadMore = () => {
  if (isLoading.value || noMoreData.value) return

  currentPage.value += 1
  loadMessages()
}

// 加载消息
const loadMessages = async (isRefresh = false) => {
  if (isLoading.value) return

  isLoading.value = true
  console.log('currentPage.value', currentPage.value)
  try {
    let param = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }
    console.log(param)
    const res = await getMsgList(param)

    if (res.code === '000') {
      const items = res.value.list || []

      if (isRefresh) {
        messageList.value = items
      } else {
        messageList.value = [...messageList.value, ...items]
      }

      // 如果加载数据少于 pageSize，说明没有更多数据了
      noMoreData.value = items.length < pageSize.value
    } else {
      uni.showToast({ title: '加载失败', icon: 'none' })
    }
  } catch (error) {
    uni.showToast({ title: '加载出错', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}

// 格式化时间函数
const formatTime = (timeString) => {
  if (!timeString) return ''

  try {
    let date

    // 处理数字类型的时间戳（包括字符串形式的数字）
    if (typeof timeString === 'number' || /^\d+$/.test(timeString)) {
      let timestamp = parseInt(timeString)
      // 处理10位时间戳（秒级）
      if (timestamp.toString().length === 10) {
        timestamp *= 1000
      }
      date = new Date(timestamp)
    }
    // 处理字符串类型的时间
    else {
      // 替换特殊字符确保浏览器兼容性
      const formattedTime = timeString.replace(/-/g, '/').replace(/\./g, '/')
      date = new Date(formattedTime)
    }

    // 验证日期有效性
    if (isNaN(date.getTime())) {
      return timeString
    }

    // 获取日期各部分并格式化为中文
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}年${month}月${day}日`
  } catch (e) {
    console.error('时间格式化错误:', e)
    return timeString
  }
}

// 消息点击处理
const handleMsgClick = (item) => {
  let extraData
  try {
    extraData = JSON.parse(item.extend || '{}')
  } catch (e) {
    console.error('解析扩展数据失败:', e)
  }

  // 根据消息类型处理不同跳转
  if ([1, 2, 4].includes(item.type) && extraData?.orderId) {
    navigateToOrderDetail(extraData.orderId)
  } else if (item.type === 3) {
    goToHomePage()
  } else if (item.type === 5) {
    navigateToChat1()
  } else {
    // 系统消息或其他类型
    navigateToSystemMessageDetail(item)
  }
}

// 弹窗控制
const showConfirmModal = () => {
  message
    .confirm({
      msg: '确定将所有消息标记为已读吗？',
      title: '提示',
      closeOnClickModal: false,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      // 自定义按钮样式（可选）
      confirmButtonColor: '#2F72F6',
      cancelButtonColor: '#666666',
    })
    .then(() => {
      markAllAsRead()
    })
    .catch(() => {
      console.log('用户取消操作')
    })
}

// 标记全部已读
const markAllAsRead = async () => {
  try {
    const res = await getMsgReadAll()
    console.log(res)
    if (res.code === '000') {
      uni.hideTabBarRedDot({ index: 2 })
      tabbarStore.setUnreadCount(0)
      refreshList()
      // 显示操作成功的提示
      uni.showToast({ title: '已全部标记为已读', icon: 'success' })
    }
  } catch (error) {
    console.error('标记全部已读失败:', error)
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

// 导航方法
const navigateToOrderDetail = (orderId) => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/orderDetail?orderId=${orderId}`,
  })
}

const goToHomePage = () => {
  tabbarStore.setCurIdx(0)
  uni.switchTab({
    url: '/pages/home/index',
  })
}

const navigateToChat = () => {
  uni.navigateTo({
    url: '/pages-sub/mine/order/orderDetail',
  })
}

const navigateToChat1 = () => {
  uni.navigateTo({
    url: '/pages-sub/service/chat/chatPage',
  })
}

const navigateToSystemMessageDetail = (item) => {
  uni.navigateTo({
    url: `/pages/message/detail?id=${item.id}`,
  })
}
</script>

<style lang="scss" scoped>
button::after {
  border: none;
}
.page-container,
.message-container {
  height: 82vh; /* 占满视口高度 */
}
.page-container {
  position: relative;
  width: 100%;
}

.background-image {
  position: fixed; /* 或 absolute，结合 .page-container 设 position:relative */
  top: 0;
  left: 0;
  width: 100%;
  height: 30vh; /* 设定高度 */
  z-index: 0;
  object-fit: cover; /* 等价于 background-size:cover */
  pointer-events: none; /* 防止挡住点击 */
}

.message-container {
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 50rpx 50rpx 0 0;
    margin-top: 200rpx;
    z-index: 2; /* 确保在背景图片之上 */
  }
}

.scroll-area {
  flex: 1; /* 关键属性，撑满剩余空间 */
  overflow: hidden; /* 修复滚动异常 */
  overflow-anchor: auto;
}

.read-msg-view {
  width: 100%;
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 200rpx 10rpx 24rpx;
}

.msg-text {
  font-size: 40rpx;
  color: #111;
  line-height: 47rpx;
  font-weight: bold;
  margin-left: 20rpx;
}

.read-all-view {
  width: 176rpx;
  height: 64rpx;
  background-color: #2f72f6;
  border-radius: 12rpx;
  border: 2rpx solid #2f72f6;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  font-weight: 400;
  font-size: 24rpx;
  color: #ffffff;
  line-height: 64rpx;
}

.msg-view {
  width: 100%;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.msg-time-view {
  width: 200rpx;
  height: 40rpx;
  background: #fafbfa;
  border-radius: 25rpx;
  align-items: center;
  justify-content: center;
  padding-left: 10rpx;
  padding-right: 10rpx;

  font-size: 24rpx;
  text-align: center;
  font-weight: 400;
  color: #acacac;
  line-height: 40rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.msg-container {
  width: 80%;
  min-height: 200rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin-top: 24rpx;
  padding: 28rpx;
}

.msg-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2e2e2e;
  line-height: 33rpx;
}

.msg-content {
  margin-top: 20rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #a0a0a0;
  line-height: 33rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.msg-line {
  height: 1rpx;
  width: 100%;
  margin-top: 28rpx;
  background-color: #eeeeee;
}

.msg-box {
  height: 60rpx;
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.msg-details-title {
  font-size: 28rpx;
  font-weight: 400;
  color: #424242;
  line-height: 60rpx;
}

.msg-details-icon {
  display: flex;
  align-items: center;
  width: 60rpx;
  height: 60rpx;
}

/* 新增返回顶部按钮样式 */
.back-top {
  position: fixed;
  right: 30rpx;
  bottom: 150rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #a0a0a0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s;

  &:active {
    transform: scale(0.95);
    background-color: #2f72f6;
  }
}

/* 空状态样式 */
.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-image {
    width: 300rpx;
    height: 300rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #a0a7b8;
    margin-top: 40rpx;
  }
}

/* 加载状态 */
.loading-view,
.no-more-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 30rpx;
}

/* 弹窗样式 */
.modal-content {
  padding: 30rpx;
  font-size: 28rpx;
  color: #666;
  text-align: center;
  line-height: 1.8;
}

.modal-buttons {
  display: flex;
  border-top: 1rpx solid #f0f0f0;

  .modal-btn {
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32rpx;
    background: #fff;
    border-radius: 0;
    padding: 0;
    margin: 0;

    &::after {
      border: none;
    }
  }

  .cancel-btn {
    color: #333;
    border-right: 1rpx solid #f0f0f0;
  }

  .confirm-btn {
    color: #2f72f6;
  }
}
.box {
  width: 80vw;
}
.popup {
  background-color: #ffffff;
  flex: 1;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.popup-cancel {
  color: #c3c3c3;
}
.popup-confirm {
  color: #2f72f6;
}
.popup-text {
  text-align: center;
  margin: 20px;
}
.popup-view {
  display: flex;
  border-top: #dedede solid 1px;
  padding: 2px 0;
}
</style>
