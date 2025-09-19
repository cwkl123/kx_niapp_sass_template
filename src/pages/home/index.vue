<!--
 * @Author: August_rush
 * @Date: 2025-06-17 16:05:01
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-19 16:40:04
 * @FilePath: \huijiashenghuo_uniapp\src\pages\home\index.vue
 * @Description:
 *
-->
<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；-->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view>
    <z-paging ref="paGing" refresher-only @onRefresh="onRefresh">
      <view class="top" :style="{ backgroundColor: themeColor }">
        <view class="logo flex">
          <image :src="urlHost(logoImg)" style="width: 260rpx; height: 64rpx"></image>
        </view>
      </view>
      <scroll-view :scroll-y="true" style="height: calc(100vh - 184rpx - 55px)" class="scroll-box">
        <view class="container-view">
          <!-- 轮播图板块 -->
          <view class="header-bg-view">
            <view class="banner-view">
              <swiper class="swiper-view" autoplay="true" circular="true">
                <swiper-item
                  v-for="(item, index) in banner.list"
                  :key="index"
                  @click="navigateToService(item)"
                >
                  <image
                    class="banner-image-view"
                    :src="urlHost(item.url)"
                    mode="aspectFit widthFix"
                    @error="onBannerError(index)"
                  ></image>
                </swiper-item>
              </swiper>
            </view>
          </view>
          <!-- 搜索板块 -->
          <view
            class="search-view-bg"
            :style="`background: linear-gradient(180deg, ${themeColor} 0%, #2f72f600 100%)`"
          >
            <view class="search-view" @click="goSearch">
              <icon class="search-icon-view" type="search" size="14" color="#FFFFFF" />
              <swiper
                @change="handleSwiperChange"
                class="search-swiper"
                autoplay="true"
                circular="true"
                vertical="true"
                interval="2500"
              >
                <swiper-item v-for="(item, index) in search.list" :key="index">
                  <view class="search-swiper-title">
                    {{ item.name }}
                  </view>
                </swiper-item>
              </swiper>
            </view>

            <image class="msg-view" src="/static/images/home/icon/map.png" mode="aspectFit"></image>
          </view>
          <!-- 标签板块 -->
          <view class="notice-view" v-if="homePageConfig && homePageConfig.dynamicTags">
            <view
              class="notice-item-view"
              v-for="(item, index) in homePageConfig.dynamicTags"
              :key="index"
            >
              <image
                src="/static/images/home/icon/safe.png"
                style="width: 36rpx; height: 36rpx"
                mode="scaleToFill"
              />
              <text class="notice-item-text">{{ item }}</text>
            </view>
          </view>
          <!-- plate板块 -->
          <view class="plate-view" v-if="homePageConfig && homePageConfig.plateList">
            <!-- 左侧大方卡 -->
            <view class="card big-card" @click="toCategory(homePageConfig.plateList[0])">
              <image
                class="card-bg"
                :src="urlHost(homePageConfig.plateList[0].backgroundImage[0].url)"
              />
              <view class="card-content">
                <text class="title">{{ homePageConfig.plateList[0].title }}</text>
                <view v-html="homePageConfig.plateList[0].content" class="desc"></view>
              </view>
            </view>

            <!-- 右侧小卡片 -->
            <view
              v-for="(item, i) in homePageConfig.plateList.slice(1)"
              :key="i"
              class="card small-card"
              @click="toCategory(item)"
            >
              <image class="card-bg" :src="urlHost(item.backgroundImage[0].url)" />
              <view class="card-content">
                <text class="title">{{ item.title }}</text>
                <view v-html="item.content" class="desc"></view>
              </view>
            </view>
          </view>
          <!-- 套餐 -->
          <view class="waterfall-container" v-if="gifts.isShow">
            <view class="category-title-box">
              <text class="category-title">{{ gifts.title }}</text>
              <view class="category-title-more" @click="goGiftList()">
                <text>查看更多</text>
                <image
                  src="/static/images/home/icon/go1.png"
                  style="width: 15rpx; height: 30rpx; margin-left: 10rpx"
                ></image>
              </view>
            </view>
            <view class="column-box">
              <view class="column">
                <view
                  v-for="(item, index) in leftList"
                  :key="index"
                  class="package-item"
                  @click="goGiftDetail(item)"
                >
                  <view class="flex center" style="height: 80rpx">
                    <image
                      src="/static/images/home/icon/blue1.png"
                      style="height: 6rpx; width: 50rpx"
                    ></image>
                    <text class="package-text">{{ programName }}服务套餐</text>
                    <image
                      src="/static/images/home/icon/blue2.png"
                      style="height: 6rpx; width: 50rpx"
                    ></image>
                  </view>
                  <image
                    :src="urlHost(item.icon)"
                    mode="scaleToFill"
                    class="package-image-left"
                  ></image>
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
                          <view class="text-grap">
                            官方立减{{ item.originalPrice - item.price }}元
                          </view>
                          <view v-if="item.sales < 400">| 已售{{ item.sales + n + item.id }}</view>
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
              <view class="column">
                <view
                  v-for="(item, index) in rightList"
                  :key="index"
                  class="package-item"
                  @click="goGiftDetail(item)"
                >
                  <view class="flex center" style="height: 80rpx">
                    <image
                      src="/static/images/home/icon/blue1.png"
                      style="height: 6rpx; width: 50rpx"
                    ></image>
                    <text class="package-text">{{ programName }}服务套餐</text>
                    <image
                      src="/static/images/home/icon/blue2.png"
                      style="height: 6rpx; width: 50rpx"
                    ></image>
                  </view>
                  <image
                    :src="urlHost(item.icon)"
                    mode="scaleToFill"
                    class="package-image-right"
                  ></image>
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
                          <view class="text-grap">
                            官方立减{{ item.originalPrice - item.price }}元
                          </view>
                          <view v-if="item.sales < 400">| 已售{{ item.sales + n + item.id }}</view>
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
            </view>
          </view>
        </view>
      </scroll-view>
    </z-paging>
  </view>
  <view>
    <receive-card-view
      :show="card.show"
      :code="card.code"
      @show-change="showChange"
    ></receive-card-view>
  </view>
  <wd-popup v-model="showCouponPopup" custom-style="background: transparent; border-radius: 0;">
    <view class="gb-icon">
      <image class="coupon-img-win" src="/static/images/home/card/couponShowImg.png"></image>
      <button class="btn-y" :hair-line="false" @click="receiveAllCoupon()">立即领取</button>
      <view @click="showCouponPopup = false" class="button-clear"><text class="zfc">×</text></view>
    </view>
  </wd-popup>
  <image
    class="service-tell-view"
    src="/static/images/home/icon/service_tel.png"
    @click="callPhone"
    mode="aspectFit widthFix"
  ></image>
