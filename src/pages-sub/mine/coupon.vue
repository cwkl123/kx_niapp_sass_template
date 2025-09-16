<!--
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-08 09:04:57
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-11 10:41:26
 * @FilePath: \huijiashenghuo_niapp\src\pages-sub\mine\coupon.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '优惠劵',
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
      empty-view-text="暂无可用优惠券"
      :empty-view-style="{ top: '100rpx', width: '100%', height: '40vh', top: '0' }"
      :empty-view-img-style="{ width: '600rpx', height: '450rpx' }"
      empty-view-fixed="true"
    >
      <template #top>
        <u-navbar :background="{ 'background-color': '#007AFF' }">
          <view class="nav-bar">
            <view @click="goBack()">
              <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
              <text class="nav-title">优惠劵</text>
            </view>
          </view>
        </u-navbar>
        <view class="tab-bar">
          <view
            class="tab-item"
            v-for="(tab, index) in tabList"
            :key="index"
            :class="{ active: current === index }"
            @click="changeTab(index)"
          >
            <text>{{ tab }}</text>
          </view>
        </view>
      </template>
      <view class="content-section">
        <view class="tab-content">
          <!-- 优惠券 -->
          <view
            class="coupon-card available"
            v-for="(coupon, index) in dataList"
            :key="index"
            v-if="dataList.length > 0"
          >
            <view class="card-header">
              <view class="coupon-type">{{ TypeMap[coupon.couponType] }}</view>
              <text class="coupon-title">{{ coupon.couponName }}</text>
            </view>

            <view class="card-body">
              <view class="info-section">
                <view class="info-item" v-for="(item, idx) in coupon.serviceItem" :key="idx">
                  {{ item.serviceTitle }}
                </view>
              </view>
            </view>

            <view class="card-footer">
              <view class="footer-left">
                <span>{{ coupon.useStartTime }}-{{ coupon.useEndTime }}</span>
              </view>

              <view class="footer-right">
                <view class="amount-section">
                  <view class="symbol"><span v-if="coupon.couponType != 3">¥</span></view>
                  <view class="amount">
                    {{
                      coupon.couponType != 3
                        ? formatAmount(coupon.discountAmount)
                        : coupon.discountNumber / 10
                    }}

                    <span v-if="coupon.couponType == 3">折</span>
                  </view>
                </view>
                <view class="use-condition" v-if="coupon.couponType == 1">
                  满{{ formatAmount(coupon.thresholdAmount) }}可用
                </view>
              </view>
            </view>

            <view class="action-section">
              <text class="rules-btn" @click="showUsageRulesture(coupon.couponDetail)">
                使用规则
              </text>
              <button class="use-btn" @click="goUse(coupon)" v-if="current === 0">去使用</button>
            </view>
          </view>
          <!-- 规则 -->
          <view class="drawer-container" :class="{ 'drawer-visible': showUsageRules }">
            <view class="drawer-content">
              <view class="drawer-header">
                <text class="drawer-title">使用规则</text>
              </view>
              <scroll-view class="drawer-body" scroll-y>
                <text class="rules-text">
                  {{ rules }}
                </text>
              </scroll-view>
              <view class="drawer-footer">
                <button class="drawer-close-btn" @click="showUsageRules = false">我知道了</button>
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
import { userDiscountList } from '@/service/coupon/ordercoupon'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { TypeMap } from './constants'

let themeColor = inject('themeColor')
const tabList = ref(['待使用券', '已使用/已失效券'])
const current = ref(0) // tabs组件的current值，表示当前活动的tab选项
const dataList = ref([]) // 用于存储分页数据
const paging = ref(null) // z-paging组件的引用

