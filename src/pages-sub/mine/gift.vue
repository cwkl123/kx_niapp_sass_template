<!--
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-08 09:04:57
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-11 10:45:21
 * @FilePath: \huijiashenghuo_niapp\src\pages-sub\mine\coupon.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '礼包',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <!-- 使用z-paging-swiper为根节点可以免计算高度 -->
  <view class="page-container">
    <view
      style="position: absolute; width: 100%; height: 360px; z-index: 0; padding-top: -20px"
      :style="`background: linear-gradient(180deg, ${themeColor} 40%, #2f72f600 80%)`"
    ></view>
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="15"
      :loading-more-no-more-text="'END'"
      empty-view-img="/static/images/mine/card/noneCard.png"
      empty-view-text="暂无可用礼包"
      :empty-view-style="{ top: '100rpx', width: '100%', height: '40vh' }"
      :empty-view-img-style="{ width: '600rpx', height: '450rpx' }"
      empty-view-fixed="true"
    >
      <template #top>
        <u-navbar :background="{ 'background-color': '#007AFF' }">
          <view class="nav-bar">
            <view @click="goBack()">
              <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
              <text class="nav-title">礼包</text>
            </view>
          </view>
        </u-navbar>
        <view class="search-section">
          <view class="search-box">
            <input placeholder="请输入兑换码" class="search-input" v-model="Code" />
            <button class="search-btn" @click="exchangeCode">兑换</button>
          </view>
        </view>
        <view class="tab-bar">
          <view
            class="tab-item"
            v-for="(tab, index) in tabList"
            :key="index"
            :class="{ active: current === index }"
            @click="changeTab(index)"
          >
            <wd-badge :modelValue="num" v-if="index == 2">
              <text>{{ tab }}</text>
            </wd-badge>
            <text v-else>{{ tab }}</text>
          </view>
        </view>
      </template>
      <view class="content-section">
        <view class="tab-content">
          <!-- 礼包券 -->
          <view
            v-for="(coupon, index) in dataList"
            :key="index"
            class="coupon-card"
            v-if="current !== 2"
          >
            <!-- 待使用&已使用/已失效 -->

            <view class="coupon-header" @click="showAgreement = true">
              <view
                class="agreement-tag"
                style="height: 36rpx; width: 254rpx; margin-top: -30rpx; margin-left: -1rpx"
              >
                <image src="/static/images/mine/card/gif_bag_agree_icon.png"></image>
              </view>
            </view>
            <!-- 待使用 -->
            <view class="coupon-body">
              <view class="coupon-content">
                <view class="icon-section">
                  <image class="coupon-icon" :src="getImgUrl(coupon.icon)"></image>
                </view>
                <view class="info-section">
                  <view class="coupon-info" v-if="current === 0">
                    <text class="coupon-name">{{ coupon.couponName }}</text>
                    <text class="coupon-date">
                      {{ formatDate(coupon.useStartTime) }}-{{ formatDate(coupon.expireTime) }}
                    </text>
                    <view class="coupon-rules">
                      <view class="rules-title" @click="showUsageRulesture(coupon.couponDetail)">
                        <text>使用规则</text>
                        <image
                          class="arrow-icon"
                          :src="'/static/images/mine/card/arrow-down.png'"
                        ></image>
                      </view>
                    </view>
                  </view>
                  <view class="coupon-info" v-else>
                    <text class="coupon-name">{{ coupon.name }}</text>
                    <text class="coupon-date">
                      {{ formatDate(coupon.useStartTime) }}-{{ formatDate(coupon.expireTime) }}
                    </text>
                    <view class="coupon-rules">
                      <view class="rules-title" @click="showUsageRulesture(coupon.description)">
                        <text>使用规则</text>
                        <image
                          class="arrow-icon"
                          :src="'/static/images/mine/card/arrow-down.png'"
                        ></image>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="action-section">
                  <view class="coupon-action" v-if="current === 0">
                    <text class="coupon-count">{{ coupon.quantity }}张</text>
                    <view class="use-btn" @click="goUse(coupon.serviceItemId)">去使用</view>
                  </view>
                  <view class="coupon-action" v-else>
                    <text class="coupon-count"></text>
                    <view class="use-btn" style="background: #727272">
                      {{ GiftStatusMap[coupon.status] }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-for="(coupon, index) in dataList" v-else>
            <receive-card-view :data="coupon" @confirm="handleConfirm"></receive-card-view>
          </view>
          <!-- 规则 -->
          <view class="drawer-container" :class="{ 'drawer-visible': showUsageRules }">
            <view class="drawer-content">
              <view class="drawer-header">
                <text class="drawer-title">使用规则</text>
              </view>
              <scroll-view class="drawer-body" scroll-y>
                <view class="t-item-rules" v-html="rules"></view>
              </scroll-view>
              <view class="drawer-footer">
                <button class="drawer-close-btn" @click="showUsageRules = false">我知道了</button>
              </view>
            </view>
          </view>
          <!-- 知情书弹窗 -->
          <view class="agreement-modal" v-if="showAgreement">
            <view class="modal-mask" @click="showAgreement = false"></view>
            <view class="modal-content">
              <view class="modal-title">知情书</view>
              <view class="modal-text">
                1.礼包自支付后开始生效，有效期请看礼包详情
                <br />
                2.因礼包低于市场价格，非特殊情况不可申请退款
                <br />
                3.点击同意后进入付款页面，付款后礼包即可生效
              </view>

              <view class="modal-image">
                <image class="modal-icon" src="/static/images/mine/card/agree_icon.png"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import receiveCardView from './receiveCard.vue'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { GiftStatusMap } from './constants'
import { formatDate } from '@/service/cfgUrl'
import {
  getUserValidGiftsList,
  getUserInvalidGiftsList,
  requestGiftsWaitList,
  redeemGift,
  requestGiftsScanCount,
} from '@/service/gifts/giftsApi'
import { toast } from '@/utils/toast'

let themeColor = inject('themeColor')
const num = ref(0)
const Code = ref('')
const tabList = ref(['待使用券', '已使用/已失效券', '待领取'])
const current = ref(0) // tabs组件的current值，表示当前活动的tab选项
const dataList = ref([]) // 用于存储分页数据
const paging = ref(null) // z-paging组件的引用
const showAgreement = ref(false)
const showUsageRules = ref(false)
const rules = ref('')
const showUsageRulesture = (content) => {
  showUsageRules.value = true
  rules.value = content
}
// 格式化日期函数，将日期字符串中的 '-' 替换为 '.'

const getImgUrl = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}
const handleConfirm = async () => {
  await getCount()
  paging.value.reload()
}
const changeTab = (index) => {
  current.value = index
  paging.value.reload()
}
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    tabbarStore.setCurIdx(4)
    uni.switchTab({
      url: '/pages/mine/index',
    })
  }
}
const goUse = (coupon) => {
  if (coupon === 0) {
    uni.setStorageSync('cateID_key', null)
    tabbarStore.setCurIdx(1)
    uni.switchTab({
      url: '/pages/service/index',
    })
  } else {
    uni.navigateTo({
      url: `/pages-sub/service/serviceInfo?data=${JSON.stringify({
        serveItemId: coupon,
        orderId: '',
      })}`,
    })
  }
}
const queryList = async (pageNo, limit) => {
  let res = null
  try {
    if (current.value == 0) {
      res = await getUserValidGiftsList({ pageNum: pageNo, pageSize: limit })
    } else if (current.value == 1) {
      res = await getUserInvalidGiftsList({ pageNum: pageNo, pageSize: limit })
    } else if (current.value == 2) {
      res = await requestGiftsWaitList({ pageNum: pageNo, pageSize: limit })
    }
    if (res.code == '000') {
      console.log(res.value)
      paging.value.complete(res.value.list)
    }
  } catch (error) {
    paging.value.complete(false)
  }
}
const exchangeCode = async () => {
  const { code, message, value } = await redeemGift({ code: Code.value })
  if (code == '000') {
    toast.info('兑换成功！')
    current.value = 0
    paging.value.reload()
  } else {
    toast.info(message)
  }
}
const getCount = async () => {
  const res = await requestGiftsScanCount()
  if (res.code == '000') {
    num.value = res.value.count
  }
}
onShow(async () => {
  await getCount()
})
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f3f4f4;
}

