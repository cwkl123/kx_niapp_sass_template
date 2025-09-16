<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '服务',
  },
}
</route>
<template>
  <view class="container">
    <view class="top" :style="{ backgroundColor: themeColor }">
      <view class="top-bg" :style="{ backgroundColor: themeColor }"></view>
      <view class="logo flex" @click="goBack">
        <view class="flex center">
          <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
          <span style="color: white; font-size: 18px">华泾镇</span>
        </view>
        <view>
          <image src="/static/images/home.icon.zf.png" mode="widthFix" style="width: 20rpx"></image>
        </view>
      </view>
    </view>
    <!-- <view
      class="header"
      :style="{ paddingTop: statusBarHeight + 'px', backgroundColor: themeColor }"
    ></view>
    <view class="nav-bar" :style="{ backgroundColor: themeColor }" @click="goBack">
      <view class="flex center">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <span style="color: white; font-size: 18px">华泾镇</span>
      </view>
    </view> -->
    <scroll-view :scroll-y="true" style="height: calc(100vh - 296rpx)" class="scroll-box">
      <view :style="`background: linear-gradient(to bottom, ${themeColor} 0%, #2f72f600 300rpx)`">
        <view class="banner-container">
          <swiper class="banner-swiper" autoplay circular>
            <swiper-item v-for="(item, index) in banner" :key="index">
              <image class="banner-image" :src="getImage(item)" mode="aspectFill" />
            </swiper-item>
            <swiper-item v-if="!banner || banner.length === 0">
              <image class="banner-image" :src="getImage(defaultBanner)" mode="aspectFill" />
            </swiper-item>
          </swiper>
          <view class="banner-indicator" v-if="!banner || banner.length === 0">商品 1/1</view>
          <view class="banner-indicator" v-else>
            商品 {{ currentBannerIndex + 1 }}/{{ banner.length }}
          </view>
        </view>

        <!-- 价格区 -->
        <view
          class="price-section"
          v-if="!isLoading"
          :style="{
            background: `linear-gradient(${getLightenedColor(themeColor, 0.3)}, ${themeColor})`,
          }"
        >
          <view class="price-row">
            <view class="price-main">
              <text class="price-unit">¥</text>
              <text class="price-number">{{ formatPrice(serveInfo?.price) }}</text>
              <text class="price-unit">元起</text>
            </view>
            <view class="coupon-price" v-if="hasUsableCoupon">
              <text class="coupon-text">券后价￥</text>
              <text class="coupon-number">{{ formatPrice(couponPrice) }}</text>
              <text class="coupon-unit">元起</text>
            </view>
            <image src="/static/images/service/house.png" class="brand-logo" mode="aspectFit" />
          </view>
          <view class="sale-info">
            <text class="sold-count">已售{{ sale }}+</text>
            <!-- <text class="coupon-info" v-if="hasUsableCoupon">| 券·立减{{ formatPrice(CouponList[0]?.discountAmount || 0) }}</text> -->
            <text class="coupon-info" v-if="hasUsableCoupon">| 券{{ couponDiscountText }}</text>
          </view>
        </view>

        <!-- 服务信息区 -->
        <view class="service-section" v-if="!isLoading">
          <view class="service-title">{{ serveItemInfo.serviceTitle }}</view>
          <view class="service-tags">
            <view class="red-tag">
              <view class="tag-hole"></view>
              <text class="tag-text">
                共{{ serveItemInfo?.specificationRule?.length || 0 }}种服务规格
              </text>
            </view>
            <view class="tag top-sales">销量TOP3</view>
            <view class="tag service-time">服务时间:{{ serveInfo.serveTime }}</view>
          </view>

          <view class="coupon-list">
            <view class="talk-top">
              <view class="talk-top-left">
                <image
                  src="/static/images/home/icon/talk.png"
                  style="width: 40rpx; height: 40rpx; margin-right: 20rpx"
                ></image>
                <view>评价（{{ commentCount }}）</view>
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

          <view class="custom-section">
            <view class="tabs-container">
              <view
                v-for="(tab, index) in tabList"
                :key="index"
                class="custom-tag"
                :class="{
                  'active-blue': activeTab === index && (index === 0 || index === 2),
                  'active-white': activeTab === index && index === 1,
                }"
                @click="switchTab(index)"
              >
                <text class="tag-text">{{ tab.name }}</text>
                <view class="tag-indicator"></view>
              </view>
            </view>

            <!-- 内容区 -->
            <view class="custom-content-wrapper">
              <view
                v-if="activeTab == 0"
                v-html="serveItemInfo.describe"
                class="content-page"
                :class="{
                  'active-blue-bg': activeTab === 0 || activeTab === 2,
                  'active-white-bg': activeTab === 1,
                }"
              >
                <view class="detail-content" v-html="serviceData.detail"></view>
              </view>
              <view
                v-if="activeTab === 1"
                class="content-page"
                :class="{
                  'active-blue-bg': activeTab === 0 || activeTab === 2,
                  'active-white-bg': activeTab === 1,
                }"
              >
                <view
                  class="price-table-container"
                  v-if="serveItemInfo.consumableRule && serveItemInfo.consumableRule.length > 0"
                >
                  <view class="table-header">
                    <view class="header-item">材料</view>
                    <view class="header-item">规格</view>
                    <view class="header-item">单位</view>
                    <view class="header-item">材料费</view>
                  </view>

                  <view
                    v-for="(item, index) in serveItemInfo.consumableRule"
                    :key="index"
                    class="table-row"
                  >
                    <view class="row-item name">{{ item.title }}</view>
                    <view class="row-item spec">{{ '\\' }}</view>
                    <view class="row-item unit">{{ item.unit }}</view>
                    <view class="row-item price">￥{{ formatPrice(item.price) }}</view>
                  </view>
                </view>
                <view v-else class="empty-tip">暂无材料信息</view>
              </view>
              <view
                v-if="activeTab === 2"
                v-html="serveItemInfo.safeguard"
                class="content-page"
                :class="{
                  'active-blue-bg': activeTab === 0 || activeTab === 2,
                  'active-white-bg': activeTab === 1,
                }"
              ></view>
            </view>
          </view>

          <view class="fixed-footer">
            <view class="footer-content">
              <image
                src="/static/images/service/cow_hello.png"
                class="footer-cow"
                mode="aspectFit"
              />
              <view class="service-container" @click="ToCustomerService">
                <image src="/static/images/service/kefu.png" class="footer-icon" mode="aspectFit" />
                <text class="footer-text">客服</text>
              </view>
              <button class="footer-button" @click="toShowPopup">立即预约</button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
  <wd-popup
    v-model="showPopup"
    position="bottom"
    custom-style="height:popHeight"
    :safe-area-inset-bottom="true"
  >
    <view class="popup-container">
      <!-- 头部 -->
      <view class="popup-header">
        <text class="popup-title">请选择服务规格</text>
        <text class="popup-subtitle">以下仅为人工费</text>
      </view>

      <!-- 服务列表 -->
      <view class="service-list">
        <scroll-view scroll-y v-if="!isLoading" style="max-height: 50vh">
          <view
            v-for="(item, index) in serveItemInfo.specificationRule"
            :key="index"
            class="service-item"
            :class="{ active: selectedServiceId === item.specId }"
            @click="selectService(item)"
          >
            <text class="service-name">{{ item.name }}</text>
            <text class="service-price">￥{{ formatPrice(item.price) }}</text>
            <text class="service-unit">单位{{ item.unit }}</text>
          </view>
        </scroll-view>
      </view>

      <view class="popup-footer">
        <button class="confirm-button" @click="handleSubmit">立即预约</button>
      </view>
    </view>
  </wd-popup>
  <wd-popup v-model="showLoginModal" custom-style="border-radius:32rpx;">
    <view class="login-popup">
      <view class="popup-content">
        <view class="popup-title">提示</view>
        <view class="popup-message">需要先登录</view>
      </view>
      <view class="popup-footer">
        <button size="mini" class="popup-btn cancel-btn" @click="showLoginModal = false">
          取消
        </button>
        <view class="divider"></view>
        <button size="mini" class="popup-btn confirm-btn" @click="goToLogin">确认</button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { ref } from 'vue'
