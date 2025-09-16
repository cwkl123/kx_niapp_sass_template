<template>
  <view class="text-xs">
    <view class="flex">
      <!-- 110 待接单  120待服务  140待支付 150待评价 180 代售后 -->
      <view v-if="orderStatus.status === 110" class="order-btn bg-gray-400" @click="updateTime">
        修改时间
      </view>

      <view v-if="orderStatus.status === 110" class="order-btn bg-gray-200" @click="toCannel">
        取消订单
      </view>

      <view
        v-if="orderStatus.status === 120"
        class="order-btn bg-blue-500 ml-2.5"
        @click="toContactMaster"
      >
        联系师傅
      </view>

      <view v-if="shouldShowAmount" class="absolute left-0 py-2.5 px-2.5">
        <text class="text-gray-400 text-xxs">已支付:￥{{ formatAmount(payAmount) }}</text>
        <br />
        尾款待支付:
        <text class="text-end">￥{{ formatAmount(notPayAmount) }}</text>
      </view>

      <view v-if="orderStatus.status === 140" class="order-btn bg-orange-500" @click="toPay">
        去支付
      </view>

      <view
        v-if="orderStatus.status === 150 && invoice_status === 0"
        class="order-btn bg-gray-50 border border-blue-300 text-blue-300"
        @click="toInvoice"
      >
        申请开票
      </view>

      <view
        v-if="orderStatus.status === 150 && isAppraise === 0"
        class="order-btn bg-orange-400"
        @click="toEvaluate"
      >
        去评价
      </view>

      <view
        v-if="orderStatus.status === 180"
        class="order-btn bg-gray-200 ml-2.5"
        @click="afterSale"
      >
        申请售后
      </view>
    </view>

    <wd-popup v-model="timeShow" position="bottom" :safe-area-inset-bottom="true">
      <orderSelTime
        ref="sel_time"
        :service-id="servceItemId"
        :address-id="repairsId"
        @selected="onSelTime"
      />
    </wd-popup>
  </view>
</template>

<script setup>
import { cancelOrder, updateOrderTime } from '@/service/order/orderApi'
import orderSelTime from '@/components/order/orderSelTime'

const props = defineProps({
  isDetail: Boolean,
  order: Object,
  orderId: [String, Number],
  servceId: [String, Number],
  addressId: [String, Number],
  payAmount: [String, Number],
  notPayAmount: [String, Number],
  mobile: String,
  orderStatus: Object,
  showStatus: Boolean,
  isAppraise: Number,
  invoice_status: Number,
})

const emit = defineEmits(['onHandlerOver'])

// 响应式状态
const timeShow = ref(false)
const servceItemId = ref('')
const repairsId = ref('')
const sel_time = ref(null)

// 计算属性
const shouldShowAmount = computed(() => {
  return (
    props.orderStatus.status === 140 &&
    props.payAmount != null &&
    props.payAmount !== '' &&
    props.notPayAmount != null &&
    props.notPayAmount !== ''
  )
})

watch(
  () => timeShow.value,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      if (sel_time.value?.initDateList) {
        console.log('初始化时间组件')
        await sel_time.value.initDateList()
      } else {
        console.warn('sel_time 未挂载或方法不存在')
      }
    }
  },
)

const onTimePopupOpen = async () => {
  await nextTick()
  if (sel_time.value?.initDateList) {
    console.log('初始化日期数据')
    await sel_time.value.initDateList()
  }
}

// 金额格式化 (替换原过滤器)
const formatAmount = (value) => {
  const num = Number(value)
  if (isNaN(num)) {
    console.warn('formatAmount: 输入不是有效数字', value)
    return '0.00'
  }
  return (num / 100).toFixed(2)
}

// 事件处理函数
const makePhoneCall = (mobile) => {
  uni.makePhoneCall({ phoneNumber: mobile })
}

const updateTime = () => {
  repairsId.value = props.addressId || props.order?.repairs_id
  servceItemId.value = props.servceId || props.order?.service_id
  timeShow.value = true
}

const toCannel = () => {
  uni.showModal({
    title: '取消订单',
    content: '是否要取消订单？',
    success: async (res) => {
      if (res.confirm) await cancelOrder1()
    },
  })
}

// 修改：实现路由函数替代
const getCurrentRoute = () => {
  const pages = uni.getCurrentPages()
  return pages.length > 0 ? pages[pages.length - 1].route : ''
}

// 修改事件处理函数
const cancelOrder1 = async () => {
  try {
    const [, data] = await cancelOrder({ orderId: props.orderId })
    if (data?.success) {
      // 使用新的路由获取方法
      const currentRoute = getCurrentRoute()

      // 判断路由路径
      if (currentRoute.includes('MyOrderBtn')) {
        uni.redirectTo({
          url: '/pages-sub/mine/order/orderDetail?index=1',
        })
      } else {
        emit('onHandlerOver', { type: 'cannel' })
      }
    }
  } catch (error) {
    console.error('取消订单失败:', error)
  }
}

const toContactMaster = () => {
  makePhoneCall(props.mobile)
}

const toPay = () => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/payment?orderId=${props.orderId}`,
  })
}

const toEvaluate = () => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/evaluate?data=${JSON.stringify({ orderId: props.orderId })}`,
  })
}

const toInvoice = () => {
  uni.navigateTo({
    url: `/pages-sub/mine/order/InvoicePage?data=${JSON.stringify({ orderId: props.orderId })}`,
  })
}

const afterSale = () => {
  uni.showToast({ icon: 'none', title: '功能开发中' })
}

const handlePopupClose = () => {
  timeShow.value = false
}

const onSelTime = async (data) => {
  timeShow.value = false
  try {
    const response = await updateOrderTime({
      orderId: props.orderId,
      appointDate: data.appointDate,
      appointTime: data.appointTime,
      serviceStartTime: data.serviceStartTime,
      serviceEndTime: data.serviceEndTime,
    })

    if (response?.success) {
      if (props.isDetail) {
        uni.redirectTo({
          url: `/pages/modules/order/info/OrderInfoPage?orderId=${props.orderId}`,
        })
      } else {
        const orderValue = uni.getStorageSync('orderPageIndex')
        uni.redirectTo({
          url: `/pages/modules/order/my/MyOrderPage?index=${orderValue || 0}`,
        })
      }
    }
  } catch (error) {
    console.error('预约时间更新失败:', error)
  }
}
</script>

<style scoped>
.order-btn {
  height: 32px;
  padding: 0 10px;
  margin: 15px 1;
  color: white;
  line-height: 32px;
  text-align: center;
  border-radius: 50px;
}

.text-xxs {
  font-size: 12px;
}

.text-end {
  font-size: 14px;
  color: #007aff;
}
</style>
