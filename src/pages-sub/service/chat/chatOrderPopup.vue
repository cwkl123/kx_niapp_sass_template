<template>
  <view style="height: 60vh; width: 100%; display: flex; flex-direction: column">
    <!-- 顶部标题栏 -->
    <view
      style="
        height: 56rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 32rpx 32rpx 0rpx;
      "
    >
      <view style="font-weight: 600; color: #47494a; font-size: 40rpx">{{ order.title }}</view>
      <uni-icons type="closeempty" size="30" color="#3E4041" @click="onClose()"></uni-icons>
    </view>

    <!-- 订单列表区域 -->
    <scroll-view
      scroll-y="true"
      style="height: calc(60vh - 88rpx); width: 100%"
      v-if="orderList.length > 0"
      @scrolltolower="loadMore"
    >
      <view class="order-container">
        <!-- 订单项 -->
        <view class="order-box" v-for="(item, index) in orderList" :key="index">
          <view class="order-header-box">
            <view class="order-num">订单编号：{{ item.order_no }}</view>
            <view
              class="order-status"
              :style="{
                background: getOrderStatus(item.trades_status).background,
                color: getOrderStatus(item.trades_status).color,
              }"
            >
              {{ getOrderStatus(item.trades_status).name }}
            </view>
          </view>
          <view class="order-line"></view>
          <view class="order-info-box">
            <view class="order-title">{{ item.service_title }}</view>
            <view class="order-price">{{ formatAmount(item.price) + '元' }}</view>
          </view>
          <view class="order-bottom-box">
            <view class="order-time-box">
              <view class="order-time">下单时间：{{ formatTime(item.order_time) }}</view>
              <view class="order-time">服务时间：{{ formatTime(item.service_start_time) }}</view>
            </view>
            <view class="order-send" @click="sendOrder(item)">发送订单</view>
          </view>
        </view>

        <!-- 加载更多提示 -->
        <view v-if="hasMore" class="load-more">
          <uni-load-more status="loading"></uni-load-more>
        </view>
        <view v-else-if="orderList.length > 5" class="load-more no-more">
          <text>没有更多数据了</text>
        </view>
      </view>
    </scroll-view>

    <!-- 空数据状态 -->
    <view
      v-else
      style="
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <view style="height: 300rpx; width: 480rpx">
        <image
          src="/static/images/chat/empty_icon.png"
          mode="aspectFit"
          style="width: 100%; height: 100%"
        ></image>
      </view>
      <view style="font-size: 28rpx; color: #999">暂无订单数据</view>
    </view>
  </view>
</template>

<script setup>
import { getOrderPage } from '@/service/order/orderApi'
import { getAppStatus, formatTime } from '@/utils/chatOrderUtils'
// 事件声明
const emit = defineEmits(['showOrders', 'sendOrder'])

// 响应式数据
const order = ref({
  title: '请选择您要咨询的订单',
})
const orderList = ref([]) // 订单列表数据
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页数量
const hasMore = ref(true) // 是否还有更多数据
const isLoading = ref(false) // 是否正在加载

onMounted(async () => {
  await loadOrderData()
})

const onClose = () => {
  emit('showOrders', true)
}

const sendOrder = (data) => {
  emit('sendOrder', data)
}

// 订单状态转换方法
const getOrderStatus = (status) => getAppStatus(status)

const formatAmount = (value) => {
  // 转换为数字类型并计算元单位值
  const yuan = Number(value) / 100

  // 使用toFixed保留两位小数
  return yuan.toFixed(2)
}

// 加载订单数据
const loadOrderData = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true

  try {
    const res = await getOrderPage({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      tradesStatus: '',
    })
    console.log('loadOrderData', res)
    if (res.code === '000') {
      // 更新数据
      orderList.value = [...orderList.value, ...res.value.list]

      // 更新页码和是否有更多数据
      hasMore.value = orderList.value.length < res.value.total
      currentPage.value++
    }
  } catch (error) {
    console.error('加载订单数据出错:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !isLoading.value) {
    loadOrderData()
  }
}
</script>

<style>
/* 原有样式保留，增加部分新样式 */
.order-container {
  padding: 0 16rpx;
}

.order-box {
  height: 272rpx;
  background: #fff;
  border-radius: 20rpx;
  margin: 24rpx 16rpx;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-num {
  font-size: 24rpx;
  font-family:
    PingFang SC-Regular,
    PingFang SC;
  font-weight: 400;
  color: #3e4041;
  line-height: 28rpx;
}

.order-header-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.order-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 34rpx;
  background: rgba(252, 122, 67, 0.1);
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: 400;
  line-height: 34rpx;
  text-align: center;
}

.order-line {
  width: 100%;
  height: 1rpx;
  margin-top: 24rpx;
  margin-bottom: 20rpx;
  background-color: #eeeeee;
}

.order-info-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.order-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #3e4041;
  line-height: 33rpx;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-price {
  font-size: 24rpx;
  font-weight: 600;
  color: #3e4041;
  line-height: 28rpx;
}

.order-bottom-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
}

.order-time-box {
  flex: 1;
}

.order-time {
  font-size: 24rpx;
  font-weight: 400;
  color: #6f7894;
  line-height: 28rpx;
  margin-top: 10rpx;
}

.order-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 144rpx;
  height: 58rpx;
  background: #2f72f6;
  border-radius: 58rpx;
  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  transition: all 0.2s;
}

.order-send:active {
  transform: scale(0.95);
  opacity: 0.9;
}

/* 加载更多样式 */
.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: #999;
}

.no-more {
  padding: 40rpx 0;
}
</style>