import { useLoginStore, useUserStore } from '@/store'
import { getServeDetail } from '@/service/serve/serveApi'
import { getCommentCount } from '@/service/serve/serveApi'
import { getServiceCouponCount } from '@/service/coupon/ordercoupon'
import { getServiceCouponList } from '@/service/coupon/ordercoupon'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { generateComments, formatName, startAutoScroll } from '@/service/commentUtils'
let themeColor = inject('themeColor')
let defaultBanner = inject('defaultServiceImg')
// 状态栏高度（模拟）
const statusBarHeight = ref(40)
const serveInfo = ref(null)
const serveItemInfo = ref(null)
const isRental = ref(0)
const loginInfoStore = useLoginStore()
const userStore = useUserStore()
const banner = ref([])
const sale = ref(0)
const showLoginModal = ref(false)
const currentBannerIndex = ref(0)
const activeTab = ref(0)
const commentCount = ref(0)
const usableCouponCount = ref(0)
const availableCount = ref(0)
const canReceiveCount = ref(0)
const CouponList = ref([])
const isLoading = ref(true)
const commentTags = ref([])
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    tabbarStore.setCurIdx(1)
    uni.switchTab({ url: '/pages/service/index' })
  }
}
const pageParam = ref({})
const share = reactive({
  path: '',
})
// 跳转到登录页
const goToLogin = () => {
  showLoginModal.value = false
  tabbarStore.setCurIdx(4)
  uni.switchTab({
    url: '/pages/mine/index',
  })
}
// 检查登录状态的工具方法
const checkLogin = () => {
  if (!loginInfoStore.loginInfo.isLogin) {
    showLoginModal.value = true
    return false
  }
  return true
}
onLoad((d) => {
  pageParam.value = JSON.parse(d.data)
  console.log('onLoad pageParam=', pageParam.value)
  getServeInfo()
  getComment()
  getServiceCoupon()
  getCouponList()
  let path =
    '/pages-sub/service/serviceInfo?data=' +
    JSON.stringify({
      serveItemId: pageParam.value.serveItemId,
      orderId: '',
    })
  console.log('onLoad path=', path)
  share.path =
    'pages/index/home/homePage?data=' +
    JSON.stringify({
      path: encodeURIComponent(path),
    })
  console.log('onLoad share.path =', share.path)
})
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