</template>

<script setup>
import { getSafeAreaInsets } from '@/utils'
import { requestAdvertList } from '@/service/base/homeApi'
import { requestGiftsList, getIndexGiftsList } from '@/service/gifts/giftsApi'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { getUpdateOrder, updateOrderBatch, getConfigData } from '@/service/order/orderApi'
import { couponPopUpWindows, receiveDiscount } from '@/service/coupon/ordercoupon'
import { useLoginStore, useConfigStore } from '@/store'
import receiveCardView from './card.vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

let programName = inject('programName')
let themeColor = inject('themeColor')
let logoImg = inject('logoImg')

const configStore = useConfigStore()
onShareAppMessage(() => {
  return {
    title: programName.value,
    path: `/pages/home/index`,
  }
})
onShareTimeline(() => {
  return {
    title: programName.value,
  }
})
const n = Number(import.meta.env.VITE_N)
defineOptions({
  name: 'Home',
})

const loginInfoStore = useLoginStore()
const showCouponPopup = ref(false)
const paGing = ref(null)
// url拼接
const urlHost = (url) => {
  const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
  return baseUploadUrl + url
}
const indexGift = ref([])
const card = ref({ show: false, code: '' })
// 轮播图页码
const bannerChange = (e) => {
  banner.current = e.detail.current
  banner.dotIndex = e.detail.current
}
// 获取屏幕边界到安全区域距离
const { safeAreaInsets, systemInfo } = getSafeAreaInsets()
// 热门搜索词
const search = ref({
  title: '输入关键字搜索维修项',
  list: [
    {
      name: '保洁2小时',
    },
    {
      name: '空调清洗',
    },
    {
      name: '深度保洁',
    },
  ],
})