/* 导航栏样式 */
.nav-bar {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 10px 16px;

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

.search-section {
  padding: 20rpx 30rpx;

  .search-box {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 40rpx;
    height: 70rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

    .search-input {
      flex: 1;
      font-size: 28rpx;
      padding: 0 30rpx;
      height: 100%;
      color: #545454;
    }

    .search-btn {
      height: 60rpx;
      min-width: 120rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      color: white;
      background: linear-gradient(90deg, #2a8bff, #4aa9ff);
      margin: 0;
      padding: 0 25rpx;
      border-radius: 30rpx;
      margin-right: 8rpx;
      font-weight: 500;

      &::after {
        border: none;
      }
    }
  }
}

.tab-bar {
  display: flex;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #ffffff66;
  position: relative;
}

.tab-item.active {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 4rpx;
  background-color: #ffffff;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120rpx;

    .cow-container {
      position: relative;
      width: 600rpx;
      height: 450rpx;
      margin-bottom: 50rpx;
    }

    .empty-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 600rpx;
      height: 450rpx;
    }

    .empty-text {
      font-size: 32rpx;
      color: #606266;
      text-align: center;
      margin-bottom: 20rpx;
      line-height: 1.6;
    }
  }
}

.coupon-card {
  background-color: white;
  border-radius: 0 32rpx 32rpx 32rpx;
  /* 左上角直角，其他角圆角 */
  padding: 23px 10px 10px;
  margin: 30rpx 0 25px 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
  margin-top: 40rpx;
}