const getServiceCoupon = async () => {
  if (loginInfoStore.loginInfo.isLogin) {
    const { code, value } = await getServiceCouponCount({
      serviceId: pageParam.value.serveItemId,
      uId: loginInfoStore.loginInfo.isLogin ? userStore.userInfo.uId : 0,
    })
    availableCount.value = value.availableCount
    canReceiveCount.value = value.canReceiveCount
  } else {
    availableCount.value = 0
    canReceiveCount.value = 0
  }
  console.log(9999, availableCount.value, canReceiveCount.value)
}
const getCouponList = async () => {
  if (loginInfoStore.loginInfo.isLogin) {
    const { code, value } = await getServiceCouponList({
      serviceId: pageParam.value.serveItemId,
      uId: loginInfoStore.loginInfo.isLogin ? userStore.userInfo.uId : 0,
    })
    CouponList.value = value
  } else {
    CouponList.value = []
  }
  console.log(4444, CouponList.value)
}
const getComment = async () => {
  const { code, value } = await getCommentCount({
    id: pageParam.value.serveItemId,
  })
  sale.value = Math.max(value?.sale || 0, 20)
  commentCount.value = Math.max(value?.count || 0, 10)
  if (!value.comment || value.comment.length === 0) {
    commentTags.value = [
      { name: '回头客', count: 2 },
      { name: '服务很好', count: 3 },
      { name: '性价比高', count: 1 },
    ]
  } else {
    // 有标签数据时，取前3个标签，确保每个标签有默认值
    commentTags.value = value.comment.slice(0, 3).map((tag, index) => ({
      name: tag.tagName || ['回头客', '服务很好', '性价比高'][index],
      count: tag.tagCount || 0,
    }))
  }
  comments.value = generateComments(10)
  if (stopScroll) stopScroll()
  stopScroll = startAutoScroll({
    currentIndex: currentCommentIndex,
    commentCount: comments.value.length,
    visibleCount: visibleCommentCount,
  })
}
const getServeInfo = async () => {
  isLoading.value = true
  const { code, value } = await getServeDetail({
    serviceId: pageParam.value.serveItemId,
    uId: loginInfoStore.loginInfo.isLogin ? userStore.userInfo.uId : 0,
  })
  console.log('Info', value)

  if (code === '000') {
    serveItemInfo.value = {
      specificationRule: [], // 确保有默认数组
      consumableRule: [],
      ...value.serviceItemInfo, // 覆盖默认值
    }
    serveInfo.value = value

    // 是否为租赁
    isRental.value = serveItemInfo.value.isRental

    if (serveItemInfo.value.banner != null) {
      banner.value = serveItemInfo.value.banner
    }
    popHeight.value = serveItemInfo.value.specificationRule.length > 10 ? '70%' : 'auto'
    usableCouponCount.value = serveInfo.value.usableCouponCount
  }
  isLoading.value = false
}
const getImage = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}