const homePageConfig = ref()
const gifts = ref({})
// 轮播图
const banner = reactive({
  title: '轮播图',
  list: [],
  current: 0,
  mode: 'round',
  dotsStyles: {
    width: 10,
    height: 10,
    backgroundColor: '#000000',
    border: '1rpx #000000 solid',
    color: '#000000',
    selectedBackgroundColor: '#000000',
    selectedBorder: '1rpx #000000 solid',
    bottom: 10,
  },
  dotIndex: 0,
})

// 礼包详情跳转
const goGiftDetail = (item) => {
  uni.navigateTo({
    url: '/pages-sub/home/giftDetail?id=' + item.id,
  })
}
// 礼包列表跳转
const goGiftList = () => {
  uni.navigateTo({
    url: '/pages-sub/home/giftList?title=' + gifts.value.title,
  })
}
const toCategory = (item) => {
  uni.setStorageSync('cateID_key', item.category)
  tabbarStore.setCurIdx(1)
  uni.switchTab({
    url: '/pages/service/index',
  })
}
const searchKey = ref('')
const handleSwiperChange = (e) => {
  searchKey.value = search.value.list[e.detail.current].name
}
const getMiniData = async () => {
  const param = {
    name: 'miniProgramHomeConfig',
    tenantId: 'wx69fdd1c0ac8f3e90',
  }
  const res = await getConfigData(param)
  if (res.code == '000') {
    const config = JSON.parse(res.value.config)
    homePageConfig.value = config
    homePageConfig.value.plateList = config.plateList.filter((item) => {
      return item.isShow
    })
    gifts.value.title = config.packageConfig.title
    gifts.value.isShow = config.packageConfig.isShow
    gifts.value.num = config.packageConfig.packageShowNum
  }
}
const getRequestAdvertList = async (type) => {
  let requestParam = {
    tenantId: 'wx69fdd1c0ac8f3e90',
    classType: type, //类型 1:轮播图 2:分类 3:推荐 4:腰图
  }
  const res = await requestAdvertList(requestParam)
  if (res.value.total > 0) {
    banner.list = res.value.list
  }
}
// 获取套餐数据
const packageData = ref()
// 套餐数据分配
const leftList = ref([])
const rightList = ref([])

async function distributeItems() {
  leftList.value = []
  rightList.value = []
  for (const index in packageData.value) {
    if (index % 2 == 0) {
      leftList.value.push(packageData.value[index])
    } else {
      rightList.value.push(packageData.value[index])
    }
  }
}
const navigateToService = (item) => {
  if (loginInfoStore.loginInfo.isLogin) {
    if (item.type == 1) {
      if (item.link.includes('http')) {
        uni.navigateTo({
          url: '/pages-sub/home/web?url=' + encodeURIComponent(item.link),
        })
      }
    } else if (item.type == 3) {
      uni.navigateTo({
        url: '/pages-sub/home/giftDetail?id=' + item.link,
      })
    } else if (item.type == 2) {
      uni.navigateTo({
        url: `/pages-sub/service/serviceInfo?data=${JSON.stringify({
          serveItemId: item.link,
          orderId: '',
        })}`,
      })
    }
  } else {
    tabbarStore.setCurIdx(4)
    uni.switchTab({ url: '/pages/mine/index' })
  }
}
const getGift = async () => {
  const params = {
    pageNum: 1,
    pageSize: gifts.value.num,
    tenantId: 'wx69fdd1c0ac8f3e90',
  }
  const res = await requestGiftsList(params)
  if (res.value.list) {
    packageData.value = res.value.list.map((item) => ({
      ...item,
      originalPrice: (item.originalPrice / 100).toFixed(2),
      price: (item.price / 100).toFixed(2),
    }))
    distributeItems()
  }
}

