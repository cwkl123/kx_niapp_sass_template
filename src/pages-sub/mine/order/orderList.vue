<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '我的订单',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page-container">
    <!-- <image :src="'/static/images/mine/topBackground.png'" /> -->
    <view
      style="position: absolute; width: 100%; height: 360px; z-index: 0; padding-top: -20px"
      :style="`background: linear-gradient(180deg, ${themeColor} 40%, #2f72f600 80%)`"
    ></view>
    <!-- 订单列表 -->
    <z-paging
      ref="paging"
      v-model="allOrderList"
      @query="queryList"
      :default-page-size="15"
      :loading-more-no-more-text="'END'"
      empty-view-img="/static/images/mine/order/noneOrder.png"
      empty-view-text="暂无订单信息"
      :empty-view-style="{ top: '100rpx', width: '100%', height: '40vh' }"
      :empty-view-img-style="{ width: '600rpx', height: '450rpx' }"
      :empty-view-fixed="true"
    >
      <template #top>
        <u-navbar :background="{ 'background-color': '#007AFF' }">
          <view class="nav-bar">
            <view @click="goBack()">
              <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
              <text class="nav-title">我的订单</text>
            </view>
          </view>
        </u-navbar>

        <view class="tab-bar">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: current === index }"
            @click="changeTab(index)"
          >
            <text>{{ tab.name }}</text>
          </view>
        </view>
        <!-- 搜索区域 -->
        <view class="search-section">
          <view class="search-box">
            <image src="/static/images/mine/search_iocn.png" class="search-icon" />
            <input
              placeholder="搜索服务项"
              class="search-input"
              v-model="searchKeyword"
              @confirm="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
          </view>
        </view>
      </template>
      <view style="position: relative; z-index: 1; height: 100%">
        <view class="content-section">
          <!-- 订单 -->
          <view class="tab-content">
            <view class="order-card" v-for="(order, index) in allOrderList" :key="index">
              <view class="order-header">
                <text class="service-name">{{ order.serviceName }}</text>
                <view class="order-status" :class="order.statusClass">
                  {{ order.statusText }}
                </view>
              </view>
              <view class="order-body" @click="toOrderDetail(order)">
                <!-- 左侧订单图片 -->
                <image
                  class="order-image"
                  :src="order.image || '/static/images/mine/index/user_images.png'"
                  mode="aspectFill"
                />
                <!-- 订单详情区域 -->
                <view class="order-details">
                  <view class="detail-item">
                    <text class="detail-label">订单号：</text>
                    <text class="detail-value">{{ order.orderNo }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">上门时间：</text>
                    <text class="detail-value">{{ order.appointmentTime }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">服务地址：</text>
                    <text class="detail-value">{{ order.address }}</text>
                  </view>
                  <view class="detail-item">
                    <text class="detail-label">实付：</text>
                    <text class="detail-price">¥{{ order.price }}</text>
                  </view>
                </view>
              </view>

              <!-- 服务人员信息 - 在order-body下方 -->
              <view class="detail-item2" v-if="order.worker">
                <text class="detail-label">维修师傅：</text>
                <view class="worker-info">
                  <image class="worker-avatar" :src="order.worker.avatar" mode="aspectFill" />
                  <view class="worker-name-worknumber">
                    <text class="worker-name">{{ order.worker.name }}</text>
                    <text class="worker-worknumber">工号：{{ order.worker.workNumber }}</text>
                  </view>
                  <image
                    class="level-icon"
                    :src="levelIcons[order.worker.level - 1]"
                    mode="aspectFit"
                  />
                  <text class="worker-phone">{{ order.worker.phone }}</text>
                </view>
                <view class="rating-review">
                  <view class="rating">
                    <image
                      v-for="(star, index) in 5"
                      :key="index"
                      class="star"
                      :src="index < order.worker.rating ? activeStarIcon : emptyStarIcon"
                      mode="aspectFit"
                    />
                  </view>
                  <view class="review-list">
                    <view
                      v-for="(reviewItem, reviewIndex) in order.worker.review.split(',')"
                      :key="reviewIndex"
                      class="review-item"
                    >
                      {{ reviewItem }}
                    </view>
                  </view>
                </view>
              </view>

              <view class="order-footer">
                <view class="order-actions">
                  <button
                    class="action-btn grey"
                    v-if="order.statusText === '待接单'"
                    @click="showRePopTime(order.orderId, order.serviceId, order.addressId)"
                  >
                    修改时间
                  </button>
                  <button
                    class="action-btn"
                    v-if="order.statusText === '待接单'"
                    @click="toCannel(order.orderId)"
                  >
                    取消订单
                  </button>
                  <button
                    class="action-btn primary"
                    v-if="order.statusText === '待服务'"
                    @click="toContactMaster(order.worker.phone)"
                  >
                    联系师傅
                  </button>
                  <button
                    class="action-btn silvery"
                    v-if="order.statusText === '已完成'"
                    @click="toInvoice(order.orderId)"
                  >
                    申请开票
                  </button>
                  <button
                    class="action-btn orange"
                    v-if="order.statusText === '待评价'"
                    @click="toEvaluate(order.orderId)"
                  >
                    去评价
                  </button>
                  <button
                    class="action-btn orange"
                    v-if="order.statusText === '待支付'"
                    @click="toPayment(order.orderId)"
                  >
                    去支付
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
    <view class="custom-popup" :class="{ 'popup-show': showPopTime }">
      <view class="popup-mask" @click="closePopup"></view>
      <view class="popup-content">
        <view class="time-picker-container">
          <!-- 日期选择区域 -->
          <view class="date-container">
            <view class="date-list">
              <view
                v-for="(item, index) in dateList"
                :key="item.day"
                @click="selectDate(item, index)"
                class="date-item"
                :class="{ active: activeDateIndex === index }"
              >
                <text class="week-day">{{ getWeekName(item.week) }}</text>
                <text class="date">{{ item.date }}</text>
                <view v-if="activeDateIndex === index" class="indicator"></view>
              </view>
            </view>
          </view>

          <!-- 时间选择区域 -->
          <view class="time-container">
            <scroll-view scroll-y style="height: 210px">
              <view class="time-list" v-if="timeList.length > 0">
                <view
                  v-for="(item, index) in timeList"
                  :key="index"
                  @click="selectTime(item, index)"
                  class="time-item"
                  :class="{
                    available: item.num > 0,
                    selected: activeTimeIndex === index,
                  }"
                >
                  {{ formatTime(item.times) }}
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="popup-footer-bar">
            <view class="selected-time">
              预约时间：{{ selectedDate.date }} 日 {{ selectedTime ? selectedTime.times : '' }}
            </view>
            <button class="confirm-btn" @click="confirmTimeSelection">确定</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getOrderPage,
  cancelOrder,
  getOrderHourTimes,
  getOrderWeekTimes,
  updateOrderTime,
} from '@/service/order/orderApi'
import { orderStatusMap, statusClassMap } from './constants'
let themeColor = inject('themeColor')
const current = ref(0) // tabs组件的current值，表示当前活动的tab选项
const paging = ref(null) // z-paging组件的引用
// 定义导航标签
const tabs = ref([
  { name: '全部', status: '' },
  { name: '待接单', status: '110' },
  { name: '待服务', status: '120' },
  { name: '待支付', status: '140' },
  { name: '待评价', status: '150' },
])

