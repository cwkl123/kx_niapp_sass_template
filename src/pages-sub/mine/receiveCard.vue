<template>
  <view>
    <view style="border-radius: 24rpx">
      <view style="width: 100%; display: flex; flex-direction: column">
        <view
          style="
            width: calc(100% - 66rpx);
            height: 350rpx;
            position: absolute;
            padding-right: 66rpx;
          "
        >
          <image
            style="width: 100%; height: 100%"
            :src="data.type == 2 ? enterpriseIcon : individualIcon"
            mode="aspectFill"
          ></image>
        </view>

        <view
          style="margin-top: 150rpx; border-radius: 24rpx"
          :style="{ 'background-color': data.type == 2 ? enterpriseColor : individualColor }"
        >
          <scroll-view :scroll-y="true" style="height: 500rpx">
            <view class="card-item-box">
              <block v-for="(item, key) in data.couponList" :key="key">
                <view class="card-v-item-box">
                  <template>
                    <view class="card-v-item">
                      <view class="card-v-item-icon">
                        <image
                          class="card-i-item-icon"
                          :src="getImgUrl(item.icon)"
                          mode="scaleToFill"
                        ></image>
                      </view>
                      <view class="card-v-item-content">
                        <text class="card-t-content-title">{{ item.name }}</text>
                        <text class="card-t-content-date">
                          {{ item.startTime + '-' + item.endTime }}
                        </text>
                      </view>
                    </view>
                  </template>
                </view>
              </block>
            </view>
          </scroll-view>

          <scroll-view :scroll-y="true" style="height: 200rpx; margin-top: 10rpx">
            <text class="card-t-item-rules" style="margin-left: 52rpx; margin-right: 24rpx">
              使用说明：
            </text>
            <view class="card-v-item-rules">
              <view class="card-t-item-rules" v-html="data.description"></view>
            </view>
          </scroll-view>
          <view
            style="
              display: flex;
              margin-top: 10rpx;
              margin-left: 32rpx;
              margin-right: 32rpx;
              margin-bottom: 10rpx;
            "
          >
            <view
              class="confirm-btn"
              :style="{ background: data.type == 2 ? enterpriseBgColor : individualBgColor }"
              @click="receive()"
            >
              {{ data.type == 2 ? enterpriseReceive : individualReceive }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- 领取成功 -->
  <wd-popup v-model="showSuccess" custom-style="border-radius:32rpx;">
    <view class="box">
      <view class="popup-text">
        <image
          style="width: 72rpx; height: 72rpx"
          :src="receiveSuccessIcon"
          mode=" aspectFit"
        ></image>
      </view>
      <view class="popup-item-text font-green">领取成功</view>
    </view>
    <view class="popup-item-text font-black">请在个人中心“卡包”查询详细内容</view>
  </wd-popup>
  <!-- 领取失败 -->
  <wd-popup v-model="showEmpty" custom-style="border-radius:32rpx;background: none">
    <view class="box popup-view">
      <view style="display: flex; flex-direction: column">
        <image
          style="width: 100%; height: 350rpx; border-radius: 24rpx; position: absolute"
          :src="data.type == 2 ? enterpriseIcon : individualIcon"
          mode="aspectFit"
        ></image>
        <view
          class="hint-message"
          :style="{ color: data.type == 2 ? enterpriseFontColor : individualFontColor }"
        >
          {{ showEmptyContent }}
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script setup>
import { ref, watch } from 'vue'
import { requestGiftsScanAndReceive } from '@/service/gifts/giftsApi'

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['confirm'])
const enterpriseIcon = '/static/images/mine/card/home_enterprise_card_bg.png'
const enterpriseColor = '#FFF5E9'
const enterpriseFontColor = '#F3931F'
const enterpriseBgColor = 'linear-gradient(90deg, #F0C149 0%, #F3931F 100%), #000000;'
const enterpriseReceive = '领取企业卡'
const individualIcon = '/static/images/mine/card/home_individual_card_bg.png'
const individualColor = '#D0F0FF'
const individualFontColor = '#2F72F6'
const individualBgColor = 'linear-gradient(90deg, #3AB8FF 0%, #2F72F6 100%), #000000;'
const individualReceive = '领取个人卡'
const receiveSuccessIcon = '/static/images/mine/card/receive_success_icon.png'

