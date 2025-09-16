<!--
 * @Author: August_rush
 * @Date: 2025-06-17 16:05:01
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-10 17:33:07
 * @FilePath: \huijiashenghuo_uniapp\src\pages\mine\index.vue
 * @Description:
 *
-->
<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="profile-container">
    <!-- <image :src="'/static/images/mine/topBackground.png'" /> -->
    <view
      class="image-view"
      :style="`background: linear-gradient(180deg, ${themeColor} 40%, #2f72f600 80%)`"
    ></view>
    <view style="position: relative; z-index: 1; height: 100%">
      <!-- 顶部用户信息 -->
      <view class="user-header" @click="showLogin">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFit" />
        <view class="user-info">
          <view class="user-name">
            <span>{{ userInfo.name }}</span>
            <image
              v-if="couponInfo.type == 1 || couponInfo.type == 0"
              :src="couponInfo.individualIcon"
              class="image-card"
              mode=" aspectFit  widthFix"
            ></image>
            <image
              v-if="couponInfo.type == 2 || couponInfo.type == 0"
              :src="couponInfo.enterpriseIcon"
              class="image-card"
              mode=" aspectFit  widthFix"
            ></image>
          </view>
          <text class="user-phone">{{ userInfo.phone }}</text>
        </view>
      </view>

      <view class="content">
        <image
          :src="imagePaths.cardBackground"
          style="position: absolute; width: 100%; height: 100%"
        />
        <!-- 订单状态 -->
        <view class="order-container">
          <view
            class="order-item"
            v-for="(order, index) in orderStatus"
            :key="index"
            @click="toOrder(index)"
          >
            <view class="order-icon-wrap">
              <image class="order-icon" :src="order.icon" />
              <view class="badge" v-if="order.badge">{{ order.badge }}</view>
            </view>
            <text class="order-text">{{ order.text }}</text>
          </view>
        </view>

        <view class="card-row">
          <!-- 服务地址卡片（占左半边） -->
          <view class="card address-card">
            <view class="menu-item" @click="toAddress">
              <image class="menu-icon" :src="ServiceAddress.icon" style="height: 60rpx" />
              <view class="text-container">
                <text class="menu-text">{{ ServiceAddress.text }}</text>
                <text
                  class="menu-tip"
                  v-if="ServiceAddress.tip && loginInfoStore.loginInfo.isLogin"
                >
                  共{{ ServiceAddress.tip }}个地址
                </text>
                <text class="menu-tip" v-else>暂无地址</text>
              </view>
              <image class="menu-arrow" :src="imagePaths.arrowRight" />
            </view>
            <view class="buttons-container">
              <button class="address-button" @click="toAddress">
                {{ ServiceAddress.button1 }}
              </button>
              <button class="address-button" @click="toaddAddress">
                {{ ServiceAddress.button2 }}
              </button>
            </view>
          </view>

          <!-- 右半边的优惠券和卡包卡片 -->
          <view class="right-cards">
            <!-- 优惠券卡片（占右半边顶部） -->
            <view class="card coupon-card" @click="toCouponList">
              <view class="menu-item">
                <image class="menu-icon" :src="Coupon.icon" />
                <text class="menu-text">{{ Coupon.text }}</text>
                <text class="menu-tip1" v-if="Coupon.tip && loginInfoStore.loginInfo.isLogin">
                  {{ Coupon.tip }}张可用
                </text>
                <text class="menu-tip" v-else>暂无可用</text>
                <image class="menu-arrow" :src="imagePaths.arrowRight" />
              </view>
            </view>

            <!-- 卡包卡片（占右半边底部） -->
            <view class="card wallet-card" @click="toCard">
              <view class="menu-item">
                <image class="menu-icon" :src="Card.icon" />
                <text class="menu-text">{{ Card.text }}</text>
                <text class="menu-tip1" v-if="Card.tip && loginInfoStore.loginInfo.isLogin">
                  {{ Card.tip }}张可用
                </text>
                <text class="menu-tip" v-else>暂无可用</text>
                <image class="menu-arrow" :src="imagePaths.arrowRight" />
              </view>
            </view>
          </view>
        </view>
        <!-- 邀请码卡片 -->
        <view class="card card2" @click="toInvite">
          <view class="menu-item">
            <image class="menu-icon" :src="imagePaths.iconInvite" />
            <text class="menu-text" style="padding-left: 40rpx">{{ Invite }}</text>
            <image class="menu-arrow" :src="imagePaths.arrowRight" />
          </view>
        </view>
        <!-- 绑定手机号 -->
        <view class="card card2" @click="showBindPhone" v-if="loginInfoStore.loginInfo.isBind">
          <view class="menu-item">
            <image class="menu-icon" :src="imagePaths.iconBindPhone" />
            <text class="menu-text" style="padding-left: 40rpx">{{ bindPhone }}</text>
            <text class="menu-tip2">获取手机号</text>
          </view>
        </view>

        <!-- 退出登录卡片 -->
        <view class="card card2" @click="showLogout" v-if="loginInfoStore.loginInfo.isLogin">
          <view class="menu-item">
            <image class="menu-icon" :src="imagePaths.iconLogout" />
            <text class="menu-text" style="padding-left: 40rpx">
              {{ logoutText }}
            </text>
            <image class="menu-arrow" :src="imagePaths.arrowRight" />
          </view>
        </view>

        <!-- 招募 -->
        <view @click="onRecruiters" class="recruiters">
          <image :src="imagePaths.recruiters" style="height: 100%; width: 100%" />
        </view>
      </view>
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
import { ref } from 'vue'
import { getSafeAreaInsets } from '@/utils'
import { useLoginStore, useUserStore, useConfigStore } from '@/store'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { getWXPhone, getWxUserInfo } from '@/service/base/loginApi'
import { getOrderCount, getUpdateOrder, updateOrderBatch } from '@/service/order/orderApi'
import { getUserGiftCount, requestUserGiftsTag } from '@/service/gifts/giftsApi'
import { findAddressCount } from '@/service/base/addressApi'
import { receiveDiscount } from '@/service/coupon/ordercoupon'
import { bindInviteUser } from '@/service/code/codeApi'
import { getMsgCount } from '@/service/msg/msgApi'