// 定义等级图标
const levelIcons = [
  '/static/images/mine/order/level/level_1.png',
  '/static/images/mine/order/level/level_2.png',
  '/static/images/mine/order/level/level_3.png',
  '/static/images/mine/order/level/level_4.png',
  '/static/images/mine/order/level/level_5.png',
]
// 定义星星图标
const activeStarIcon = '/static/images/mine/order/star-rating/delivery_icon_star_active.png'
const emptyStarIcon = '/static/images/mine/order/star-rating/delivery_icon_star_empty.png'

// 搜索关键词
const searchKeyword = ref('')
// 订单列表
const allOrderList = ref([])
// 预约时间选择相关状态
const weekList = ref(['周日', '周一', '周二', '周三', '周四', '周五', '周六'])
const dateList = ref([])
const timeList = ref([])
const activeDateIndex = ref(0)
const activeTimeIndex = ref(-1)
const serviceIdForTime = ref('')
const addressIdForTime = ref('')
const showPopTime = ref(false)
const selectedOrderId = ref('')
// 切换标签的方法
const changeTab = (index: number) => {
  current.value = index
  searchKeyword.value = null
  paging.value.reload()
}

// url拼接
const urlHost = (url) => {
  const loadurl = import.meta.env.VITE_UPLOAD_BASEURL
  return loadurl + url
}

// 从路由参数中获取初始Tab索引
onLoad((options) => {
  if (options.tabIndex) {
    current.value = parseInt(options.tabIndex)
  }
})

// 搜索处理
const handleSearch = () => {
  searchKeyword.value = searchKeyword.value.trim()
  paging.value.reload()
}

