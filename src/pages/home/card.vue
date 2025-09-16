<template>
  <view>
    <wd-popup
      custom-class="popup-view"
      v-model="showCard"
      :mask-closable="false"
      :closeable="false"
      mode="center"
      custom-style="width: 90%;border-radius: 24rpx; background-color: rgba(255, 255, 255, 0) !important;"
    >
      <view style="display: flex; flex-direction: column">
        <image
          class="title—icon"
          style="width: 100%; height: 350rpx; position: absolute"
          :src="type == 2 ? enterpriseIcon : individualIcon"
          mode="scaleToFill"
        ></image>

        <view
          style="width: 100%; height: 800rpx; margin-top: 150rpx; border-radius: 24rpx"
          :style="{ 'background-color': type == 2 ? enterpriseColor : individualColor }"
        >
          <scroll-view :scroll-y="true" style="height: 500rpx">
            <view class="card-item-box">
              <block v-for="(item, key) in list" :key="key">
                <view class="card-v-item-box">
                  <template>
                    <view class="card-v-item">
                      <view class="card-v-item-icon">
                        <image
                          class="card-i-item-icon"
                          :src="imgUrl + item.icon"
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

          <scroll-view :scroll-y="true" style="height: 200rpx">
            <text class="card-t-item-rules" style="margin-left: 52rpx; margin-right: 52rpx">
              使用说明：
            </text>
            <view class="card-v-item-rules">
              <view class="card-t-item-rules" v-html="description"></view>
            </view>
          </scroll-view>
          <view
            style="
              display: flex;
              margin-top: 10rpx;
              margin-left: 32rpx;
              margin-right: 32rpx;
              margin-bottom: 20rpx;
            "
          >
            <view
              class="cancel-btn"
              :style="{
                color: type == 2 ? enterpriseFontColor : individualFontColor,
                'border-color': type == 2 ? enterpriseFontColor : individualFontColor,
              }"
              @click="dismiss()"
            >
              暂不领取
            </view>

            <view
              class="confirm-btn"
              :style="{ background: type == 2 ? enterpriseBgColor : individualBgColor }"
              @click="receive()"
            >
              {{ type == 2 ? enterpriseReceive : individualReceive }}
            </view>
          </view>
        </view>
      </view>
    </wd-popup>

    <wd-popup
      v-model="showLogin"
      :show-confirm-button="false"
      :show-title="false"
      custom-style="width: 80%;border-radius:32rpx;"
    >
      <view class="box">
        <image style="width: 72rpx; height: 72rpx" :src="receiveFailIcon" mode=" aspectFit"></image>
      </view>
      <view style="text-align: center; margin: 20rpx; font-size: 28rpx; color: #ff5e48">
        领取失败
      </view>

      <view style="text-align: center; margin: 20rpx; font-size: 14px; color: #494949">
        您当前未登录，请登录后再进行领取～
      </view>
      <view style="display: flex; border-top: #dedede solid 1px; padding: 2px 0">
        <button
          size="mini"
          style="
            background-color: #ffffff;
            color: #c3c3c3;
            flex: 1;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
          "
          @click="disLogin()"
        >
          返回
        </button>
        <view style="width: 1px; background-color: #dedede"></view>
        <button
          @click="toMyPage"
          lang="zh_CN"
          size="mini"
          style="
            flex: 1;
            line-height: 40px;
            font-size: 16px;
            height: 40px;
            background-color: #ffffff;
            color: #2f72f6;
          "
        >
          去登录
        </button>
      </view>
    </wd-popup>

    <wd-popup
      v-model="showSuccess"
      :show-confirm-button="false"
      :mask-closable="true"
      :show-title="false"
      custom-style="width: 80%;border-radius:32rpx;"
    >
      <view class="box">
        <image
          style="width: 72rpx; height: 72rpx"
          :src="receiveSuccessIcon"
          mode=" aspectFit"
        ></image>
      </view>
      <view style="text-align: center; margin: 20rpx; font-size: 28rpx; color: #17cabd">
        领取成功
      </view>
      <view style="text-align: center; margin: 20rpx; font-size: 14px; color: #494949">
        请在个人中心"卡包"查询详细内容
      </view>
    </wd-popup>

    <wd-popup
      custom-class="popup-view"
      v-model="showEmpty"
      :mask-closable="true"
      :closeable="false"
      mode="center"
      custom-style="width: 90%; height: 550rpx; border-radius: 24rpx;  background-color: rgba(255, 255, 255, 0) !important;"
    >
      <view style="display: flex; flex-direction: column">
        <image
          style="width: 100%; height: 350rpx; border-radius: 24rpx; position: absolute"
          :src="type == 2 ? enterpriseIcon : individualIcon"
          mode=" aspectFit"
        ></image>
        <view
          class="hint-message"
          :style="{ color: type == 2 ? enterpriseFontColor : individualFontColor }"
        >
          {{ showEmptyContent }}
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useLoginStore, useUserStore } from '@/store'
import { tabbarStore } from '@/components/au-tabbar/tabbar'
import { requestGiftsScanAndView, requestGiftsScanAndReceive } from '@/service/gifts/giftsApi'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['showChange'])
const loginStore = useLoginStore()
const userStore = useUserStore()
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
const receiveFailIcon = '/static/images/mine/card/receive_fail_icon.png'

