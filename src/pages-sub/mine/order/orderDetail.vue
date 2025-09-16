<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '订单详情',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view view class="page-container">
    <view
      style="position: absolute; width: 100%; height: 80vh; z-index: 0; padding-top: -20px"
      :style="`background: linear-gradient(180deg, ${themeColor} 40%, #2f72f600 80%)`"
    ></view>
    <!-- 页面描述 -->
    <view class="nav-bar">
      <view @click="handleClickLeft()">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">订单详情</text>
      </view>
    </view>
    <view
      style="
        padding: 0 15px;
        flex: 1;
        display: flex;
        flex-direction: column;
        height: calc(100% - 44px);
      "
    >
      <view style="flex: 1; overflow: hidden">
        <template v-if="order">
          <view style="height: 100%; display: flex; flex-direction: column">
            <view style="flex: 1; height: 0px">
              <scroll-view
                :scroll-y="true"
                show-scrollbar="{{false}}"
                style="height: 100%; box-sizing: border-box; padding-bottom: 200rpx"
              >
                <!-- 订单状态 -->
                <view
                  style="
                    font-size: 18px;
                    font-weight: 500;
                    padding-top: 10px;
                    color: #ffffff;
                    margin-bottom: 10px;
                  "
                >
                  订单状态 --
                  <span
                    style="margin-left: 5px"
                    :class="statusClassMap[order.orderInfo.tradesStatus]"
                  >
                    {{ getStatusText(order.orderInfo) }}
                  </span>
                </view>
                <!-- 订单 师傅信息 -->
                <view
                  v-if="
                    order.orderInfo.tradesStatus !== 110 ||
                    order.orderInfo.tradesStatus === 160 ||
                    order.orderInfo.tradesStatus === 170
                  "
                  style="border-radius: 10px; background-color: #ffffff; padding: 15px 0"
                >
                  <view style="display: flex; align-items: center; padding: 0 15px">
                    <view style="height: 60px; width: 60px">
                      <image mode="aspectFit" src="/static/images/mine/order/logo.png" />
                    </view>
                    <view style="flex: 1; margin-left: 15px">
                      <view style="flex: 1; font-size: 16px; font-weight: 500">
                        {{ order.serviceInfo?.repairInfo.name }}
                      </view>
                    </view>
                    <view v-if="order.orderInfo.tradesStatus !== 150" class="font-small">
                      {{ order.serviceInfo?.repairInfo.mobile }}
                    </view>
                    <view
                      v-if="order.orderInfo.tradesStatus !== 150"
                      class="phone-view"
                      @click="makePhoneCall(order.serviceInfo.repairInfo.mobile)"
                    >
                      <wd-icon
                        name="call"
                        size="12px"
                        style="margin-right: 2px; margin-left: 2px"
                      ></wd-icon>
                      <span>拨打</span>
                    </view>
                  </view>
                </view>
                <!-- 订单 用户信息 -->
                <view style="background-color: #ffffff; border-radius: 10px; margin: 10px 0">
                  <view style="display: flex; align-items: center; padding: 10px">
                    <view style="margin-right: 15px">
                      <!-- <u-icon name="map-fill" color="#bbbbbb" size="48"></u-icon> -->
                      <wd-icon name="location" size="28px" color="#bbbbbb"></wd-icon>
                    </view>
                    <view
                      style="
                        flex: 1;
                        font-size: 16px;
                        margin: 10px 15px 5px 0;
                        font-weight: 400;
                        color: #424242;
                      "
                    >
                      <view>
                        <span>{{ order.addressInfo.name }}</span>
                        <span style="margin-left: 15px">{{ order.addressInfo.phone }}</span>
                      </view>
                      <view style="color: #b2b2b2; font-size: 14px">
                        {{ order.addressInfo.address }}
                      </view>
                    </view>
                    <view
                      @click="onEditAddress()"
                      v-if="order.orderInfo.tradesStatus == 110"
                      style="
                        height: 32px;
                        padding-left: 10px;
                        padding-right: 10px;
                        margin: 15px 4px;
                        background-color: #a2b4d3;
                        color: white;
                        line-height: 32px;
                        text-align: center;
                        border-radius: 50px;
                      "
                    >
                      修改地址
                    </view>
                  </view>
                </view>
                <!-- 订单 服务项信息 -->
                <view
                  style="
                    background: white;
                    padding-top: 2px;
                    padding-bottom: 5px;
                    border-radius: 10px;
                  "
                >
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view style="display: flex; margin-top: 10px">
                      <template>
                        <view style="height: 75px; width: 90px">
                          <image :src="getImgUrl(order.orderInfo.url)" mode="scaleToFill" />
                        </view>
                        <view style="flex: 1; margin-left: 10px">
                          <view class="serviceTitle">
                            {{ order.orderInfo.serviceTitle }}
                          </view>
                          <view class="serviceDescribe">
                            {{ order.orderInfo.name }}
                          </view>
                        </view>
                        <view style="font-size: 14px; font-weight: 500; color: #424242">
                          {{ '￥' + formatAmount(order.orderInfo.price) }}
                        </view>
                      </template>
                    </view>
                  </view>
                  <view style="height: 1px; background-color: #f7f7fa"></view>
                  <view style="display: flex; margin: 10px">
                    <view class="time-view">预约上门时间</view>
                    <view class="time-text">
                      {{ order.orderInfo.appointDate }}
                      {{ formatHour(order.orderInfo.appointTime) }}
                    </view>
                  </view>
                  <view
                    style="display: flex; margin: 10px"
                    v-if="order.serviceInfo?.repairInfo?.serviceStartTime"
                  >
                    <view class="time-view">服务开始时间</view>
                    <view class="time-text">
                      {{ order.serviceInfo.repairInfo.serviceStartTime }}
                    </view>
                  </view>
                  <view
                    style="display: flex; margin: 10px"
                    v-if="order.serviceInfo?.repairInfo?.serviceEndTime"
                  >
                    <view class="time-view">服务结束时间</view>
                    <view class="time-text">
                      {{ order.serviceInfo.repairInfo.serviceEndTime }}
                    </view>
                  </view>
                </view>
                <!-- 订单号,备注信息 -->
                <view class="order-info">
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view class="time-view">订单编号</view>
                      <view style="flex: 1; text-align: right">
                        {{ order.orderInfo.orderNo }}
                      </view>
                    </view>
                    <view style="height: 1px; background-color: #f7f7fa"></view>
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view class="time-view">下单时间</view>
                      <view style="flex: 1; text-align: right">
                        {{ order.orderInfo.orderTime }}
                      </view>
                    </view>
                    <view style="height: 1px; background-color: #f7f7fa"></view>
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view class="time-view">报修备注</view>
                    </view>
                    <view style="display: flex; margin-top: 10px">
                      <view style="flex: 1; font-size: 14px; color: #606266">
                        {{ order.orderInfo.buyerMessage }}
                      </view>
                    </view>
                    <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
                      <view style="margin-top: 10px">
                        <image
                          v-for="(item, index) in images"
                          :src="item"
                          @click="previewImg(index)"
                          style="width: 100px; height: 100px; margin: 5px"
                        ></image>
                      </view>
                    </scroll-view>
                  </view>
                </view>
                <!--费用明细  -->
                <view class="fee-info">
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view style="font-size: 17px; font-weight: 700; margin-bottom: 10px">
                      费用明细
                    </view>
                    <view
                      style="
                        background-color: white;
                        overflow: hidden;
                        border-radius: 5px;
                        border: 1px rgba(241, 243, 245, 0.99) solid;
                      "
                    >
                      <view
                        class="t-line"
                        style="background-color: rgba(196, 217, 241, 0.56); color: #475b78"
                      >
                        <view class="t-name">收费项</view>
                        <view class="t-pirce">费用</view>
                      </view>
                      <view v-for="(item, key) in order.feeInfo.fee_detail" :key="key">
                        <view v-if="key % 2 === 0" class="t-line" style="color: #555555">
                          <view class="t-name">
                            {{ item.title }}
                          </view>
                          <view class="t-pirce">
                            <template>￥{{ formatAmount(item.fee) }}</template>
                          </view>
                        </view>

                        <view v-else class="t-line" style="color: #555555; background: #f4f7fa">
                          <view class="t-name">
                            {{ item.title }}
                          </view>
                          <view class="t-pirce">
                            <template>￥{{ formatAmount(item.fee) }}</template>
                          </view>
                        </view>
                      </view>
                      <view class="t-line" style="color: #555555">
                        <view class="t-name">总价</view>
                        <view class="t-pirce" style="color: #ffaa00">
                          <template>￥{{ formatAmount(order.feeInfo.countFee) }}</template>
                        </view>
                      </view>
                      <view class="t-line" style="color: #555555; background: #f4f7fa">
                        <view class="t-name">已支付</view>
                        <view class="t-pirce" style="color: #ffaa00">
                          ￥{{ formatAmount(order.feeInfo.paid) }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>

                <!--首款支付 信息  -->
                <view class="first-pay-info" v-if="order.orderPayInfo[0]">
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view style="display: flex">
                      <view
                        style="width: 3px; background-color: #007aff; height: 16px; margin: auto 0"
                      ></view>
                      <view style="flex: 1; font-size: 16px; font-weight: 700; margin-left: 3px">
                        首款
                      </view>
                      <view style="color: #007aff; font-weight: 700">已支付</view>
                    </view>
                    <view v-if="order.orderPayInfo[0].isPay == 1">
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px">上门费</view>
                        <view style="flex: 1; text-align: right">
                          ￥{{ formatAmount(order.orderPayInfo[0].serveFee) }}
                        </view>
                      </view>
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px">小计</view>
                        <view style="flex: 1; text-align: right">
                          ￥{{ formatAmount(order.orderPayInfo[0].sumFee) }}
                        </view>
                      </view>
                      <view style="height: 1px; background-color: #ebebec"></view>
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px; font-weight: 600">
                          已支付金额
                        </view>
                        <view style="flex: 1; text-align: right; color: #ffaa00">
                          ￥{{ formatAmount(order.orderPayInfo[0].payFee) }}
                        </view>
                      </view>
                      <view style="height: 1px; background-color: #ebebec"></view>
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px">支付时间</view>
                        <view style="flex: 1; text-align: right">
                          {{ order.orderPayInfo[0].createTime }}
                        </view>
                      </view>
                      <view
                        v-if="order.orderPayInfo[0] && order.orderPayInfo[0].isPay == 1"
                        style="display: flex; margin-top: 10px; margin-bottom: 10px"
                      >
                        <view style="width: 100px; font-size: 13px">支付方式</view>
                        <!-- 支付方式: 1 ali (支付宝) ，2.wx (微信)，3.内部结算 4.cash（现金） -->
                        <view
                          v-if="order.orderPayInfo[0].payStyle == 1"
                          style="flex: 1; text-align: right; color: red"
                        >
                          支付宝支付
                        </view>
                        <view
                          v-if="order.orderPayInfo[0].payStyle == 2"
                          style="flex: 1; text-align: right; color: red"
                        >
                          微信支付
                        </view>
                        <view
                          v-if="order.orderPayInfo[0].payStyle == 3"
                          style="flex: 1; text-align: right; color: red"
                        >
                          内部结算
                        </view>
                        <view
                          v-if="order.orderPayInfo[0].payStyle == 4"
                          style="flex: 1; text-align: right; color: red"
                        >
                          现金结算
                        </view>
                      </view>
                      <view
                        v-if="
                          order.orderPayInfo[0] &&
                          order.orderPayInfo[0].isPay == 1 &&
                          order.orderPayInfo[0].transactionId
                        "
                        style="display: flex; margin-top: 10px; margin-bottom: 10px"
                      >
                        <view style="width: 100px; font-size: 13px">支付流水号</view>
                        <view style="flex: 1; text-align: right">
                          {{ order.orderPayInfo[0].transactionId }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>

                <!-- 尾款 -->
                <view class="end-pay-info" v-if="order.orderPayInfo[1]">
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view style="display: flex">
                      <view
                        style="width: 3px; background-color: #007aff; height: 16px; margin: auto 0"
                      ></view>
                      <view style="flex: 1; font-size: 16px; font-weight: 700; margin-left: 3px">
                        尾款
                      </view>
                      <view
                        style="font-weight: 700"
                        :style="
                          order.orderPayInfo[1] && order.orderPayInfo[1].isPay == 1
                            ? 'color:#007AFF'
                            : 'color:red'
                        "
                      >
                        {{
                          order.orderPayInfo[1] && order.orderPayInfo[1].isPay == 1
                            ? '已支付'
                            : '未支付'
                        }}
                      </view>
                    </view>

                    <view style="height: 1px; background-color: #f7f7fa"></view>
                    <view v-for="(item, key) in order.orderPayInfo[1].fee_detail" :key="key">
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px">
                          {{ item.title }}
                        </view>
                        <view style="flex: 1; text-align: right">
                          ￥{{ formatAmount(item.fee) }}
                        </view>
                      </view>
                      <view style="height: 1px; background-color: #f7f7fa"></view>
                    </view>
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view style="width: 100px; font-size: 13px">小计</view>
                      <view style="flex: 1; text-align: right">
                        ￥{{ formatAmount(order.orderPayInfo[1].sumFee) }}
                      </view>
                    </view>

                    <view v-if="order.orderPayInfo[1] && order.orderPayInfo[1].isPay == 1">
                      <view style="height: 1px; background-color: #ebebec"></view>
                      <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                        <view style="width: 100px; font-size: 13px; font-weight: 600">
                          已支付金额
                        </view>
                        <view style="flex: 1; text-align: right; color: #ffaa00">
                          ￥{{ formatAmount(order.orderPayInfo[1].sumFee) }}
                        </view>
                      </view>
                      <view style="height: 1px; background-color: #ebebec"></view>
                    </view>

                    <view
                      style="display: flex; margin-top: 10px; margin-bottom: 10px"
                      v-if="order.orderPayInfo[1] && order.orderPayInfo[1].isPay == 1"
                    >
                      <view style="width: 100px; font-size: 13px">支付时间</view>
                      <view style="flex: 1; text-align: right">
                        {{ order.orderPayInfo[1].createTime }}
                      </view>
                    </view>

                    <view
                      style="display: flex; margin-top: 10px; margin-bottom: 10px"
                      v-if="order.orderPayInfo[1] && order.orderPayInfo[1].isPay == 1"
                    >
                      <view style="width: 100px; font-size: 13px">支付方式</view>
                      <!-- 支付方式: 1 ali (支付宝) ，2.wx (微信)，3.内部结算 4.cash（现金） -->
                      <view
                        v-if="order.orderPayInfo[1].payStyle == 1"
                        style="flex: 1; text-align: right; color: red"
                      >
                        支付宝支付
                      </view>
                      <view
                        v-if="order.orderPayInfo[1].payStyle == 2"
                        style="flex: 1; text-align: right; color: red"
                      >
                        微信支付
                      </view>
                      <view
                        v-if="order.orderPayInfo[1].payStyle == 3"
                        style="flex: 1; text-align: right; color: red"
                      >
                        内部结算
                      </view>
                      <view
                        v-if="order.orderPayInfo[1].payStyle == 4"
                        style="flex: 1; text-align: right; color: red"
                      >
                        现金结算
                      </view>
                    </view>

                    <view
                      v-if="
                        order.orderPayInfo[1] &&
                        order.orderPayInfo[1].isPay == 1 &&
                        order.orderPayInfo[1].transactionId
                      "
                      style="display: flex; margin-top: 10px; margin-bottom: 10px"
                    >
                      <view style="width: 100px; font-size: 13px">支付流水号</view>
                      <view style="flex: 1; text-align: right">
                        {{ order.orderPayInfo[1].transactionId }}
                      </view>
                    </view>
                  </view>
                </view>
                <!-- 服务评价 -->
                <view
                  style="
                    background: white;
                    padding-top: 15px;
                    padding-bottom: 15px;
                    margin-top: 10px;
                    border-radius: 10px;
                    margin-bottom: 150rpx;
                  "
                  v-if="orderInfo.orderStatus == 150"
                >
                  <view style="margin-right: 15px; margin-left: 15px">
                    <view
                      style="
                        font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 10px;
                        font-weight: 600;
                      "
                    >
                      服务评价
                    </view>
                    <star-rating :score="orderInfo.starLevel"></star-rating>
                    <view
                      style="
                        display: flex;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        margin-left: -5px;
                      "
                    >
                      <view style="flex: 1; font-size: 10px; color: #606266">
                        <view
                          v-for="(item, index) in orderInfo.evaluateLableList"
                          :key="item.id"
                          style="
                            font-size: 12px;
                            border-radius: 5px;
                            padding-left: 10px;
                            padding-right: 10px;
                            margin-left: 5px;
                            margin-top: 5px;
                            height: 24px;
                            width: auto;
                            background: #288af3;
                            line-height: 24px;
                            text-align: center;
                            color: white;
                            float: left;
                          "
                        >
                          {{ item }}
                        </view>
                      </view>
                    </view>
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view style="width: 100px; font-size: 13px">意见反馈</view>
                    </view>
                    <view style="display: flex; margin-top: 10px; margin-bottom: 10px">
                      <view style="flex: 1; color: #606266" v-if="orderInfo.feedback">
                        {{ orderInfo.feedback }}
                      </view>
                      <view style="flex: 1; color: #606266" v-else>无</view>
                    </view>
                  </view>
                </view>
              </scroll-view>
            </view>
            <view
              style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: white;
                padding: 10px 15px;
                z-index: 100;
              "
            >
              <view class="mx-[15px] flex">
                <view class="flex-1"></view>
                <OrderBtn
                  @on-handler-over="onHandlerOver"
                  :is-detail="true"
                  :show-status="true"
                  :order="order.orderInfo"
                  :order-id="pageParam.orderId || order?.orderInfo?.orderId"
                  :servce-id="order?.orderInfo?.serviceId"
                  :address-id="order?.orderInfo?.repairsId || order?.addressInfo?.repairsId"
                  :pay-amount="getPaidAmount()"
                  :not-pay-amount="getNotPayAmount()"
                  :mobile="order?.serviceInfo?.repairInfo?.mobile"
                  :order-status="{ status: order?.orderInfo?.tradesStatus }"
                  :is-appraise="order?.orderInfo?.isAppraise"
                  :invoice-status="order?.invoiceInfo?.invoiceStatus"
                />
              </view>
              <view :style="{ height: safeAreaInsets?.bottom + 'px' }"></view>
            </view>
          </view>
          <view></view>
        </template>
        <!-- 订单异常 -->
        <template v-if="fail">
          <view class="fail">
            <image
              src="/static/images/mine/order/order_empty.png"
              style="width: 160px; height: 100px; margin: 5px"
              mode="scaleToFill"
            />
            <view style="height: 50px">
              <text>加载失败</text>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup>
import StarRating from '@/components/star-rating/star-rating.vue'
import { getSafeAreaInsets } from '@/utils'
import { orderStatusMap, statusClassMap } from './constants'
import { getDetail, updateOrderAddress } from '@/service/order/orderApi'
import { getHostUrl } from '@/service/cfgUrl.js'
import OrderBtn from '@/components/order/orderBtn'
let themeColor = inject('themeColor')
// 安全区域
const { safeAreaInsets } = getSafeAreaInsets()
const order = ref()
// 模拟数据
const fail = ref(false)
const orderInfo = ref({})

const serviceInfo = reactive({})

const getImgUrl = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}
const images = ref([])
// 获取订单状态文本
const getStatusText = (item) => {
  if (item.tradesStatus == 150) {
    if (item.isAppraise == 1) {
      return '已完成'
    } else {
      return '待评价'
    }
  } else {
    return orderStatusMap[item.tradesStatus]
  }
}
// 页面参数
const pageParam = ref({
  orderId: '10001',
})

// 金额格式化函数
const formatAmount = (value) => {
  if (!value) return '0.00'
  return Number(value / 100).toFixed(2)
}

// 时间格式化
const formatHour = (time) => {
  // 处理空值情况
  if (!time) return ''

  try {
    const [start] = time.match(/^\d{1,2}:\d{2}/)?.[0].split('~') || []
    if (!start) return ''

    // 补充秒级精度
    return /:\d{2}$/.test(start)
      ? `${start}:00` // 追加秒数
      : start // 异常格式保持原样
  } catch {
    return '' // 异常捕获
  }
}

// 计算已支付金额
const getPaidAmount = () => {
  return order.value?.feeInfo?.paid || 0
}

// 计算待支付金额
const getNotPayAmount = () => {
  const paid = order.value?.feeInfo?.paid || 0
  const total = order.value?.feeInfo?.countFee || 0
  return total - paid > 0 ? total - paid : 0
}

// 打电话
const makePhoneCall = (phone) => {
  if (!phone) return
  uni.makePhoneCall({ phoneNumber: phone })
}

// 返回上一页
const handleClickLeft = () => {
  uni.navigateBack()
}

// 编辑地址
const onEditAddress = () => {
  uni.navigateTo({
    url: `/pages-sub/mine/address/mineAddressPage?selectAddress=true`,
    events: {
      onAddressSelected: handleAddressSelected,
    },
  })
}

// 处理地址选择事件
const handleAddressSelected = (address) => {
  console.log('收到选中的地址:', address)
  updateOrderAddress1(address)
}

// 更新订单地址
const updateOrderAddress1 = async (data) => {
  if (!pageParam.value.orderId) {
    console.error('缺少 orderId')
    return
  }

  try {
    console.log(pageParam.value.orderId, data.repairsId)
    const res = await updateOrderAddress({
      orderId: pageParam.value.orderId,
      repairsId: data.repairsId,
    })
    if (res.code === '000') {
      console.log('地址更新成功:', res)
      await loadOrder(pageParam.value.orderId)
    }
  } catch (error) {
    console.error('地址更新失败:', error)
  }
}

const onHandlerOver = (event) => {
  console.log('处理完成事件:', event)
  // 根据事件类型执行不同操作
  if (event.type === 'cannel') {
    // 处理订单取消后的逻辑
  }
}

// 预览图片
const previewImg = (index) => {
  uni.previewImage({
    current: images.value[index],
    urls: images.value,
  })
}

const loadOrder = async (id) => {
  const { code, message, value } = await getDetail({ orderId: id })
  if (code == '000') {
    order.value = value
    console.log('订单详情:', value)
    if (order.value.orderInfo.buyerImgs) {
      images.value = []
      if (order.value.orderInfo.buyerImgs.includes(',')) {
        var arr = order.value.orderInfo.buyerImgs.split(',')
        console.log('arr', arr)
        for (var i = 0; i < arr.length; i++) {
          images.value.push(getHostUrl(arr[i]))
        }
      } else {
        images.value.push(getHostUrl(order.value.orderInfo.buyerImgs))
      }

      console.log('images：', images.value)
    }
  } else {
    order.value = null
    fail.value = true
    uni.showToast({
      title: message,
      icon: 'none',
    })
  }
}

// 初始化页面
onLoad(async (option) => {
  if (option && option.orderId) {
    pageParam.value.orderId = option.orderId
    await loadOrder(option.orderId)
  }
})
</script>

<style scoped>
.page-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  flex: 1;
}