const tabList = ref([{ name: '服务详情' }, { name: '服务价目' }, { name: '服务保障' }])

const switchTab = (index) => {
  activeTab.value = index
}

const ToCustomerService = () => {
  uni.navigateTo({
    url: '/pages-sub/service/chat/chatPage',
  })
}

const currentCommentIndex = ref(0)
const visibleCommentCount = 2 // 每次显示2条评论
const comments = ref([]) // 存储生成的评论数据

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
//分-元
const formatPrice = (priceInCents) => {
  if (priceInCents == null) return '￥0.00'
  return `${(priceInCents / 100).toFixed(2)}`
}

// 计算券后价（支持立减和折扣券）
const couponPrice = computed(() => {
  if (!serveInfo.value || !CouponList.value || CouponList.value.length === 0) {
    return serveInfo.value.price // 没有优惠券返回原价
  }

  // 找出最优优惠券（优先使用折扣最大的）
  const bestCoupon = CouponList.value.reduce(
    (best, coupon) => {
      // 计算当前优惠券的折扣力度
      const currentDiscount =
        coupon.couponType === 3
          ? (serveInfo.value.price * (10 - coupon.discountNumber / 10)) / 10 // 折扣券计算
          : coupon.discountAmount // 立减券直接使用

      // 比较哪个优惠力度更大
      return currentDiscount > best.discount ? { coupon, discount: currentDiscount } : best
    },
    { coupon: null, discount: 0 },
  ).coupon

  // 根据优惠券类型计算券后价
  if (bestCoupon.couponType === 3) {
    // 折扣券：原价 * (折扣/10)
    return Math.round((serveInfo.value.price * bestCoupon.discountNumber) / 100)
  } else {
    // 立减券：原价 - 优惠金额
    const couponPriceInCents = serveInfo.value.price - bestCoupon.discountAmount
    return couponPriceInCents > 0 ? couponPriceInCents : 0
  }
})

// 获取当前使用的优惠券信息（用于显示）
const currentCoupon = computed(() => {
  if (!CouponList.value || CouponList.value.length === 0) return null

  return CouponList.value.reduce(
    (best, coupon) => {
      const currentDiscount =
        coupon.couponType === 3
          ? (serveInfo.value.price * (10 - coupon.discountNumber / 10)) / 10
          : coupon.discountAmount
      return currentDiscount > best.discount ? { ...coupon, discount: currentDiscount } : best
    },
    { discount: 0 },
  )
})
// 优惠券折扣信息显示
const couponDiscountText = computed(() => {
  if (!currentCoupon.value) return ''

  if (currentCoupon.value.couponType === 3) {
    return `${currentCoupon.value.discountNumber / 10}折`
  } else {
    return `立减${formatPrice(currentCoupon.value.discountAmount)}`
  }
})

// 判断是否有可用优惠券
const hasUsableCoupon = computed(() => {
  return availableCount.value > 0
})
// 控制弹窗显隐
const popHeight = ref(400)
const showPopup = ref(false)
const toShowPopup = () => {
  console.log('按钮点击') // 确认是否执行
  showPopup.value = true
  console.log(showPopup.value) // 应该输出true
}
const selectedServiceId = ref(null)
const isSpecSelected = ref(false)
const selectedService = ref(null)
const selectService = (item) => {
  selectedServiceId.value = item.specId
  isSpecSelected.value = true
  selectedService.value = item
}
// 提交订单处理
const handleSubmit = () => {
  if (!isSpecSelected.value) {
    uni.showToast({
      title: '请先选择规格',
      icon: 'none',
      duration: 2000,
    })
    return
  }
  toConfirm()
}
const toConfirm = () => {
  if (!checkLogin()) {
    return
  }
  const orderParams = {
    serveInfo: serveInfo.value, // 传递整个serveInfo对象
    serveItemInfo: serveItemInfo.value,
    selectedService: selectedService.value, // 传递整个选中的规格对象
    serviceId: pageParam.value.serveItemId,
  }
  uni.navigateTo({
    url: `/pages-sub/service/confirmOrder?data=${encodeURIComponent(JSON.stringify(orderParams))}`,
  })
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

/* 一区：顶部导航栏 */
.header {
  position: relative;
  height: 160rpx;
  padding: 0 30rpx;
  z-index: 0;
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
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
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 85px; /* 与navBarHeight保持一致 */
  z-index: 10000; /* 确保在最上层 */
  display: flex;
  align-items: flex-end;
  padding: 0 15px;
  padding-left: 40rpx;
  padding-bottom: 10px;

  .header-logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: -39px;
  }
}