// Data refs
const type = ref(0) // 礼包类型：0，普通（缺省），1，个人，2，企业
const imgUrl = import.meta.env.VITE_UPLOAD_BASEURL
const showCard = ref(false)
const description = ref('')
const list = ref(null)
const showLogin = ref(false)

const showSuccess = ref(false)
const showEmpty = ref(false)
const showEmptyContent = ref('')

// Computed
const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => loginStore.loginInfo.isLogin)
// Watchers
watch(
  () => props.show,
  (curVal) => {
    console.log('popupCardView watch show curVal=' + curVal)
    if (curVal) {
      RequestGiftsScan()
    }
  },
  { deep: true },
)

watch(
  () => props.code,
  (curVal) => {
    console.log('popupCardView watch code curVal=' + curVal)
  },
)

// Methods
const dismiss = (value) => {
  showCard.value = false
  emit('showChange', value)
}

const receive = () => {
  if (!isLogin.value) {
    dismiss(props.code)
    login()
  } else {
    RequestGiftsScanAndReceive()
  }
}

const receiveEmpty = (content) => {
  dismiss('')
  showEmptyContent.value = content
  showEmpty.value = true
  setTimeout(() => {
    showEmpty.value = false
  }, 3000)
}

const showReceiveSuccess = () => {
  showSuccess.value = true
  dismiss('')
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const RequestGiftsScanAndReceive = async () => {
  let res = await requestGiftsScanAndReceive({
    code: props.code,
  })
  if (res.code === '000') {
    showReceiveSuccess()
  } else {
    receiveEmpty(res.message)
  }
}

const RequestGiftsScan = async () => {
  let res = await requestGiftsScanAndView({
    code: props.code,
    userId: isLogin.value ? userInfo.value.uId : 0,
  })
  if (res.code === '000') {
    console.log('RequestGiftsScanAndView success:', res)
    type.value = res.value.type
    showCard.value = props.show && type.value > 0
    list.value = res.value.couponList
    description.value = res.value.description
  } else {
    dismiss()
  }
}

if (props.show == true) {
  RequestGiftsScan()
}

const login = () => {
  showLogin.value = true
}

const disLogin = () => {
  showLogin.value = false
}

const toMyPage = () => {
  showLogin.value = false
  tabbarStore.setCurIdx(4)
  uni.switchTab({
    url: '/pages/mine/index',
  })
}
</script>

<style>
.card-item-box {
  flex: 1;
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

.hint-message {
  font-size: 12px;
  z-index: 999;
  display: flex;
  height: 145rpx;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 24rpx;
  border: 1rpx solid #ffffff;
  padding: 20rpx 10rpx 10rpx 10rpx;
  margin: 150rpx 24rpx 20rpx 24rpx;
}

.cancel-btn {
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

button::after {
  border: none;
}

.popup-view {
  background-color: rgba(255, 255, 255, 0) !important;
}

.box {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
</style>