const loginInfoStore = useLoginStore()
const userStore = useUserStore()
const configStore = useConfigStore()
let themeColor = inject('themeColor')
const loginSuccessBack = ref(false)
const couponId = ref(null)
const inviteCode = ref(null)
const showModel = ref(false)
const showModelParam = ref(false)
const showModelLogout = ref(false)
const orderCount = ref()
const giftCount = ref()
const couponInfo = ref({
  type: -1, //-1:普通  0:个人&企业 , 1:个人，2:企业
  individualIcon: '/static/images/mine/user_individual_icon.png',
  enterpriseIcon: '/static/images/mine/user_enterprise_icon.png',
})
const { safeAreaInsets } = getSafeAreaInsets()

// 所有图片路径
const imagePaths = ref({
  orderPending: '/static/images/mine/index/order_waiting_icon.png',
  orderService: '/static/images/mine/index/order_wait_served_icon.png',
  orderPayment: '/static/images/mine/index/order_wait_pay_icon.png',
  orderComment: '/static/images/mine/index/order_wait_evaluated_icon.png',
  orderAll: '/static/images/mine/index/order_all_icon.png',
  arrowRight: '/static/images/mine/index/close-icon.png',
  iconAddress: '/static/images/mine/index/address_icon.png',
  iconCoupon: '/static/images/mine/index/coupon_icon.png',
  iconCard: '/static/images/mine/index/card_icon.png',
  iconInvite: '/static/images/mine/index/invite_icon.png',
  iconBindPhone: '/static/images/mine/index/bindPhone.png',
  iconLogout: '/static/images/mine/index/logout_icon.png',
  cardBackground: '/static/images/mine/index/card_background.png',
  recruiters: '/static/images/mine/index/mine_recruiters_bg.png',
})
const defaultAvatar =
  'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