.banner-container {
  background: #f0f7ff;
  display: flex;
  position: relative;
  z-index: 1;
  border-radius: 16rpx;
  overflow: hidden;
  margin-left: 30rpx;
  margin-right: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);

  .banner-swiper {
    height: 500rpx;

    .banner-image {
      width: 100%;
      height: 100%;
    }
  }

  .banner-indicator {
    position: absolute;
    right: 30rpx;
    bottom: 30rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    z-index: 1;
  }
}

/* 三区：价格区 */
.price-section {
  margin: -65px 30rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  position: relative;
  z-index: 2;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  color: #fff; /* 默认文字颜色为白色 */

  .price-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .price-main {
      display: flex;
      align-items: flex-end;
    }

    .price-number {
      font-size: 56rpx; /* 放大数字 */
      font-weight: bold;
      line-height: 1;
      margin-right: 4rpx;
      margin-left: 4rpx;
    }

    .price-unit {
      font-size: 28rpx; /* 缩小单位 */
      line-height: 1.2;
      opacity: 0.9;
    }
    .current-price {
      color: #fff; /* 修改为白色 */
      font-size: 48rpx;
      font-weight: bold;
    }

    .coupon-price {
      background: #e6f1f8; /* 券后价背景色 */
      color: #2974d8; /* 券后价文字颜色 */

      padding: 6rpx 25rpx;
      border-radius: 30rpx;
      margin-left: 20rpx;
      display: flex;
      align-items: center;
    }
    .coupon-text {
      font-size: 24rpx;

      margin-right: 4rpx;
    }

    .coupon-number {
      font-size: 32rpx; /* 突出显示价格数字 */
    }

    .coupon-unit {
      font-size: 24rpx;

      opacity: 0.9;
    }
    .brand-logo {
      position: absolute;
      right: 20rpx;
      bottom: 38rpx;
      width: 100rpx;
      height: 100rpx;
    }
  }

  .sale-info {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);

    .coupon-info {
      color: #fff;
      margin: 0 20rpx;
    }

    .buyers-count {
      margin-left: auto;
    }
  }
}

/* 四区：服务信息 */
.service-section {
  background: #fefefe;
  margin: -20rpx 30rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  position: relative;
  z-index: 10;

  .service-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .service-tags {
    display: flex;
    flex-wrap: nowrap; /* 保证一行展示 */
    align-items: center;
    gap: 12rpx; /* 统一间距 */
    margin-bottom: 20rpx;

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
  }

  .coupon-list {
    background: #fff;
    border-radius: 20rpx;
    border: 1px solid #f4f4f4;
    color: #595959;
    padding: 30rpx;
    margin: 20rpx 0;
  }
  .coupon-list-text {
    margin-bottom: 20rpx;
  }
  /*评论*/
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
}

