<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '服务',
  },
}
</route>
<template>
  <view class="page-container">
    <image
      :src="'/static/images/service/top1.png'"
      style="position: absolute; width: 100%; height: 360px; z-index: 0; padding-top: -20px"
    />

    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view @click="goBack()" class="nav-content">
        <image src="/static/images/service/back2.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">确认预约订单</text>
      </view>
    </view>

    <view class="content-container">
      <!-- 收货地址 -->
      <view class="address-section">
        <view class="address-content" @click="goAddress">
          <image src="/static/images/service/address.png" class="location-icon" />
          <view class="address-info">
            <view class="detail" v-if="addressInfo">
              <text>{{ addressInfo.name }} {{ addressInfo.phone }}</text>
              <view style="color: #333; font-size: 14px; margin-top: 8rpx">
                {{ addressInfo.provinceName }}
                <text v-if="addressInfo.cityName !== '市辖区'">{{ addressInfo.cityName }}</text>
                {{ addressInfo.countyName }} {{ addressInfo.townName }} {{ addressInfo.address }}
              </view>
            </view>
            <view class="detail" v-else>
              <text>请添加您的服务地址</text>
              <view style="color: #b2b2b2; font-size: 12px">
                请填写真实有效的地址信息，方便更快的服务
              </view>
            </view>
          </view>
          <image src="/static/images/service/to.png" class="arrow-icon" />
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods-section">
        <view class="goods-item">
          <image :src="getImage(serveItemInfo?.url)" class="goods-image" />

          <!-- 商品信息 -->
          <view class="goods-info">
            <view class="goods-text-info">
              <view class="goods-name">{{ serveItemInfo.serviceTitle }}</view>
              <view class="goods-spec">{{ selectedService.name }}</view>
            </view>
            <view class="goods-price">{{ formattedPrice }}</view>
          </view>
        </view>

        <view class="service-options">
          <view class="service-option" @click="toSelTime">
            <text class="label">选择上门时间</text>
            <text class="time-value" v-if="selectedTime">
              {{ selectedTime.day }}日 {{ selectedTime.startTime }}
            </text>
            <text class="placeholder" v-else>请选择上门时间</text>
            <image src="/static/images/service/to.png" class="arrow-icon" />
          </view>
          <view class="service-option" @click="toSelUser" v-if="isAdmin > 0 && isSign == 0">
            <text class="label">选择师傅</text>
            <text class="time-value" v-if="selectedUser">
              {{ selectedUser.name }}
            </text>
            <text class="placeholder" v-else>请选择维修师傅</text>
            <image src="/static/images/service/to.png" class="arrow-icon" />
          </view>

          <view class="service-option">
            <text class="label">上门服务费</text>
            <text class="value">¥{{ serviceFee }}</text>
          </view>
        </view>
      </view>
      <!-- 维修描述 -->
      <view class="repair-desc">
        <view class="section-title">
          <text>维修描述</text>
        </view>
        <view class="input-area">
          <textarea
            v-model="describe"
            placeholder="请输入内容"
            :auto-height="true"
            :fixed="false"
            :show-confirm-bar="true"
            @focus="onFocus"
            @blur="onBlur"
            @confirm="onConfirm"
          ></textarea>

          <!-- 图片上传区域 -->
          <view class="image-upload-container">
            <!-- 横向滚动的预览区 -->
            <scroll-view class="preview-scroll" scroll-x="true">
              <view class="preview-wrapper">
                <view v-for="(item, index) in fileList" :key="index" class="preview-item">
                  <image
                    :src="item.url"
                    mode="aspectFill"
                    class="preview-image"
                    @click="previewImage(index)"
                  />
                  <view class="delete-btn" @click.stop="removeImage(index)">
                    <wd-icon name="close" size="16px" color="#fff"></wd-icon>
                  </view>
                </view>

                <!-- 上传按钮 -->
                <uploadImage
                  :max-num="9 - fileList.length"
                  @on-up-img-suc="handleUploadSuccess"
                  @on-up-img-fail="handleFail"
                >
                  <view class="upload-trigger">
                    <wd-icon name="add" size="22px"></wd-icon>
                    <text class="upload-text">添加图片</text>
                  </view>
                </uploadImage>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      <view class="notice-section">
        <text class="notice-text">
          注意:确认好订单后，请先支付上门费用，等待师傅维修完毕后，再支付剩余的人工费、材料费等其他费用。师傅上门后再进行取消订单则支付的上门费不予退还。
        </text>
      </view>

      <!-- 底部支付栏 -->
      <view class="footer" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
        <view class="price-info">
          <text>上门费：</text>
          <text class="total-price">¥{{ serviceFee }}</text>
        </view>
        <view class="submit-view">
          <view class="submit-btn" @click="subData">提交订单</view>
        </view>
      </view>
    </view>
  </view>

  <wd-popup v-model="showPopTime" position="bottom" :safe-area-inset-bottom="true">
    <orderSelTime
      ref="timeSelectRef"
      :serviceId="serviceId"
      :addressId="addressId"
      @selected="handleTimeSelected"
      @close="showPopTime = false"
    />
  </wd-popup>
  <wd-popup v-model="showPopUser" position="bottom" :safe-area-inset-bottom="true">
    <view>
      <orderSelUser @selected="handleUserSelected" @close="showPopUser = false" />
    </view>
  </wd-popup>
  <wd-popup
    v-model="showHasOrdersTip"
    position="center"
    custom-style="width: 80%; border-radius: 16rpx;"
  >
    <view class="popup-content">
      <view class="popup-header">
        <text class="popup-title">提示</text>
      </view>
      <view class="popup-body">
        <text>您当前有订单未支付</text>
      </view>
      <view class="popup-footer">
        <button class="popup-btn cancel" @click="cancelOrders">取消订单</button>
        <button class="popup-btn confirm" @click="payOrders">前往支付</button>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useLoginStore, useUserStore } from '@/store'