.coupon-header {
  position: absolute;
  top: -10rpx;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.agreement-tag {
  width: 254rpx;
  height: 36rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

.coupon-body {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  /* 为标签腾出空间 */
  margin-bottom: 20rpx;
}
.coupon-content {
  width: 100%;
  display: flex;
  min-height: 148rpx;
  justify-content: space-between;
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
}

.coupon-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #494949;
  line-height: 1.4;
}

.coupon-date {
  display: block;
  font-size: 26rpx;
  color: #bebebe;
  margin-top: 10rpx;
}
.coupon-action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.coupon-count {
  display: block;
  font-size: 24rpx;
  color: #2f72f6;
  margin-bottom: 10rpx;
  height: 16px;
}

.use-btn {
  width: 180rpx;
  height: 56rpx;
  margin-top: 20px;
  line-height: 56rpx;
  background: #2f72f6;
  border-radius: 40rpx;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
}

.use-btn.used,
.use-btn.expired {
  background: #f4f4f4;
  color: #bebebe;
}

.coupon-rules {
  padding-top: 20rpx;
}

.rules-title {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #545454;
}
.arrow-icon {
  margin-left: 5px;
  width: 24rpx;
  height: 24rpx;
}

.rules-content {
  padding-top: 10rpx;
  font-size: 26rpx;
  color: #999999;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 知情书弹窗样式 */
.agreement-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

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
    padding: 40rpx;
    box-sizing: border-box;
    text-align: center;

    .modal-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #2a2b2c;
      margin-bottom: 20rpx;
      position: relative;
      z-index: 1;
    }

    .modal-image {
      position: absolute;
      margin: -100px 0 0 60px;
      width: 100%;
      height: 200px;
      z-index: 0;
      padding-top: -20px;
    }

    .modal-icon {
      width: 200rpx;
      height: 200rpx;
      margin: 0 auto 20rpx;
    }

    .modal-text {
      text-align: left;
      font-size: 28rpx;
      color: #2a2b2c;
      line-height: 48rpx;
      margin-bottom: 30rpx;
    }
  }
}
.drawer-container {
  position: fixed;
  bottom: -100%;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: bottom 0.3s ease;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.drawer-visible {
  bottom: 0;
}

.drawer-content {
  background-color: #ffffff;
}

.drawer-header {
  padding: 30rpx;
  text-align: center;
}

.drawer-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.drawer-body {
  max-height: 60vh;
  max-width: 92%;
  padding: 30rpx;
}

.rules-text {
  font-size: 28rpx;
  line-height: 1.5;
  color: #555555;
}

.drawer-footer {
  padding: 20rpx;
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
</style>