// 右侧卡片数据
const getIndexGift = async () => {
  const res = await getIndexGiftsList()
  if (res.code == '000') {
    indexGift.value = res.value.map((item) => ({
      ...item,
      originalPrice: item.originalPrice / 100,
      price: item.price / 100,
    }))
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
const couponList = ref([])
const newCoupons = ref([])
const otherCoupons = ref([])
const groupCoupons = ref([])
// 优惠券弹窗
const getCouponWindows = async () => {
  let { code, value } = await couponPopUpWindows()
  if (code == '000') {
    if (value) {
      couponList.value = value.map((item) => ({
        ...item,
        discountAmount: item.discountAmount / 100,
      }))
    }
    newCoupons.value = couponList.value.filter((item) => item.useType === 2)
    otherCoupons.value = couponList.value.filter((item) => item.useType !== 2)
    if (otherCoupons.value.length > 0 && newCoupons.value.length < 1) {
      showCouponPopup.value = true
    }
    groupCoupons.value = getGroupCoupons(newCoupons.value)
  }
}

// 新人优惠卷分组
function getGroupCoupons(arr, groupSize = 3) {
  const result = []
  const len = arr.length
  for (let i = 0; i < len; i += groupSize) {
    let group = arr.slice(i, i + groupSize)
    while (group.length < groupSize) {
      group.push(arr[group.length % len])
    }
    result.push(group)
  }
  return result
}
// 领取优惠券
const receiveAllCoupon = async () => {
  showCouponPopup.value = false
  let requestInfo = []
  couponList.value.forEach((item) => {
    requestInfo.push(item.couponId)
  })
  if (requestInfo == null || requestInfo.length == 0) {
    uni.showToast({
      icon: 'none',
      title: '暂无可领取的优惠券',
      duration: 1200,
    })
    return
  }
  const params = {
    cIds: requestInfo,
  }
  const res = await receiveDiscount(params)
  getCouponWindows()
}

// 搜索跳转
function goSearch() {
  uni.navigateTo({
    url: '/pages-sub/home/searchService?keyword=' + searchKey.value,
  })
}
//call下客服
const service = ref({
  enable: false,
  tel: '400-996-9797',
})
const callPhone = () => {
  uni.makePhoneCall({
    phoneNumber: service.value.tel,
  })
}

// 下拉刷新
const onRefresh = async () => {
  try {
    await getMiniData()
    getGift()
    getIndexGift()
    getRequestAdvertList(1)
    // getRequestAdvertList(2)
    // getRequestAdvertList(3)
    uni.showToast({
      title: '加载成功',
      duration: 800,
    })
  } catch (error) {
  } finally {
    paGing.value?.complete()
  }
}
const getQueryString = (url, name) => {
  const reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  const r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null
}
const navigateToPath = (path) => {
  uni.navigateTo({
    url: path,
  })
}
const showChange = (value) => {
  card.value.show = value
  card.value.show = false
}
const onGiftsScan = (code) => {
  if (code !== null && code !== undefined && code !== '') {
    card.value.show = true
    card.value.code = code
  }
}
// 测试 uni API 自动引入
onShow(async () => {
  configStore.fetchConfig()
  await getMiniData()
  getGift()
  getIndexGift()
  getRequestAdvertList(1)
  // getRequestAdvertList(2)
  // getRequestAdvertList(3)
  onGiftsScan(card.value.code)
  if (loginInfoStore.loginInfo.isLogin) {
    GetUpdateOrder()
    getCouponWindows()
  }
})
onLoad((query) => {
  console.log('onLoad query=', query)
  if (!query || Object.keys(query).length === 0) return
  let qrCode = decodeURIComponent(query.q)
  console.log('onLoad 二维码原始链接=' + qrCode)
  if (qrCode !== 'undefined') {
    let _code = getQueryString(qrCode, 'code')
    console.log('onLoad 二维码参数 _code=' + _code)
    onGiftsScan(_code)
  }
  if (query.data) {
    let data = JSON.parse(query.data)
    if (data !== null && data !== undefined && data !== '') {
      console.log('onLoad share data=', data)
      let path = decodeURIComponent(data.path)
      if (path !== null && path !== undefined && path !== '') {
        console.log('onLoad path=', path)
        navigateToPath(path)
      }
    }
  }
})
</script>

<style scoped>
.waterfall-container {
  width: 90%;
  margin: 0 32rpx;
  padding-bottom: 32rpx;
}
.column-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.column {
  width: 48%;
  display: flex;
  flex-direction: column;
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
  align-items: flex-end;
  gap: 8px;
  position: relative;
}
.text {
  color: white;
  font-size: 24px;
}
.search-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
  height: 80rpx;
  position: relative;
}
.right-icon {
  width: 65rpx;
  height: 65rpx;
}
.scroll-box {
  background: #f2f2f2;
}
.cardBg {
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.waist-card {
  position: relative;
  width: 90%;
  height: 200rpx;
  margin: 0 32rpx;
  border-radius: 10px;
}
.waist-card-box {
  position: relative;
  padding: 10px;
  padding-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
}
.waist-item-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.waist-image {
  height: 100rpx;
  width: 100rpx;
}
.waist-text {
  color: #595757;
  font-size: 28rpx;
  margin-top: 10rpx;
}
.card-box {
  width: 90%;
  height: 280rpx;
  margin: 32rpx;
  display: flex;
  justify-content: space-between;
}
.image-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-box-item-left {
  position: relative;
  width: 100%;
  height: 45%;
}
.image-box-item-right {
  position: relative;
  width: 100%;
  height: 100%;
}
.image-left {
  position: absolute;
  width: 98%;
  height: 100%;
  z-index: 0;
}
.image-right {
  position: absolute;
  right: 0%;
  width: 98%;
  height: 100%;
  z-index: 0;
}
.card-content {
  position: relative;
  height: 100%;
  z-index: 1;
}
.content-left {
  position: absolute;
  bottom: 15%;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50rpx;
  width: 140rpx;
  padding: 0 5rpx;
  gap: 10rpx;
}
.content-left-price1 {
  display: block;
  font-size: 18px;
  font-weight: 800;
  background-image: linear-gradient(to bottom, #bf976f 60%, #7d5930 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-min {
  margin-left: 2px;
  line-height: 1;
  flex-direction: column;
  font-size: 20rpx;
  display: flex;
  justify-content: flex-end;
  text-decoration: line-through !important;
  color: #999;
}
.content-left-price2 {
  font-size: 18px;
  font-weight: 800;
  color: #f3653d;
}
.content-right {
  position: absolute;
  right: 5%;
  top: 0%;
  height: 90%;
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content-right-top {
  display: flex;
  flex-direction: row-reverse;
  color: #595959;
  font-size: 24rpx;
  font-weight: 500;
  margin-top: 8rpx;
}
.content-right-bottom {
  display: flex;
  flex-direction: row-reverse;
  color: #c39a63;
  font-size: 18rpx;
  font-weight: 500;
  margin-bottom: 5px;
}
.content-right-bottom1 {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #c39a63;
  font-size: 18rpx;
  font-weight: 500;
  margin-bottom: 5px;
}
.card-button-box {
  position: absolute;
  bottom: 25%;
  z-index: 1;
  display: flex;
  justify-content: center;
  margin-top: 65%;
}
.card-button {
  background: #fff;
  color: #115ac8;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8rpx 15rpx;
  font-size: 12px;
  font-weight: 600;
}
.package {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 90%;
  margin: 0 32rpx;
}
.package-left {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 49%;
  background: linear-gradient(to right, #ccdef2 0%, #d1e8f1 100%);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}
.package-right {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 49%;
  background: linear-gradient(to right, #ccdef2 0%, #d1e8f1 100%);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}
.package-item {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  background: linear-gradient(to right, #ccdef2 0%, #d1e8f1 100%);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
  margin-top: 20rpx;
}
.package-image-right {
  width: 100%;
  height: 162px;
  display: block;
  border-radius: 20rpx 20rpx 0 0;
}
.package-image-left {
  width: 100%;
  height: 141px;
  display: block;
  border-radius: 20rpx 20rpx 0 0;
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
  font-size: 36rpx;
  color: #ff6132;
  font-weight: 600;
}

.old {
  text-decoration: line-through !important;
  font-size: 22rpx;
  color: #999;
}
.char-box.number {
  font-size: 22rpx;
  color: #999;
}

.category-title-box {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;
}

.category-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #23183d;
  line-height: 44rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.category-title-more {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  font-weight: 500;
  color: #9b9b9b;
  line-height: 30rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 999;
}

.category-box-view {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.category-item-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 49%;
  height: 120rpx;
  margin-top: 18rpx;
}

.category-item-box-view {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.category-item-image {
  width: 100rpx;
  height: 100rpx;
  margin: 0 20rpx;
  flex-shrink: 0;
}

.category-item-text-box {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.category-item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #23183d;
  line-height: 33rpx;
  margin-bottom: 15rpx;
  -webkit-background-clip: text;

  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.category-item-price {
  margin-top: 4rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #717171;
  line-height: 23rpx;
}

.recommend-view {
  width: 90%;
  margin: 32rpx;
  padding-bottom: 10px;
}

.recommend-title {
  font-size: 40rpx;
  font-weight: 500;
  color: #26273c;
  line-height: 44rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recommend-box-view {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
  margin-bottom: 50rpx;
}

.recommend-item-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 172rpx;
  margin-top: 18rpx;
}

.recommend-item-box-view {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.recommend-item-image {
  width: 180rpx;
  height: 135rpx;
  margin-left: 18rpx;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.recommend-item-text-box {
  height: 135rpx;
  width: calc(100vw - 452rpx);
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-top: 10rpx;
  /* flex-shrink: 0; */
}

.recommend-item-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #23183d;
  line-height: 33rpx;
  -webkit-background-clip: text;
  margin-bottom: 4rpx;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.recommend-ranking {
  font-size:;
}

.recommend-item-price-yuan {
  font-size: 20rpx;
  font-weight: bold;
  color: #ff7a45;
  line-height: 28rpx;
}

.recommend-item-price {
  font-size: 40rpx;
  font-weight: bold;
}

.recommend-item-price-unit {
  font-weight: 400;
  font-size: 20rpx;
  color: #717171;
  line-height: 23rpx;
}

.recommend-item-original-price {
  margin-left: 20rpx;
  font-size: 24rpx;
  text-decoration: line-through;
  font-weight: 400;
  color: #ced0de;
  line-height: 28rpx;
  -webkit-background-clip: text;
}

.recommend-item-buy-view {
  margin-left: 24rpx;
  margin-right: 12rpx;
  margin-top: 110rpx;
  padding-bottom: 20rpx;
}

.recommend-item-buy-btn {
  color: white;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  width: 144rpx;
  height: 52rpx;
  border-style: solid;
  border-radius: 100px;
  background: linear-gradient(144deg, #56aaf5, #3e95f6 100%);
}
.coupon-img-win {
  width: 600rpx;
  height: 500rpx;
}
.gb-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-y {
  color: red;
  background: linear-gradient(to right, #fceec0, #fde7ab);
  font-weight: 600;
  width: 500rpx;
  border-radius: 100px;
  height: 80rpx;
  margin-top: -70px;
  margin-bottom: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-clear {
  background: transparent;
  border: 2px solid #fff;
  border-radius: 100px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-size: 30px;
}
.zfc {
  margin-top: -4px;
  font-weight: 400;
}
.coupon {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20%;
}
.couponItem {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.couponItem-top {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16%;
  width: 50%;
  color: #fff;
}
.couponItem-bottom {
  margin-top: 5px;
  font-size: 15px;
  height: 80%;
  width: 70%;
  display: flex;
  flex-direction: column;
}
.couponItem-bottom-name {
  padding-left: 15%;
  margin-top: 5%;
}
.txt {
  font-size: 10px;
  color: #9c9d9f;
  padding-left: 18%;
  margin-top: 5%;
}
.couponItem-bottom-price {
  padding-left: 15%;
  margin-top: 5%;
  font-size: 22px;
  font-weight: 600;
  color: #f4663e;
}

.coupon-swiper {
  width: 100%;
  min-height: 50%;
}
.swiper-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15rpx;
}
.coupon-img-box {
  width: 30%;
  height: 100%;
  position: relative;
}
.coupon-img {
  width: 100%;
}
.coupon-text {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  background: linear-gradient(45deg, #2b83f2, #60b1fb); /* 从红到蓝的渐变 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.indexGift-swiper {
  width: 100rpx;
  height: 30rpx;
  display: flex;
  flex-direction: row-reverse;
  color: #c39a63;
  font-size: 18rpx;
  font-weight: 500;
}
.indexGift-swiper-item {
  display: flex;
  flex-direction: row-reverse;
  color: #f3653d;
}
.service-tell-view {
  width: 100rpx;
  height: 100rpx;
  position: fixed; /* 改为固定定位 */
  right: 20rpx; /* 右侧距离 */
  bottom: 200rpx; /* 底部距离 */
  z-index: 9999;
}
.text-grap {
  margin-right: 10rpx;
}
.container-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header-bg-view {
  height: 340rpx;
}

.banner-view {
  height: 340rpx;
}

.swiper-view {
  width: 100%;
  height: 100%;
}

.banner-image-view {
  width: 100%;
  height: 100%;
}

.search-view-bg {
  height: 90rpx;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  position: absolute;
  z-index: 999;
}

.search-view {
  height: 56rpx;
  width: 90%;
  border-radius: 10rpx;
  margin-left: 32rpx;
  display: flex;
  align-items: center;
  padding-left: 26rpx;
}

.search-icon-view {
  width: 20rpx;
  height: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.search-swiper {
  width: 100%;
  height: 100%;
}

.search-swiper-title {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 24rpx;
  margin-left: 20rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
  text-align: center;
}
.msg-view {
  width: 60rpx;
  height: 60rpx;
  margin-left: 15rpx;
  margin-right: 30rpx;
}
.notice-view {
  z-index: 200;
  flex-shrink: 0;
  margin-top: -40rpx;
  height: 88rpx;
  margin-left: 32rpx;
  margin-right: 32rpx;
  background: linear-gradient(180deg, #d3e2ff 0%, #ffffff 100%);
  box-shadow: 0rpx 10rpx 36rpx 0rpx rgba(204, 212, 238, 0.2);
  border-radius: 20rpx;
  border: 2rpx solid #ffffff;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.notice-item-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 500;
  color: #26273c;
  line-height: 28rpx;
}

.notice-icon-view {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
  margin-left: 24rpx;
  margin-bottom: 6rpx;
}

.notice-into-view {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  margin-left: 10rpx;
}

.notice-swiper {
  width: 100%;
  height: 100%;
}

.notice-swiper-title {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 24rpx;
  margin-left: 10rpx;
  font-weight: 400;
  color: #14161b;
  line-height: 80rpx;
  text-align: start;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
/* 板块样式 */
.plate-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 160rpx;
  gap: 20rpx;
  padding: 32rpx;
  margin-top: 20rpx;
}

/* 公共卡片 —— 圆角 + 背景图全覆盖 */
.card {
  position: relative;
  border-radius: 16rpx;
  overflow: hidden; /* 让圆角裁掉图片 */
}

/* 背景图 */
.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* object-fit: cover; 铺满并裁切，可能会裁掉部分内容 */
  /* 如果图片变形严重，可以改为以下任一选项：
   * object-fit: contain; - 完整显示图片，可能有留白
   * object-fit: fill; - 拉伸填满，会变形
   * object-fit: scale-down; - 等比缩小，不会放大
   */
  object-fit: scale-down;
}

/* 文字层 */
.card-content {
  position: relative;
  z-index: 1;
  padding: 24rpx;
  color: #fff;
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  height: 100%;
}

/* 左侧大卡片 - 跨越两行 */
.big-card {
  grid-row: span 2;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
}

/* 右侧小卡片 */
.small-card {
  background: #f6f8fb;
}

/* 字体样式 */
.big-card .title {
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.2;
}

.big-card .desc {
  font-size: 24rpx;
  margin-top: 8rpx;
  line-height: 1.3;
}

.small-card .title {
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.2;
}

.small-card .desc {
  font-size: 20rpx;
  margin-top: 4rpx;
  line-height: 1.2;
}
</style>