import { getSafeAreaInsets } from '@/utils'
import { createOrder } from '@/service/order/orderApi'
import { getOrderPage } from '@/service/order/orderApi'
import orderSelTime from '@/components/order/orderSelTime'
import orderSelUser from '@/components/order/orderSelUser'
import { getAddressDetail } from '@/service/base/addressApi'
import uploadImage from '@/components/upload-image/uploadImage.vue'
import { tabbarStore } from '@/components/au-tabbar/tabbar'

const serviceId = ref()
const addressId = ref()
const serveInfo = ref()
const selectedService = ref()
const serveItemInfo = ref()
const isCommissions = ref(0)
const userStore = useUserStore()
const isAdmin = computed(() => userStore.userInfo?.isAdmin || 0)
const isSign = computed(() => userStore.userInfo?.isSign || 0)
const baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
const imgsStr = computed(() =>
  fileList.value
    .map((item) => {
      // 移除基础路径，处理空值情况
      const url = item?.url || ''
      return url.replace(baseUploadUrl, '').replace(/^\/+/, '/')
    })
    .filter(Boolean) // 过滤掉空字符串
    .join(','),
)

onLoad((options) => {
  console.log(userStore.userInfo.editAddress, '11111111111111111111111111')
  if (userStore.userInfo.editAddress == 1) {
    getDefaultAddress()
  }
  getStatus()
  if (options.data) {
    const params = JSON.parse(decodeURIComponent(options.data))
    serviceId.value = params.serviceId
    serveInfo.value = params.serveInfo
    selectedService.value = params.selectedService
    serveItemInfo.value = params.serveItemInfo
  } else {
    console.error('No data parameter received')
  }
})
const { safeAreaInsets } = getSafeAreaInsets()

const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.navigateTo({ url: '/pages-sub/service/serviceInfo' })
  }
}
const describe = ref(null)
const addressInfo = ref(null)
const showPopTime = ref(false)
const showPopUser = ref(false)
const showHasOrdersTip = ref(false)
const isHasPay = ref(false)
const selectedTime = ref()
const selectedUser = ref()
const goAddress = () => {
  if (userStore.userInfo.editAddress == 1) {
    uni.navigateTo({
      url: '/pages-sub/mine/address/mineAddressPage?selectAddress=true',
      events: {
        onAddressSelected: (address) => {
          console.log('收到选中的地址:', address)
          handleAddressSelected(address)
        },
      },
    })
  } else {
    uni.navigateTo({
      url: '/pages-sub/mine/address/addAddress?selectAddress=true',
      events: {
        onAddressSelected: (address) => {
          console.log('收到选中的地址:', address)
          handleAddressSelected(address)
        },
      },
    })
  }
}
const getDefaultAddress = async () => {
  const { value } = await getAddressDetail({
    uId: userStore.userInfo.uId,
  })
  if (value?.repairsId) {
    // 设置地址信息
    addressInfo.value = {
      name: value.name,
      phone: value.phone,
      provinceName: value.provinceName,
      cityName: value.cityName,
      countyName: value.countyName,
      townName: value.townName,
      address: value.address,
      repairsId: value.repairsId,
    }

    // 设置地址ID
    addressId.value = value.repairsId
    console.log('默认地址信息', addressId.value)
  }
}
//获取未支付单数
const getStatus = async () => {
  if (userStore.userInfo.isAdmin > 0 || userStore.userInfo.isSign > 0) {
    return
  } else {
    const { code, value } = await getOrderPage({
      pageNum: 1,
      pageSize: 2,
      tradesStatus: '140',
    })
    if ('000' === code) {
      if (value.total > 0) {
        isHasPay.value = true
      }
    }
  }
}
const handleAddressSelected = (address) => {
  addressInfo.value = address
  addressId.value = addressInfo.value.repairsId
  console.log('已设置地址信息:', addressInfo.value)
}