.nav-bar {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 0 16px;
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

.font-small {
  font-size: 14px;
}
.phone-view {
  font-size: 12px;
  border-radius: 5px;
  margin-left: 15px;
  height: 24px;
  width: 52px;
  background: #288af3;
  line-height: 24px;
  text-align: center;
  color: white;
}
.t-line {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 14px;
  display: flex;
  height: 100%;
  line-height: 20px;
  /* height: 40px; */
  /* line-height:40px; */
  align-items: center;
}

.t-name {
  word-break: break-all;
  flex: 3;
  border-right: 1px rgba(166, 191, 218, 0.34) solid;
  text-align: center;
  height: 100%;
}

.t-unit {
  word-break: break-all;
  width: 60px;
  border-right: 1px rgba(166, 191, 218, 0.34) solid;
  text-align: center;
  height: 100%;
}

.t-pirce {
  width: 90px;
  text-align: center;
  height: 100%;
}

.scroll-view_H {
  white-space: nowrap;
  width: 100%;
}
.fail {
  text-align: center;
  align-items: center;
  display: flex;
  height: 100%;
  flex-direction: column;
  margin-top: 10vh;
  color: #999999;
}
.status-waiting {
  color: #fa8c16;
}

.status-pending {
  color: #1890ff;
}

.status-serving {
  color: #13c2c2;
}

.status-review {
  color: #52c41a;
}
.status-judge {
  color: #f5a623;
}

.status-canceled {
  color: #999999;
}
.time-text {
  flex: 1;
  text-align: right;
  color: #007aff;
  font-size: 13px;
}
.time-view {
  width: 100px;
  font-size: 14px;
}
.serviceTitle {
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
  color: #424242;
}
.serviceDescribe {
  font-size: 12px;
  margin-top: 6px;
  font-weight: 400;
  color: #b2b2b2;
}
.order-info {
  background: #ffffff;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 10px;
  border-radius: 10px;
  font-size: 13px;
}
.fee-info {
  background: white;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 10px;
  border-radius: 10px;
  font-size: 13px;
}
.first-pay-info {
  background: white;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 10px;
  border-radius: 10px;
  font-size: 13px;
}
.end-pay-info {
  background: white;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 10px;
  border-radius: 10px;
  font-size: 13px;
}
</style>