const imgUrl = import.meta.env.VITE_UPLOAD_BASEURL
// 用户信息
const userInfo = ref({
  name: '未登录',
  phone: '登录后享受更多服务',
  avatar: defaultAvatar,
})

// 订单状态信息
const orderStatus = ref([
  {
    text: '待接单',
    icon: imagePaths.value.orderPending,
    badge: 0,
    tabIndex: 1, // 在订单页面对应第二个Tab（索引1）
    action: () => toOrderWithTab(1),
  },
  {
    text: '待服务',
    icon: imagePaths.value.orderService,
    badge: 0,
    tabIndex: 2, // 对应第三个Tab（索引2）
    action: () => toOrderWithTab(2),
  },
  {
    text: '待支付',
    icon: imagePaths.value.orderPayment,
    badge: 0,
    tabIndex: 3, // 对应第四个Tab（索引3）
    action: () => toOrderWithTab(3),
  },
  {
    text: '待评价',
    icon: imagePaths.value.orderComment,
    badge: 0,
    tabIndex: 4, // 对应第五个Tab（索引4）
    action: () => toOrderWithTab(4),
  },
  {
    text: '全部订单',
    icon: imagePaths.value.orderAll,
    badge: null,
    tabIndex: 0, // 对应第一个Tab（索引0）
    action: () => toOrderWithTab(0),
  },
])
const ServiceAddress = ref({
  text: '服务地址',
  icon: imagePaths.value.iconAddress,
  tip: null,
  button1: '编辑地址',
  button2: '新添地址',
})
const Coupon = ref({
  text: '优惠券',
  icon: imagePaths.value.iconCoupon,
  tip: 0,
})
const Card = ref({
  text: '卡包',
  icon: imagePaths.value.iconCard,
  tip: 0,
})
const Invite = ref('邀请码')
const bindPhone = ref('绑定手机号')
const logoutText = ref('退出登录')
const showLogout = () => {
  showModelLogout.value = true
}
// 退出登录方法
const logout = () => {
  loginInfoStore.loginOut()
  couponInfo.value.type = -1
  tabbarStore.setUnreadCount(0)
  userInfo.value.name = '未登录'
  userInfo.value.phone = '登录后享受更多服务'
  userInfo.value.avatar = defaultAvatar
  for (const i of orderStatus.value) {
    i.badge = null
  }
  couponId.value = null
  inviteCode.value = null
  showModelLogout.value = false
}
const getQueryString = (url, name) => {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null
}
onLoad((query) => {
  console.log('onLoad query=', query)
  if (!query || Object.keys(query).length === 0) return
  let qrCode = decodeURIComponent(query.q)
  console.log('onLoad 二维码原始链接=' + qrCode)

  if (qrCode !== 'undefined') {
    console.log('onLoad is not undefined')
    let _couponId = getQueryString(qrCode, 'couponId')
    console.log('onLoad 二维码参数 _couponId=' + _couponId)
    let _inviteCode = getQueryString(qrCode, 'inviteCode')
    console.log('onLoad 二维码参数 _inviteCode=' + _inviteCode)
    if (_couponId !== null) {
      if (loginInfoStore.loginInfo.isLogin) {
        ReceiveDiscount(_couponId)
      } else {
        couponId.value = _couponId
      }
    }
    if (_inviteCode !== null) {
      if (loginInfoStore.loginInfo.isLogin) {
        bindInviteUser(_inviteCode)
      } else {
        inviteCode.value = _inviteCode
      }
    }
  }
})
const getTopUserInfo = async (data) => {
  if (data.nickName) {
    userInfo.value.name = data.nickName
  }
  if (data.avatar) {
    userInfo.value.avatar = data.avatar
  }
  if (data.phone) {
    userInfo.value.phone = data.phone
  } else {
    userInfo.value.phone = '未绑定手机号'
  }
  if (data.avatar == defaultAvatar) {
    userInfo.value.avatar = '/static/images/mine/index/user_images.png'
  } else {
    userInfo.value.avatar = imgUrl + data.avatar
  }
}
onShow(async () => {
  configStore.fetchConfig()
  if (loginInfoStore.loginInfo.isLogin) {
    refreshWxUserInfo()
    GetOrderCount()
    GetUserGiftCount()
    GetAddressCount()
    RequestUserGiftsTag()
    GetUpdateOrder()
    console.log('1', userStore.userInfo)
    if (userStore.userInfo) {
      getTopUserInfo(userStore.userInfo)
    }
  } else {
    if (loginInfoStore.loginInfo.isBind) {
      userInfo.value.name = '未知'
      userInfo.value.phone = '未绑定手机号'
    } else {
      userInfo.value.name = '未登录'
      userInfo.value.phone = '登录后享受更多服务'
    }
    userInfo.value.avatar = defaultAvatar
    showLogin()
    loginSuccessBack.value = uni.getStorageSync('LOGIN_SUCCESS_BACK')
    console.log('onShow  LOGIN_SUCCESS_BACK:', loginSuccessBack.value)
  }
})
// 确认登录弹窗
const showLogin = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showModelParam.value = true
  } else {
    uni.navigateTo({
      url: '/pages-sub/mine/info',
    })
  }
}
// 获取微信信息
const getUserInfo = () => {
  showModelParam.value = false
  wx.getUserProfile({
    desc: '用于完善用户基本信息',
    success: (wxUserData) => {
      console.log('获取微信用户信息成功', wxUserData)
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
      userInfo.value.avatar = imgUrl + userStore.userInfo.avatar
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
  }
}
// 登录信息
const register = async (data, phone) => {
  await checkSession()
  const res = await loginInfoStore.regLogin(phone)
  if (res) {
    getTopUserInfo(userStore.userInfo)
    if (userStore.userInfo.phone) {
      Coupon.value.tip = userStore.userInfo.couponCount
    }
    GetOrderCount()
    GetUserGiftCount()
    GetAddressCount()
    ReceiveDiscount(couponId.value)
    BindInviteUser(inviteCode.value)
    GetUpdateOrder()
    getUnRead()
    RequestUserGiftsTag()
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
// 订单状态计数
const GetOrderCount = async () => {
  let { code, value } = await getOrderCount()
  if (code == '000') {
    console.log('orderCount', value)
    orderStatus.value[0].badge = value.newOrder
    orderStatus.value[1].badge = value.toBeServed
    orderStatus.value[2].badge = value.toBePaid
    orderStatus.value[3].badge = value.completed
  }
}
const ReceiveDiscount = async (couponId) => {
  if (couponId == null) {
    return
  }
  let _requestInfo = [couponId]
  let { code, value } = receiveDiscount({
    cIds: _requestInfo,
  })
  if (code == '000') {
    refreshWxUserInfo()
  }
  couponId.value = null
}
// 用户信息
const refreshWxUserInfo = async () => {
  let { code, value } = await getWxUserInfo({
    showLoading: false,
  })
  if (code == '000') {
    Coupon.value.tip = value.couponCount
    userStore.setUserInfo(value)
  }
}
const BindInviteUser = async (InviteCode) => {
  if (InviteCode == null) {
    return
  }
  let { code, res } = await bindInviteUser({
    inviteCode: InviteCode,
  })
  if (code == '000') {
    console.log('bindInviteUser 绑定邀请码成功 res=' + res)
  }
  inviteCode.value = null
}
const getUnRead = async () => {
  const res = await getMsgCount()
  console.log('消息', res.value.count)
  if (res?.value?.count > 0) {
    tabbarStore.setUnreadCount(res.value.count)
  } else {
    tabbarStore.setUnreadCount(0)
  }
}

// 礼包标签
const RequestUserGiftsTag = async () => {
  let { code, value } = await requestUserGiftsTag()
  if (code == '000') {
    if (value.personal == 1 && value.company == 1) {
      couponInfo.value.type = 0
    } else if (value.personal == 1) {
      couponInfo.value.type = 1
    } else if (value.company == 1) {
      couponInfo.value.type = 2
    } else {
      couponInfo.value.type = -1
    }
  }
  console.log(`couponInfo.value.type`, couponInfo.value.type)
}
// 我的地址礼包计数
const GetUserGiftCount = async () => {
  let { code, value } = await getUserGiftCount()
  if (code == '000') {
    Card.value.tip = value.count
  }
}
// 我的地址计数
const GetAddressCount = async () => {
  let { code, value } = await findAddressCount({
    uId: userStore.userInfo.uId,
  })
  if (code == '000') {
    ServiceAddress.value.tip = value
  }
}
// 检测变更订单
const GetUpdateOrder = async () => {
  let { code, value } = await getUpdateOrder()
  if (code == '000') {
    if (value.length > 0) {
      uni.showModal({
        title: '订单信息变更',
        content: '是否前往查看？',
        confirmText: '查看',
        success: async (res) => {
          if (res.confirm) {
            value.forEach((i) => {
              i.isUpdate = 0
            })
            await updateOrderBatch(value)
            uni.navigateTo({
              url: '/pages-sub/mine/order/orderDetail?orderId=' + value[0].orderId,
            })
          }
        },
      })
    }
  }
}

// 跳转到我的订单页面
const toOrder = (tabIndex) => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  if (tabIndex == 4) {
    tabIndex = 0
  } else {
    tabIndex += 1
  }
  uni.navigateTo({
    url: `/pages-sub/mine/order/orderList?tabIndex=${tabIndex}`,
  })
}

// 跳转到地址页面
const toAddress = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: '/pages-sub/mine/address/mineAddressPage',
  })
}