const showUsageRules = ref(false)
const rules = ref('')
const showUsageRulesture = (content) => {
  console.log('显示使用规则', content)
  showUsageRules.value = true
  rules.value = content
}
const formatAmount = (value) => {
  try {
    let num = Number(value)
    let result = (num / 100).toFixed(2)
    return result
  } catch (e) {
    return '0.00'
  }
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
  if (coupon.serviceItem.length > 0) {
    if (coupon.serviceItem.length === 1) {
      uni.reLaunch({
        url: `/pages-sub/service/serviceInfo?data=${JSON.stringify({
          serveItemId: coupon.serviceItem[0].serviceId,
          orderId: '',
        })}`,
      })
    } else {
      uni.setStorageSync('cateID_key', null)
      tabbarStore.setCurIdx(1)
      uni.switchTab({
        url: '/pages/service/index',
      })
    }
  }
}
const queryList = (pageNo, limit) => {
  // 此处请求仅为演示，请替换为自己项目中的请求
  userDiscountList({ pageNum: pageNo, pageSize: limit, typeStatus: current.value === 0 ? 1 : 2 })
    .then((res) => {
      // 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
      paging.value.complete(res.value.list)
    })
    .catch((res) => {
      paging.value.complete(false)
    })
}
</script>
<style lang="scss" scoped>
.swiper {
  height: 100%;
}
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 40rpx;
  height: 70rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.search-iocn {
  width: 45rpx;
  height: 45rpx;
  padding-left: 20rpx;
}

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

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 120rpx;

  .cow-container {
    position: relative;
    width: 600rpx;
    height: 450rpx;
    margin-bottom: 30rpx;
  }

  .empty-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
    text-align: center;
    line-height: 1.6;
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
  color: #ffffff;
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

/* 新版优惠券卡片样式 */
.coupon-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 30rpx;
  padding: 30rpx;
  position: relative;

  /* 状态指示线 */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 10rpx;
    width: 100%;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .coupon-type {
      background: #f0f7ff;
      color: #2a8bff;
      font-size: 35rpx;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      margin-right: 16rpx;
    }

    .coupon-title {
      font-size: 35rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .card-body {
    justify-content: space-between;
    margin-bottom: 20rpx;

    .info-section {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      padding-right: 30rpx;

      .info-item {
        display: inline-block;
        font-size: 24rpx;
        color: #666;
        background: #f8f8f8;
        padding: 6rpx 14rpx;
        border-radius: 8rpx;
        margin: 10rpx 10rpx 0 0;
        line-height: 1.4;
        white-space: nowrap;
      }
    }
  }

  .card-footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    /* 顶部对齐 */
    // padding-top: 20rpx;
    margin-bottom: 20rpx;

    .footer-left {
      flex: 1;
      text-align: left;
      font-size: 13px;
      color: #bebebe;

      .validity {
        font-size: 24rpx;
        color: #999;
        line-height: 1.4;
        word-break: break-word;
      }
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: right;
      .amount-section {
        display: flex;
        justify-content: flex-end;
        text-align: right;
        align-items: baseline;
        color: #2f72f6;
        margin-bottom: 10rpx;
        padding-top: 10px;

        .symbol {
          font-size: 16pt;
          margin-right: 5px;
        }

        .amount {
          font-size: 30pt;
          line-height: 1;
        }
      }

      .use-condition {
        font-size: 24rpx;
        color: #ff3b30;
        line-height: 1.4;
      }
    }
  }

  .action-section {
    display: flex;
    justify-content: space-between;
    border-top: 1rpx dashed #eee;
    align-items: center;
    padding-top: 10px;

    .rules-btn {
      font-size: 28rpx;
      color: #2a8bff;
      padding: 10rpx 0;
    }

    .use-btn {
      background: linear-gradient(90deg, #2a8bff, #4aa9ff);
      color: #fff;
      font-size: 28rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 35rpx;
      padding: 0 30rpx;
      margin: 0;

      &::after {
        border: none;
      }
    }
  }

  /* 已失效样式 */
  &.expired {
    .amount-section {
      color: #999;
    }

    .coupon-type {
      background: #f2f2f2;
      color: #999;
    }

    .rules-btn {
      color: #999;
    }

    .use-btn {
      background: #cccccc;
    }
  }
}

/* 使用规则抽屉样式保持不变 */
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
.end-text {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  color: #888;
}
</style>