// 转换函数
const transformOrder = (item) => ({
  serviceName: item.service_title,
  serviceId: item.service_id,
  orderId: item.order_id,
  orderNo: item.order_no,
  image: urlHost(item.url),
  appointmentTime: `${item.appoint_date} ${item.appoint_time}`,
  addressId: item.repairs_id,
  address: item.receiver_address,
  price: formatMoney(item.price),
  statusText: getStatusText(item),
  statusClass: statusClassMap[item.trades_status] || '',
  worker: item.repair_id
    ? {
        name: item.repair_name,
        avatar: urlHost(item.repair_avatar),
        workNumber: item.repair_number,
        level: item.repair_level,
        phone: item.repair_phone,
        rating: Math.round(item.repair_score / 10),
        review: (item.appraise_tags || [])
          .map((tag) => tag?.tag_name || '') // 安全访问
          .filter((name) => name) // 过滤空值
          .join(','),
      }
    : null,
})

const queryList = async (pageNo, limit) => {
  try {
    let res = await getOrderPage({
      pageNum: pageNo,
      pageSize: limit,
      tradesStatus: tabs.value[current.value].status,
      serviceName: searchKeyword.value,
    })
    if (res.code == '000') {
      paging.value.complete(res.value.list.map(transformOrder))
      // console.log('res.order', res.value)
    }
  } catch (error) {
    paging.value.complete(false)
  }
}

const getStatusText = (item) => {
  // console.log(item)
  if (item.trades_status == 150) {
    if (item.is_appraise == 1) {
      return '已完成'
    } else {
      return '待评价'
    }
  } else {
    return orderStatusMap[item.trades_status]
  }
}

const canCelOrder = async (orderId) => {
  try {
    let res = await cancelOrder({
      orderId: orderId,
    })
    if (res.code == '000') {
      console.log('删除成功', res)
      paging.value.reload()
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    })
    console.error('删除失败:', error)
  }
}
// 计算属性
const selectedDate = computed(() => {
  return dateList.value[activeDateIndex.value] || {}
})
const selectedDateForDisplay = computed(() => {
  return selectedDate.value || dateList.value[activeDateIndex.value]
})
const selectedTime = computed(() => {
  return timeList.value[activeTimeIndex.value] || { str_time: '' }
})

// 显示修改时间弹窗
const showRePopTime = async (orderId, serviceId, addressId) => {
  selectedOrderId.value = orderId
  serviceIdForTime.value = serviceId
  addressIdForTime.value = addressId

  console.log('加载时间选择器数据:', {
    serviceId: serviceIdForTime.value,
    addressId: addressIdForTime.value,
  })

  // 重置选择状态
  activeDateIndex.value = 0
  activeTimeIndex.value = -1

  // 加载日期列表
  await loadDateList()

  // 显示弹窗
  showPopTime.value = true
}

// 加载日期列表
const loadDateList = async () => {
  try {
    const { code, value } = await getOrderWeekTimes({
      serviceId: serviceIdForTime.value,
    })

    if (code === '000') {
      dateList.value = value
      console.log('日期列表加载成功:', dateList.value)

      // 默认加载第一个日期的可用时间
      if (dateList.value.length > 0) {
        await loadTimeSlots(dateList.value[0].day)
      }
    }
  } catch (error) {
    console.error('获取日期列表失败:', error)
    uni.showToast({
      title: '获取日期列表失败',
      icon: 'none',
    })
  }
}

// 加载时间段
const loadTimeSlots = async (day) => {
  try {
    const { code, value } = await getOrderHourTimes({
      serviceId: serviceIdForTime.value,
      day: day,
      addressId: addressIdForTime.value,
    })

    if (code === '000') {
      let times = value.map((item) => ({
        times: item.str_time,
        num: parseInt(item.num),
        serviceFee: item.serviceFee,
      }))

      // 如果是今天，过滤掉已经过去的时间段
      if (isToday(day)) {
        const currentMinutes = getCurrentMinutes()
        times = times.filter((item) => {
          const timeParts = item.times.split(' - ')
          if (timeParts.length < 2) return false

          const startTime = timeParts[0]
          const startMinutes = timeToMinutes(startTime)

          return startMinutes >= currentMinutes
        })
      }

      console.log('时间段加载成功:', timeList.value)
      timeList.value = times
    }
  } catch (error) {
    console.error('获取时间段失败:', error)
    uni.showToast({
      title: '获取时间段失败',
      icon: 'none',
    })
  }
}

// 选择日期
const selectDate = async (item, index) => {
  activeDateIndex.value = index
  activeTimeIndex.value = -1
  await loadTimeSlots(item.day)
}

// 选择时间
const selectTime = (item, index) => {
  if (item.num <= 0) {
    uni.showToast({
      title: '该时间段不可预约',
      icon: 'none',
    })
    return
  }
  activeTimeIndex.value = index
}