// 跳转到新添地址页面
const toaddAddress = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: '/pages-sub/mine/address/addAddress',
  })
}

// 跳转到优惠券列表
const toCouponList = (index) => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: `/pages-sub/mine/coupon`,
  })
}

// 跳转到卡包页面
const toCard = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: '/pages-sub/mine/gift',
  })
}

//跳转到邀请页面
const toInvite = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: '/pages-sub/mine/mineInvite',
  })
}

//跳转到招募
const onRecruiters = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLogin()
    return
  }
  uni.navigateTo({
    url: '/pages-sub/mine/onRecruiters',
  })
}
</script>

<style lang="scss" scoped>
.image-view {
  position: absolute;
  width: 100%;
  height: 350px;
  z-index: 0;
}
.profile-container {
  position: relative;
}

.content {
  position: relative;

  &-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 800rpx;
    height: 1000rpx;
    z-index: -1;
    border-radius: 20rpx; // 保持和卡片相同的圆角
    overflow: hidden; // 圆角裁切
  }
}

.user-header {
  padding: 80px 40rpx 40rpx 40rpx;
  display: flex;
  align-items: center;

  .avatar {
    width: 150rpx;
    height: 150rpx;
    // margin-bottom: 10px;
    border-radius: 50%;
    background-color: #fff;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
  }

  .user-info {
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;

    .user-name {
      font-size: 40rpx;
      color: #fff;
      font-weight: bold;
      display: flex;
      align-items: center;
    }

    .user-phone {
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 10rpx;
    }
  }
}