const showSuccess = ref(false)
const showEmpty = ref(false)
const showEmptyContent = ref('')

const getImgUrl = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}
const receive = async () => {
  await RequestGiftsScanAndReceive()
}
const receiveEmpty = (content) => {
  showEmpty.value = true
  showEmptyContent.value = content
  setTimeout(() => {
    showEmpty.value = false
  }, 3000)
}

const showReceiveSuccess = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    emit('confirm')
  }, 3000)
}

const RequestGiftsScanAndReceive = async () => {
  const { code, message, value } = await requestGiftsScanAndReceive({
    code: props.data.redemptionCode,
  })
  if (code === '000') {
    showReceiveSuccess()
  } else {
    receiveEmpty(message)
  }
}

watch(
  () => props.data,
  (curVal) => {
    console.log('receiveCardView watch dataList curVal=', curVal)
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.card-item-box {
  flex: 1;
  /* height: 500rpx;
		display: flex; */
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24rpx;
  border: 1rpx solid #ffffff;
  padding: 20rpx 10rpx 10rpx 10rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;
}

.card-v-item-box {
  background: #ffffff;
  margin-bottom: 10rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
  padding: 20rpx;
  flex: 1;
  flex-direction: column;
  border-radius: 20rpx;
  align-items: center;
  justify-content: start;
}

.card-v-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.card-v-item-icon {
  flex-shrink: 0;
  width: 110rpx;
  height: 110rpx;
  border-radius: 20rpx;
  /* background-color: #eee; */
}

.card-i-item-icon {
  width: 100%;
  height: 100%;
}

.card-v-item-content {
  height: 110rpx;
  width: 300rpx;
  flex: 1;
  margin-left: 16rpx;
  margin-right: 16rpx;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
}

.card-t-content-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #494949;
  line-height: 33rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-t-content-title- {
  font-size: 28rpx;
  font-weight: 600;
  color: #bebebe;
  line-height: 33rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-t-content-date {
  margin-top: 10rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #bebebe;
  line-height: 28rpx;
}

.card-v-item-rules {
  margin-bottom: 20rpx;
  margin-left: 32rpx;
  margin-right: 32rpx;
  padding: 20rpx;
}

.card-t-item-rules {
  white-space: pre-wrap;
  font-size: 24rpx;
  font-weight: 400;
  color: #2a2b2c;
  line-height: 40rpx;
  z-index: 99999999;
}

.cancel-btn {
  /* color: #2F72F6; */
  flex: 1;
  display: flex;
  line-height: 60rpx;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  height: 60rpx;
  margin-right: 10rpx;
  border-radius: 60rpx;
  background: #000000 #f0f8ff;
  border: 2rpx solid;
  border-color: #2f72f6;
}

.confirm-btn {
  color: white;
  flex: 1;
  display: flex;
  line-height: 60rpx;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  height: 60rpx;
  margin-left: 10rpx;
  border-radius: 60rpx;
  /* background: linear-gradient(90deg, #3AB8FF 0%, #2F72F6 100%), #000000; */
}

.hint-message {
  font-size: 12px;
  z-index: 999;
  display: flex;
  height: 120rpx;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24rpx;
  border: 1rpx solid #ffffff;
  padding: 20rpx 10rpx 10rpx 10rpx;
  margin: 150rpx 24rpx 20rpx 24rpx;
}

button::after {
  border: none;
}
.popup-text {
  text-align: center;
  margin: 20px 0 10px 0;
}
.popup-view {
  background-color: rgba(255, 255, 255, 0) !important;
}

.box {
  width: 80vw;
}
.popup-item-text {
  text-align: center;
  align-items: center;
  margin: 10px;
  font-size: 28rpx;
  font-weight: 400;
}
.font-black {
  width: 100%;
  color: #696969;
}
.font-green {
  color: #17cabd;
}
</style>