// 格式化时间显示
const formatTime = (timeStr) => {
  return timeStr?.split(' - ')[0] || ''
}

// 获取星期名称
const getWeekName = (weekIndex) => {
  return weekList.value[weekIndex] || '未知'
}

// 确认时间选择
const confirmTimeSelection = async () => {
  if (activeTimeIndex.value === -1) {
    uni.showToast({
      title: '请选择预约时间',
      icon: 'none',
    })
    return
  }

  const selectedDate = dateList.value[activeDateIndex.value]
  const selectedTime = timeList.value[activeTimeIndex.value]
  const [startTime, endTime] = selectedTime.times.split(' - ')

  try {
    const res = await updateOrderTime({
      orderId: selectedOrderId.value,
      appointDate: selectedDate.day,
      appointTime: selectedTime.times.replace(' - ', '~'),
      serviceStartTime: `${selectedDate.day} ${startTime}:00`,
      serviceEndTime: `${selectedDate.day} ${endTime}:00`,
    })

    if (res.code === '000') {
      uni.showToast({
        title: '修改时间成功',
        icon: 'success',
        duration: 2000,
      })
      closePopup()
      // 刷新订单列表
      paging.value.reload()
    } else {
      uni.showToast({
        title: res.msg || '修改时间失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('修改时间失败:', error)
    uni.showToast({
      title: '修改时间失败',
      icon: 'none',
    })
  }
}
// 判断日期是否为今天
const isToday = (dateStr: string) => {
  const today = new Date()
  const date = new Date(dateStr)

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// 获取当前时间（分钟数）
const getCurrentMinutes = () => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + 60
}

// 将时间字符串转换为分钟数
const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}
// 关闭弹窗
const closePopup = () => {
  showPopTime.value = false
}
// 换元
const formatMoney = (fen) => {
  const amount = fen || 0
  return (amount / 100).toFixed(2)
}

// 联系师傅
const toContactMaster = (phone) => {
  uni.makePhoneCall({
    // 手机号
    phoneNumber: phone,
    // 成功回调
    success: (res) => {
      console.log('调用成功!')
    },
    // 失败回调
    fail: (res) => {
      console.log('调用失败!')
    },
  })
}

//取消订单
const toCannel = (orderId) => {
  uni.showModal({
    title: '取消订单',
    content: '是否要取消订单？',
    success: (res) => {
      if (res.confirm) {
        canCelOrder(orderId)
      }
    },
  })
}

// 跳转到申请开票
const toInvoice = (orderId) => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/invoicePage?orderId=${orderId}`,
  })
}

// 跳转到订单详情页面
const toOrderDetail = (order) => {
  if (order.statusText != '已取消') {
    uni.navigateTo({ url: `/pages-sub/mine/order/orderDetail?orderId=${order.orderId}` })
  } else {
    uni.showToast({
      title: '订单已取消，无法查看详情',
      icon: 'none',
    })
  }
}

// 跳转到评价
const toEvaluate = (orderId) => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/evaluate?orderId=${orderId}`,
  })
}