.order-container {
  display: flex;
  margin: 0 30rpx;
  border-radius: 20rpx;
  padding: 60rpx 0 10rpx 0;

  .order-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .order-icon-wrap {
      position: relative;
    }

    .order-icon {
      width: 100rpx;
      height: 100rpx;
    }

    .badge {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      min-width: 36rpx;
      height: 36rpx;
      background-color: #ff4444;
      border-radius: 18rpx;
      color: white;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }

    .order-text {
      font-size: 15px;
      font-weight: 400;
      color: #000000;
      margin-top: 15rpx;
    }
  }
}

.card2 {
  margin: 30rpx;
}

.card {
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 20rpx 20rpx rgba(0, 0, 0, 0.05);

  .section-header {
    display: flex;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f1f1f1;

    .section-title {
      font-size: 38rpx;
      color: #333;
      font-weight: bold;
    }

    .service-id {
      font-size: 28rpx;
      color: #999;
    }
  }

  .service-item {
    display: flex;
    align-items: center;
    padding: 30rpx;

    .service-date {
      font-size: 32rpx;
      color: #ff7c4f;
      font-weight: bold;
    }

    .divider {
      margin: 0 20rpx;
      color: #ddd;
    }

    .service-name {
      font-size: 30rpx;
      color: #333;
    }
  }

  .status-bar {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx 40rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      top: 50%;
      height: 4rpx;
      background-color: #f1f1f1;
      z-index: 1;
    }

    .status-item {
      font-size: 26rpx;
      color: #999;
      padding: 0 10rpx;
      background-color: #fff;
      position: relative;
      z-index: 2;

      &.active {
        color: #007aff;
        font-weight: bold;
      }
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding-left: 30rpx;
    position: relative;

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

    .menu-icon {
      width: 60rpx;
      height: 50rpx;
      margin-right: 10rpx;
    }

    .menu-text {
      flex: 1;
      font-weight: 500;
      font-size: 30rpx;
      color: #333;
    }

    .menu-tip {
      font-size: 25rpx;
      color: #999;
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

    .menu-tip2 {
      font-size: 26rpx;
      background-color: #2f72f6;
      color: #ffffff;
      margin-right: 16rpx;
      border-radius: 6px;
      padding: 6px 10px;
    }

    .menu-arrow {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }
  }
}

.recruit-card {
  height: 220rpx;
  margin: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;

  .recruit-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .recruit-title {
    position: absolute;
    top: 40rpx;
    left: 40rpx;
    font-size: 36rpx;
    color: #fff;
    font-weight: bold;
  }

  .recruit-subtitle {
    position: absolute;
    top: 90rpx;
    left: 40rpx;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
  }

  .recruit-button {
    position: absolute;
    bottom: 40rpx;
    right: 40rpx;
    background-color: #fff;
    color: #007aff;
    font-size: 28rpx;
    padding: 8rpx 30rpx;
    border-radius: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.card-row {
  display: flex;
  justify-content: space-between;
  margin: 30rpx;
  gap: 20rpx;

  .address-card,
  .right-cards {
    border-radius: 20rpx;
    overflow: hidden;
  }

  .address-card {
    padding-top: 15rpx;
    width: 42.5%;
    background-color: #fff;
    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);

    .buttons-container {
      display: flex;
      justify-content: space-around;
      padding: 20rpx 10rpx;
    }

    .address-button {
      border-radius: 15rpx;
      flex: 1;
      margin: 0 8rpx;
      background-color: white;
      border: 2rpx solid #007aff;
      color: #000000;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 23rpx;
      text-align: center;
      transition: all 0.3s;
      padding: 0;

      &:active {
        background-color: #e6f0ff;
      }
    }
  }

  .right-cards {
    width: 54.5%;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);

    .coupon-card,
    .wallet-card {
      background-color: #fff;
      flex: 1;
      box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.05);
    }
  }
}

.text-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.box {
  width: 80vw;
}
.image-edit {
  margin-left: 10rpx;
  height: 32rpx;
  width: 32rpx;
}
.image-card {
  margin-left: 10rpx;
  height: 32rpx;
  width: 122rpx;
}

.recruiters {
  position: relative;
  z-index: 10;
  display: flex;
  height: 160rpx;
  align-items: center;
  margin: 30rpx;
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