.custom-section {
  background-color: #e2f0ff;
  border-radius: 8px;
  overflow: hidden;
  padding: 0rpx;
  margin-top: 20px;

  /* 标签栏容器 */
  .tabs-container {
    display: flex;
    background-color: #e2f0ff; /* 浅蓝色背景 */
    height: 50px;
    align-items: flex-end;
    position: relative;
    margin-top: 5px;
    /* 标签项 */
    .custom-tag {
      flex: 1;
      text-align: center;
      position: relative;
      padding: 8px 0;
    }
    .tag-text {
      font-size: 15px;
      color: #80ccf2; /* 修改为指定颜色 */
      vertical-align: bottom;
    }
  }
  /* 蓝色激活状态 */
  .custom-tag.active-blue {
    background-color: #5aaef8; /* 浅蓝色背景 */
    border-radius: 8px 8px 0 0;
    padding-top: 12px;
    margin-bottom: -1px;
  }
  .active-blue .tag-text {
    color: #ffffff; /* 深蓝色文字 */
    font-weight: bold;
  }
  .active-blue .tag-indicator {
    background-color: #0066cc; /* 深蓝色指示条 */
  }

  /* 白色激活状态 */
  .custom-tag.active-white {
    background-color: white; /* 白色背景 */
    border-radius: 8px 8px 0 0;
    padding-top: 12px;
    margin-bottom: -1px;
  }
  .active-white .tag-text {
    color: #333; /* 深灰色文字 */
    font-weight: bold;
  }
  .active-white .tag-indicator {
    background-color: #333; /* 深灰色指示条 */
  }

  /* 内容区背景色 */
  .content-page {
    border-radius: 0 0 8px 8px;
    padding: 15px;
    min-height: 200px;
  }
  .active-blue-bg {
    background-color: #5aaef8; /* 浅蓝色背景 */
  }
  .active-white-bg {
    background-color: white; /* 白色背景 */
  }
}
/* 服务规格样式 */

.table-header {
  display: flex;
  background-color: #5aaef8;
  border-radius: 10px;
  color: white;
  padding: 15px 0;
  font-weight: bold;
  align-items: center;
  justify-content: center;
}

.header-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  height: 30rpx;
}

.table-row {
  display: flex;
  margin-top: 10rpx;
  padding: 15rpx;
  border-radius: 10px;
  align-items: center;
  background-color: #ecf1f7;
}

.row-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #555555;
  padding: 0 5px;
  &.name {
    text-align: left;
    padding-left: 15px;
  }
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 130rpx;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.footer-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20rpx;
}

.footer-cow {
  width: 200rpx;
  height: 200rpx;
  margin-right: 10rpx;
  margin-bottom: 80rpx;
}
/* 新增客服内容容器 */
.service-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.footer-text {
  font-size: 24rpx;
  color: #333;
  margin-right: 11rpx;
}

.footer-icon {
  width: 40rpx;
  height: 35rpx;
  margin-right: 10rpx;
  margin-bottom: 5rpx;
}

.footer-button {
  background: linear-gradient(#3e95f6, #75c6ff);
  color: white;
  font-size: 30rpx;
  height: 70rpx;
  width: 400rpx;
  line-height: 60rpx;
  border-radius: 50rpx;
  padding: 5rpx 40rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popup-header {
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.popup-subtitle {
  font-size: 12px;
  color: #999;
}

.service-list {
  flex: 1;
  padding: 0 16px;
}

.service-item {
  display: flex;
  justify-content: center;
  height: 20rpx;
  padding: 16px;
  margin-top: 12px;
  border-radius: 30px;
  background-color: #ecf1f7;
  border: 1px solid #eee;
  align-items: center;
  color: #88898b;
  gap: 12px;
  font-size: 14px;
}

.service-item.active {
  border-color: #4080ff;
  background: linear-gradient(#649bff, #4388fd);
  color: #fff;
}
.confirm-button {
  margin-top: 12px;
  width: 90%;
  height: 45px;
  line-height: 48px;
  font-size: 16px;
  color: white;
  background: linear-gradient(#649bff, #4388fd);
  border-radius: 30px;
  border: none;
}
.login-popup {
  width: 80vw;
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;

  .popup-content {
    padding: 30rpx;
    text-align: center;

    .popup-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 16rpx;
    }

    .popup-message {
      font-size: 28rpx;
      color: #666666;
    }
  }

  .popup-footer {
    display: flex;
    height: 88rpx;
    border-top: 1rpx solid #f0f0f0;

    .popup-btn {
      flex: 1;
      height: 100%;
      line-height: 88rpx;
      font-size: 28rpx;
      background: transparent;
      border-radius: 0;
      margin: 0;
      padding: 0;

      &::after {
        border: none;
      }

      &.cancel-btn {
        color: #999999;
      }

      &.confirm-btn {
        color: #2f72f6;
        font-weight: bold;
      }
    }

    .divider {
      width: 1rpx;
      height: 100%;
      background-color: #dedede;
    }
  }
}
</style>