// 跳转到支付页面
const toPayment = (orderId) => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/payment?orderId=${orderId}`,
  })
}

const goBack = () => {
  uni.switchTab({
    url: '/pages/mine/index',
  })
}
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
    border-radius: 50rpx;
    height: 80rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    padding: 0 20rpx;

    .search-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      height: 100%;
      color: #333;
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

.content-container {
  flex: 1;
  position: relative;
  z-index: 10;
  height: calc(100vh - 210px);
  /* 减去背景图高度 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
}

.content-section {
  flex: 1;
  padding: 20rpx 30rpx;
  overflow-y: auto;
  /* 允许垂直滚动 */
  height: 100%;

  .order-card {
    background-color: white;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20rpx;

      .service-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .order-status {
        font-size: 26rpx;
        padding: 6rpx 15rpx;
        border-radius: 30rpx;

        &.status-waiting {
          background-color: #fff6e6;
          color: #fa8c16;
        }

        &.status-pending {
          background-color: #f0f7ff;
          color: #1890ff;
        }

        &.status-serving {
          background-color: #e6f7ff;
          color: #13c2c2;
        }

        &.status-review {
          background-color: #f6ffed;
          color: #52c41a;
        }
        &.status-judge {
          background-color: #fff8ee;
          color: #f5a623;
        }

        &.status-canceled {
          color: #999999;
        }
      }
    }

    .order-body {
      display: flex;
      align-items: flex-start;
      /* 顶部对齐 */
      padding: 20rpx 0;
      border-bottom: 1rpx solid #eee;
      /* 替代原订单详情的下边框 */
    }

    .order-image {
      width: 200rpx;
      height: 260rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
      /* 默认背景色 */
      flex-shrink: 0;
      /* 防止图片压缩 */
    }

    .order-details {
      flex: 1;
      padding-bottom: 25rpx;

      .detail-item {
        display: flex;
        margin-bottom: 16rpx;
        align-items: flex-start;

        &:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 26rpx;
          color: #666;
          min-width: 140rpx;
        }

        .detail-value {
          font-size: 26rpx;
          color: #333;
          flex: 1;
        }

        .detail-price {
          font-size: 32rpx;
          color: #ff4444;
          font-weight: bold;
        }
      }
    }

    .order-footer {
      padding-top: 20rpx;
      display: flex;
      justify-content: flex-end;

      .order-time {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 15rpx;
      }

      .order-actions {
        display: flex;
        justify-content: flex-end;

        .action-btn {
          height: 60rpx;
          line-height: 60rpx;
          min-width: 140rpx;
          font-size: 26rpx;
          padding: 0 25rpx;
          border-radius: 30rpx;
          margin-bottom: 10rpx;
          background-color: #dadfe8;
          color: white;
          margin-left: 15rpx;

          &.primary {
            background-color: #007aff;
          }

          &.grey {
            background-color: #a2b4d3;
          }

          &.orange {
            background-color: #ff833f;
          }

          &.silvery {
            background-color: #f6f8fb;
            border: 1px solid #8891a0;
            color: #8891a0;
          }
        }
      }
    }
  }

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

.detail-item2 {
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  padding: 15rpx 0;

  .detail-label {
    font-size: 26rpx;
    color: #666;
    min-width: 140rpx;
    margin-bottom: 10rpx;
  }
}

.worker-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.worker-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  margin-right: 16rpx;
}

.worker-name-worknumber {
  display: flex;
  flex-direction: column;
  margin-right: 20rpx;
}

.worker-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  line-height: 1.4;
}

.worker-worknumber {
  font-size: 24rpx;
  color: #666;
}

.level-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.worker-phone {
  font-size: 26rpx;
  color: #1890ff;
  font-weight: bold;
}

.rating-review {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.rating {
  display: flex;
  margin-right: 15rpx;
}

.star {
  width: 28rpx;
  height: 28rpx;
  margin-right: 4rpx;
}

.review-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}

.review-item {
  font-size: 24rpx;
  color: #1890ff;
  background-color: #ecf5ff;
  padding: 4rpx 16rpx;
  border-radius: 24rpx;
  margin-right: 10rpx;
  margin-bottom: 5rpx;
}

/* 添加底部提示字段样式 */
.load-more-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #999;

  .no-more-data {
    padding: 20rpx 0;
  }
}

/* 自定义弹窗样式 */
.custom-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;

  &.popup-show {
    visibility: visible;
    opacity: 1;

    .popup-content {
      transform: translateY(0);
    }
  }

  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .popup-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f8f9f8;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .popup-footer-bar {
    display: flex;
    background-color: white;
    border-radius: 20px;
    align-items: center;
    margin: 5px 10px 20px 10px;
    z-index: 10;
  }

  .selected-time {
    font-size: 16px;
    color: #333;
    margin-left: 15px;
  }

  .confirm-btn {
    width: 180rpx;
    height: 80rpx;
    background-color: #007aff;
    color: white;
    border-radius: 35rpx;
    font-size: 33rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
    margin-right: 5px;
  }
}

/* 时间选择器样式 */
.time-picker-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.date-container {
  width: 100%;
  overflow: hidden;
  background-color: white;
}

.date-list {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  width: 100%;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 80px;
  padding: 12px 0;

  &.active {
    background-color: #f0f7ff;
    border-radius: 8px;

    .week-day {
      color: #2f72f6;
      font-weight: bold;
    }

    .date {
      color: #2f72f6;
    }
  }
}

.week-day {
  font-size: 16px;
  font-weight: 500;
}

.date {
  font-size: 12px;
  margin-top: 4px;
}

.time-container {
  flex: 1;
  margin: 10px;
}

.time-list {
  background-color: white;
  border-radius: 8px;
}

.time-item {
  height: 85rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f2f5;
  font-size: 30rpx;

  &.available {
    color: #333;
  }

  &.selected {
    background-color: #f0f7ff;
    position: relative;
    color: #2f72f6;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 6rpx;
      height: 100%;
      background-color: #2f72f6;
    }
  }
}
</style>