const handleTimeSelected = (timeData) => {
  selectedTime.value = timeData
  console.log('已设置时间信息:', selectedTime.value)
  showPopTime.value = false
  // 这里可以同时更新服务费显示
}

const handleUserSelected = (timeData) => {
  selectedUser.value = timeData
  showPopUser.value = false
}
const timeSelectRef = ref(null)
const userSelectRef = ref(null)
//时间
watch(
  () => showPopTime.value,
  async (newVal) => {
    if (newVal) {
      await nextTick() // 等待 DOM 渲染完毕，ref 才能拿到
      if (timeSelectRef.value?.initDateList) {
        await timeSelectRef.value.initDateList()
      }
    }
  },
)
const toSelTime = async () => {
  if (!addressInfo.value?.repairsId) {
    uni.showToast({
      title: '请先选择服务地址',
      icon: 'none',
    })
    return
  }
  showPopTime.value = true
}
const toSelUser = () => {
  showPopUser.value = true
}
const getImage = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}
const formattedPrice = computed(() => {
  return `￥${(selectedService.value.price / 100).toFixed(2)}`
})
const serviceFee = computed(() => {
  if (!selectedTime.value?.serviceFee) {
    return '0.00'
  }
  return (selectedTime.value.serviceFee / 100).toFixed(2)
})
const fileList = ref([])

// 处理上传成功
const handleUploadSuccess = (fileData) => {
  fileList.value.push({
    url: getImage(fileData.url),
    name: fileData.name || `图片_${Date.now()}`,
  })
}

// 处理上传失败
const handleFail = (error) => {
  uni.showToast({
    title: error || '上传失败',
    icon: 'none',
  })
}

// 删除图片
const removeImage = (index) => {
  fileList.value.splice(index, 1)
}

// 预览图片
const previewImage = (current) => {
  uni.previewImage({
    current,
    urls: fileList.value.map((item) => item.url),
  })
}
function convertToCents(serviceFee) {
  const amount = parseFloat(serviceFee)
  return isNaN(amount) ? 0 : Math.round(amount * 100)
}
// 订单提交
const subData = async () => {
  try {
    // 表单验证
    if (!addressInfo.value?.repairsId) {
      uni.showToast({ title: '请选择服务地址', icon: 'none' })
      return
    }

    if (!selectedTime.value?.appointTime) {
      uni.showToast({ title: '请选择预约时间', icon: 'none' })
      return
    }

    // 构建订单数据
    const orderData = {
      userId: userStore.userInfo.uId,
      serviceId: serviceId.value,
      specId: selectedService.value.specId,
      repairsId: addressInfo.value.repairsId,
      totalFee: selectedService.value.price,
      serveFee: convertToCents(serviceFee.value),
      otherFee: 0,
      appointDate: selectedTime.value.appointDate,
      appointTime: selectedTime.value.appointTime,
      serviceStartTime: selectedTime.value.serviceStartTime,
      serviceEndTime: selectedTime.value.serviceEndTime,
      buyerMessage: describe.value,
      buyerImgs: imgsStr.value,
      isCommissions: isCommissions.value,
      ...(selectedUser.value && { assignRepairId: selectedUser.value.repairId }),
    }
    console.log('订单数据:', isHasPay.value)
    if (isHasPay.value) {
      showHasOrdersTip.value = true
      return
    }
    // 提交订单
    const { code, value, message } = await createOrder(orderData)
    if (code === '000') {
      console.log('value::::', value)
      // 根据服务费跳转不同页面
      if (selectedTime.value.serviceFee > 0) {
        uni.navigateTo({
          url: '/pages-sub/service/paymentServiceFee?orderId=' + value.isOk,
        })
      } else {
        tabbarStore.setCurIdx(4)
        uni.switchTab({ url: '/pages/mine/index' })
      }
    } else {
      uni.showToast({
        icon: 'none',
        title: message,
        duration: 1200,
      })
    }
  } catch (error) {
    console.error('订单提交失败:', error)
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  }
}
// 未支付订单处理
const showHasOrders = () => {
  showHasOrdersTip.value = true
}

const cancelOrders = () => {
  showHasOrdersTip.value = false
  uni.navigateBack()
}

const payOrders = () => {
  showHasOrdersTip.value = false
  tabbarStore.setCurIdx(4)
  uni.switchTab({ url: '/pages/mine/index' })
}
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content-container {
  position: relative;
  height: calc(100vh - 54px);
  z-index: 1;
}

/* 导航栏样式 */
.nav-bar {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 10px 16px;

  .nav-content {
    display: flex;
    align-items: center;
  }

  .back-icon {
    width: 12px;
    height: 16px;
    margin-bottom: 2px;
    margin-right: 8px;
  }

  .nav-title {
    margin-left: 4px;
    color: #4d4d4d;
    font-size: 18px;
    font-weight: 500;
  }
}

.form-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 0 15px;
  margin-top: 10px;
}

/* 收货地址 */
.address-section {
  margin: 0rpx 20rpx 0;
  position: relative;
  z-index: 3;
  border: #e5e5e5;

  .address-content {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .location-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;
    }

    .address-info {
      flex: 1;

      .recipient {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .name {
          font-size: 32rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }

        .phone {
          font-size: 28rpx;
          color: #666;
        }
      }

      .detail {
        font-size: 28rpx;
        color: #333;
      }
    }

    .arrow-icon {
      width: 15rpx;
      height: 24rpx;
    }
  }

  .address-bottom {
    position: absolute;
    bottom: -10rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 20rpx;
  }
}
/* 商品信息 */
.goods-section {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e5e5;

  .goods-item {
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    align-items: flex-start;

    .goods-image {
      width: 170rpx;
      height: 150rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .goods-info {
      flex: 1;
      display: flex;
      justify-content: space-between; /* 关键修改：使子元素两端对齐 */
      align-items: flex-start; /* 顶部对齐 */

      .goods-text-info {
        display: flex;
        flex-direction: column;
      }
      .goods-name {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        font-weight: bold;
      }

      .goods-spec {
        font-size: 24rpx;
        color: #999;
      }

      .goods-price {
        font-size: 32rpx;
        color: #333333;
        font-weight: bold;
      }
    }
  }

  .service-options {
    display: flex;
    flex-direction: column;
    .service-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-radius: 12rpx;

      .label {
        font-size: 28rpx;
        color: #333;
      }

      .value {
        font-size: 28rpx;
        color: #333;
      }

      .time-value {
        flex: 1;
        text-align: right;
        margin-right: 10rpx;
        color: #333;
        font-size: 28rpx;
      }
      .placeholder {
        flex: 1;
        text-align: right;
        margin-right: 10rpx;
        color: #b2b2b2;
        font-size: 28rpx;
      }

      .arrow-icon {
        width: 15rpx;
        height: 24rpx;
      }
    }
  }
}
/* 维修描述 */
.repair-desc {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e5e5;

  .section-title {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }

  .input-area {
    display: flex;
    align-items: column;
    gap: 100rpx;
    flex-direction: column;
    font-size: 28rpx;
  }
}
.image-upload-container {
  margin-top: 30rpx;
  padding-bottom: 30rpx; /* 底部留白 */
}

.preview-scroll {
  width: 100%;
  white-space: nowrap;
  padding: 10rpx 0;
}

.preview-wrapper {
  display: inline-flex;
  gap: 20rpx; /* 图片间距 */
  align-items: center;
}

.preview-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-trigger {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border: 1px dashed #dcdfe6;
  border-radius: 8rpx;
  background-color: #f5f7fa;
  flex-shrink: 0;

  .upload-text {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #909399;
  }
}
/* 提示文字部分 */
.notice-section {
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 8rpx;

  .notice-text {
    font-size: 24rpx;
    color: #979797;
    line-height: 1.6;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  gap: 20rpx;

  .price-info {
    font-size: 32rpx;
    color: #979797;
    flex: 1; /* 添加flex属性使价格信息区域可伸缩 */
    text-align: right; /* 价格信息右对齐 */

    .total-price {
      color: #2974d8;
      font-weight: bold;
      font-size: 32rpx;
    }
  }
  .submit-view {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 30rpx;
    padding: 5px 0;
  }
  .submit-btn {
    background: linear-gradient(to right, #75c6ff, #3e95f6);
    color: #fff;
    padding: 5px 0;
    width: 200rpx;
    border-radius: 40rpx;
  }
}
.popup-content {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.popup-header {
  padding: 32rpx 32rpx 0;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.popup-body {
  padding: 40rpx 32rpx;
  text-align: center;
}

.popup-message {
  font-size: 30rpx;
  color: #666;
  line-height: 1.5;
}

.popup-footer {
  display: flex;
  border-top: 1rpx solid #f5f5f5;
  padding: 0;
}

.popup-btn {
  flex: 1;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 32rpx;
  border-radius: 0;
  margin: 0;
  background: none;
  position: relative;
}

.popup-btn::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1rpx;
  height: 100%;
  background-color: #f5f5f5;
}

.popup-btn.cancel {
  color: #666;
}

.popup-btn.confirm {
  color: #2974d8;
}

.popup-btn.cancel:active {
  background-color: #f5f5f5;
}

.popup-btn.confirm:active {
  background-color: rgba(7, 193, 96, 0.1);
}
</style>
