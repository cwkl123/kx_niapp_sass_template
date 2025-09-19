<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '在线客服',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="page-container" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <image class="background-image" src="/static/images/chat/bc_ground.png" mode="widthFix"></image>
    <wd-navbar
      title="在线客服"
      left-arrow
      @click-left="handleClickLeft"
      custom-style="position: relative; background-color: transparent !important; z-index: 100;"
      :bordered="false"
    ></wd-navbar>

    <!-- 聊天内容区域 -->
    <scroll-view
      id="scroll-view"
      class="chat-scroll-view"
      scroll-y="true"
      :scroll-into-view="chat.scrollIntoView"
      :style="{ height: chat.contentHeight + 'px' }"
      :refresher-enabled="refresher.isOpenRefresh"
      :refresher-triggered="refresher.triggered"
      refresher-background="rgba(0, 0, 0, 0)"
      @refresherrefresh="onRefresh"
    >
      <view class="chat-content" id="chat-content">
        <!-- 开始加载 -->
        <view v-if="empty.showLoading" style="margin-top: 20px">
          <view style="display: flex; justify-content: center; width: 100%">
            <view style="height: 30px; width: 30px">
              <wd-loading size="40"></wd-loading>
            </view>
          </view>
          <view class="view-loadmore">正在加载中...</view>
        </view>
        <!-- 没有更多 -->
        <view v-if="empty.showNoMore" style="margin-top: 20px">
          <view class="view-nomore">---- 没有更多了 ----</view>
        </view>
        <view class="top-section">
          <!-- 卡通牛图片 - 作为背景 -->
          <image src="/static/images/chat/question.png" mode="widthFix" class="background-image" />

          <!-- 覆盖内容容器 -->
          <view class="overlay-container">
            <view style="margin-top: 30rpx">
              <image src="/static/images/chat/flame.png" class="flame-icon" />
              <text style="font-size: 26rpx; font-weight: bold; color: #3496e8">热 门 问 题</text>
            </view>

            <view class="card-container">
              <view v-for="(item, index) in questions" :key="index">
                <view class="question-card" @click="onHotMsg(item)">
                  <text style="font-size: 24rpx">{{ item.question }}</text>
                  <wd-icon name="arrow-right" size="24rpx"></wd-icon>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-for="(item, index) in chat.list" :key="index">
          <view
            :id="'chatId' + item.timestamp"
            class="chat-admin"
            v-if="
              isAdmin(item.from.type) || (isSystem(item.from.type) && !isQuestionList(item.type))
            "
          >
            <image
              class="chat-admin-avatar"
              :src="
                item.from.avatar != null && item.from.avatar != ''
                  ? getHostUrl(item.from.avatar)
                  : getHostUrl(empty.adminIcon)
              "
              mode=" aspectFit  widthFix"
            ></image>

            <view class="chat-admin-box">
              <view class="chat-admin-info">
                {{ item.from.username }}
                <span v-if="item.timestamp">{{ formatMsgTime(item.timestamp) }}</span>
                <span v-else>{{ formatMsgTime(item.getTime) }}</span>
              </view>

              <view class="chat-admin-content" v-if="isText(item.payload.type)">
                {{ item.payload.content }}
              </view>

              <view class="chat-admin-content" v-if="isHtml(item.payload.type)">
                <mp-html
                  :content="item.payload.content"
                  :copy-link="false"
                  @linktap="linktap"
                  :error-img="empty.pholder"
                />
              </view>

              <view
                class="chat-admin-content"
                v-if="isImageUrl(item.payload.type)"
                @click="onPreviewsImage(item.payload.content)"
              >
                <image
                  style="width: 100px"
                  :src="getHostUrl(item.payload.content)"
                  lazy-load="true"
                  mode="widthFix"
                ></image>
              </view>
            </view>
          </view>
          <view :id="'chatId' + item.timestamp" class="chat-user" v-if="isUser(item.from.type)">
            <view class="chat-user-box">
              <!-- {{item.from.username}} -->
              <view class="chat-user-info">{{ formatMsgTime(item.timestamp) }}</view>

              <view class="chat-user-content" v-if="isText(item.payload.type)">
                {{ item.payload.content }}
              </view>

              <view class="chat-user-content" v-if="isHtml(item.payload.type)">
                <mp-html
                  :content="item.payload.content"
                  :copy-link="false"
                  @linktap="linktap"
                  :error-img="empty.pholder"
                />
              </view>

              <view
                class="chat-user-content"
                v-if="isImageUrl(item.payload.type)"
                @click="onPreviewsImage(item.payload.content)"
              >
                <image
                  style="width: 100px"
                  :src="getHostUrl(item.payload.content)"
                  lazy-load="true"
                  mode="widthFix"
                ></image>
              </view>

              <view
                class="order-box"
                v-if="isOrder(item.payload.type)"
                @click="toOrderDetail(formatOrder(item.payload.content).order_id)"
              >
                <view class="order-header-box">
                  <view class="order-num">
                    订单编号：{{ formatOrder(item.payload.content).order_no }}
                    <!-- <p>{{ formatOrder(item.payload.content).order_id }}</p> -->
                  </view>
                  <view
                    class="order-status"
                    :style="{
                      background: getOrderStatus(formatOrder(item.payload.content).trades_status)
                        .background,
                      color: getOrderStatus(formatOrder(item.payload.content).trades_status).color,
                    }"
                  >
                    {{ getOrderStatus(formatOrder(item.payload.content).trades_status).name }}
                  </view>
                </view>
                <view class="order-line"></view>
                <view class="order-info-box">
                  <view class="order-title">
                    {{ formatOrder(item.payload.content).service_title }}
                  </view>
                  <view class="order-price">
                    {{ formatAmount(formatOrder(item.payload.content).price) + '元' }}
                  </view>
                </view>
                <view class="order-bottom-box">
                  <view class="order-time-box">
                    <view class="order-time">
                      下单时间：{{ formatTime(formatOrder(item.payload.content).order_time) }}
                    </view>
                    <view class="order-time">
                      服务时间：{{
                        formatTime(formatOrder(item.payload.content).service_start_time)
                      }}
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <!-- <image class="chat-user-avatar" mode=" aspectFit  widthFix">
					</image> -->
          </view>
        </view>

        <!-- 会话结束 -->
        <view style="margin-top: 20rpx; margin-bottom: 40rpx">
          <view v-if="empty.closeConversation" class="view-close">---- 当前对话已结束 ----</view>
        </view>
        <!-- 消息占位 -->
        <view :id="chat.bottomId" style="margin-top: 10rpx"></view>

        <!-- 键盘占位 -->
        <!-- <view style="background-color: #2F72F6;" :style="{height: (chat.inputHeight + chat.bottomHeight) +'px' }">
			键盘占位
		</view> -->
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="chat-bottom" id="chat-bottom">
      <!-- 底部功能菜单 -->
      <view class="chat-menu-box" id="chat-menu-box">
        <view class="chat-menu-order" @click="onOrder()">订单</view>
        <view class="chat-menu-evaluation" @click="onEvaluation()" v-if="evaluation.show">
          评价客服
        </view>
        <view class="chat-menu-close" @click="onCloseConversation()" v-if="conversation.show">
          结束会话
        </view>
      </view>
      <view class="send-msg" :style="{ bottom: chat.inputHeight + 'px' }">
        <view class="uni-textarea">
          <textarea
            class="terea-style"
            v-model="chat.sendText"
            maxlength="-1"
            :show-confirm-bar="false"
            auto-height
            placeholder-style="color:#999; font-size: 28rpx;"
            :placeholder="chat.hintMsg"
            :fixed="true"
            :focus="false"
            :adjust-position="false"
            @focus="focusTextarea"
            @blur="blurTextarea"
            @keyboardheightchange="keyboardheightchange"
            disable-default-padding="true"
          ></textarea>

          <image
            class="chat-bottom-send"
            @click="handleSend('chat')"
            src="/static/images/chat/send_bt.png"
            mode=" aspectFit  widthFix"
          ></image>
        </view>
      </view>
    </view>

    <!-- 弹窗组件 -->
    <wd-popup
      v-model="empty.showOrders"
      position="bottom"
      custom-style="height:1000rpx;"
      :safe-area-inset-bottom="true"
      closable
    >
      <v-chat-order-popup
        v-if="empty.showOrders"
        @showOrders="empty.showOrders = false"
        @sendOrder="sendOrder"
      ></v-chat-order-popup>
    </wd-popup>

    <wd-popup
      v-model="empty.showEvaluation"
      position="bottom"
      :safe-area-inset-bottom="true"
      closable
    >
      <view style="background-color: #f8f9f8; padding-top: 32rpx">
        <view
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 56rpx;
            margin: 0rpx 32rpx 32rpx 32rpx;
          "
        >
          <view style="font-weight: 600; color: #47494a; font-size: 40rpx">
            {{ evaluation.title }}
          </view>
          <uni-icons
            type="closeempty"
            size="30"
            color="#3E4041"
            @click="empty.showEvaluation = false"
          ></uni-icons>
        </view>

        <view style="display: flex; justify-content: center; width: 100%; margin-top: 60rpx">
          <wd-rate
            v-model="evaluation.starValue"
            @change="starChange"
            size="40"
            active-color="#ffc107"
          />
        </view>

        <view
          v-if="
            evaluation.starValue > 0 &&
            evaluation.starLowLevelList.length > 0 &&
            evaluation.starHighLevelList.length > 0
          "
          style="
            display: flex;
            margin-left: 32rpx;
            margin-top: 16rpx;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <view
            v-for="(item, key) in evaluation.starValue <= 3
              ? evaluation.starLowLevelList
              : evaluation.starHighLevelList"
            :key="key"
            @click="
              onEvaluationSelect(
                evaluation.starValue <= 3
                  ? evaluation.starLowLevelList[key]
                  : evaluation.starHighLevelList[key],
              )
            "
          >
            <view
              v-if="evaluation.selectTagId.indexOf(item.tagId) !== -1"
              style="
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
                padding: 16rpx 30rpx;
                background: #2f72f6;
                border-radius: 72rpx;
                font-weight: 400;
                color: #ffffff;
                line-height: 50rpx;
                font-size: 28rpx;
                text-align: center;
                letter-spacing: 0px;
                margin-right: 30rpx;
                margin-top: 24rpx;
              "
            >
              {{ item.tagName }}
            </view>

            <view
              v-else
              style="
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
                padding: 16rpx 30rpx;
                background: #fff;
                border-radius: 72rpx;
                font-weight: 400;
                color: #b6b9bf;
                line-height: 50rpx;
                font-size: 28rpx;
                text-align: center;
                letter-spacing: 0px;
                margin-right: 30rpx;
                margin-top: 24rpx;
              "
            >
              {{ item.tagName }}
            </view>
          </view>
        </view>

        <view
          v-if="evaluation.starValue <= 3"
          style="
            display: flex;
            background: #fff;
            border-radius: 20rpx;
            display: flex;
            margin-left: 32rpx;
            margin-top: 40rpx;
            margin-right: 32rpx;
          "
        >
          <textarea
            style="
              height: 180rpx;
              width: 100%;
              font-size: 28rpx;
              color: #333333;
              padding: 22rpx 20rpx;
              line-height: 32rpx;
            "
            v-model="evaluation.msg"
            maxlength="-1"
            :show-confirm-bar="false"
            placeholder-style="color:#999; font-size: 28rpx;"
            :placeholder="evaluation.hint"
            :fixed="false"
            :focus="false"
            :adjust-position="true"
            disable-default-padding="true"
          ></textarea>
        </view>

        <view style="padding: 20px 15px; display: flex">
          <view
            @click="onEvaluationConfirm()"
            style="
              letter-spacing: 2px;
              line-height: 40px;
              color: white;
              flex: 1;
              text-align: center;
              font-size: 15px;
              font-weight: 500;
              height: 40px;
              border-radius: 100px;
              background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
              box-shadow: 0px 3px 9px -2px rgba(55, 120, 248, 0.48);
              border-radius: 20px;
            "
          >
            确定提交
          </view>
        </view>
      </view>
    </wd-popup>

    <wd-message-box />

    <!-- 3. 使用 wot messagebox 替代第二个弹窗 -->
    <!-- <wd-message-box
      v-model="empty.showReconnectConversation"
      title="提示"
      confirm-button-text="确认"
      cancel-button-text="取消"
      @confirm="onReconnect"
      @cancel="empty.showReconnectConversation = false"
    >
      <view class="text-center my-10 text-xs">当前对话已结束，您是否要重连本次会话</view>
    </wd-message-box> -->
    <!-- <u-toast ref="uToast"></u-toast> -->
  </view>
</template>

<script setup>
import { getSafeAreaInsets } from '@/utils'
import { useUserStore } from '@/store'
import {
  getConfigList,
  requestDialogAppraise,
  requestRecordHistory,
  requestDialogFinish,
} from '@/service/msg/chatApi'
import { getHostUrl } from '@/service/cfgUrl'
import { useWebSocket } from '@/utils/websocket'
import {
  dateFormatToTimestamp,
  getAppStatus,
  getNowDateTime,
  dateFormatToTime,
} from './chatOrderUtils'
import vChatOrderPopup from './chatOrderPopup.vue'
import { nextTick } from 'vue'
import { useMessage } from '/node_modules/wot-design-uni'

// 安全区域
let programName = inject('programName')
const { safeAreaInsets } = getSafeAreaInsets()
const userStore = useUserStore()
const websocketRequest = useWebSocket()
const message = useMessage()

// 类型常量
const TYPE = {
  conversation: ['question', 'chat', 'questionList', 'self', 'dialog', 'tips'],
  send: ['admin', 'user', 'system'],
  content: ['text', 'html', 'imageUrl', 'json', 'order', 'timeout'],
}

// 响应式数据
const refresher = reactive({
  triggered: false,
  isOpenRefresh: true,
  refreshing: false,
})

const questions = ref({})

const empty = reactive({
  pholder: '/static/images/chat/pholder.png',
  adminIcon: '/static/images/chat/chat_admin_avatar.png',
  showLoading: false,
  showNoMore: false,
  closeConversation: false,
  showOrders: false,
  showEvaluation: false,
  showReconnectConversation: false,
  request: false,
  sendMsgStatus: false,
  hasQuestionList: false,
})

const evaluation = reactive({
  show: false,
  title: '请对本次服务进行评价',
  hint: '请输入内容',
  starValue: 0,
  msg: '',
  starHighLevelList: [],
  starLowLevelList: [],
  selectTagId: [],
  selectTag: [],
})

const conversation = reactive({
  show: false,
})

const chat = reactive({
  title: '在线客服',
  hintMsg: '请输入您想咨询的问题',
  questionTitle: '热门问题',
  titleBarHeight: 0,
  contentHeight: 500,
  scrollIntoView: null,
  bottomId: 'chatIdSpace',
  inputHeight: 0,
  bottomHeight: 0,
  menuHeight: 0,
  sendText: '',
  list: [],
  toId: '0',
  dialogId: '0',
  maxId: null,
  showWait: false,
})

const param = reactive({
  page: 1,
  pageSize: 10,
  msgId: '0',
})

// 计算属性
const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => userStore.isLogin)

const handleClickLeft = () => {
  uni.navigateBack({})
}

const initWebSocket = () => {
  websocketRequest.connectSocket() // 重点监控这个函数
  websocketRequest.onMessage(handleWebSocketMessage)
  websocketRequest.onSendMessage(handleWebSocketSend)
}

const handleWebSocketMessage = (res) => {
  console.log(' websocketRequest onMessage:', res)
  let msg = JSON.parse(res)
  // console.log(" websocketRequest onMessage type:", msg.type);
  if (isQuestionList(msg.type)) {
    questions.value = formatHotQuestion(msg.payload.content).slice(0, 3)
    console.log('questionList:', questions)
  }
  if (isDialog(msg.type)) {
    //获取会话id
    if (msg.dialogId !== null && msg.dialogId !== undefined && msg.dialogId !== '') {
      chat.dialogId = msg.dialogId
    }
    conversation.show = chat.dialogId !== '0'
    return
  }

  if (isSelf(msg.type)) {
    //消息回执 第一次获取maxId
    if (chat.maxId != null && chat.maxId > 0) {
      if (chat.maxId > msg.payload.id) {
        chat.maxId = msg.payload.id
      }
    } else {
      if (msg.payload.id !== null && msg.payload.id !== undefined && msg.payload.id !== '') {
        chat.maxId = msg.payload.id
      }
    }
    //获取会话id
    if (msg.dialogId !== null && msg.dialogId !== undefined && msg.dialogId !== '') {
      chat.dialogId = msg.dialogId
    }
    conversation.show = chat.dialogId !== '0'

    //添加自动回复
    if (isSelf(msg.type) && isAdmin(msg.to.type) && msg.to.id == 0 && !chat.showWait) {
      let msg = {
        type: TYPE.conversation[1],
        from: {
          id: 0,
          username: programName.value,
          type: TYPE.send[0],
        },

        to: {
          id: isLogin.value ? userInfo.uId : 0,
          type: TYPE.send[1],
        },
        payload: {
          type: TYPE.content[0],
          content: '您好，请稍等',
        },
        timestamp: dateFormatToTimestamp(getNowDateTime()),
        dialogId: chat.dialogId,
      }
      chat.list.push(msg)
      scrollBottom(Math.random().toString(36).substr(2, 16))
      chat.showWait = true
    }
    return
  }

  if (isTips(msg.type) && isTimeout(msg.payload.type)) {
    //会话超时
    onConversationTimeOut()
    return
  }

  if (!isQuestionList(msg.type) || !empty.hasQuestionList) {
    //获取 toId
    if (isChat(msg.type) && isAdmin(msg.from.type)) {
      console.log(' 获取toId: msg.type/ msg.from.type', msg.type, msg.from.type)
      console.log(' 获取toId:', msg.from.id)
      chat.toId = msg.from.id
    }

    //获取会话id
    if (msg.dialogId !== null && msg.dialogId !== undefined && msg.dialogId !== '') {
      chat.dialogId = msg.dialogId
    }
    conversation.show = chat.dialogId !== '0'

    //展示会话消息
    chat.list.push(msg)
    scrollBottom(Math.random().toString(36).substr(2, 16))
  }
  if (isQuestionList(msg.type)) {
    empty.hasQuestionList = true
  }
}

const handleWebSocketSend = (res) => {
  chat.list.push(res)
  chat.sendText = ''
  scrollBottom(Math.random().toString(36).substr(2, 16))
}

const webSocketSend = (data) => {
  websocketRequest.send(JSON.stringify(data))
  empty.sendMsgStatus = true
}

const webSocketClose = () => {
  websocketRequest.close()
}

const onRefresh = () => {
  if (empty.request || empty.showNoMore) return
  loadMoreData()
}

const loadMoreData = () => {
  empty.showLoading = true
  empty.request = true
  const timer = setTimeout(() => {
    requestRecordHistory1()
    empty.showLoading = false
    refresher.triggered = false
    refresher.freshing = false
    clearTimeout(timer)
  }, 500)
}
const getConfig = async () => {
  const res = await getConfigList({
    configType: 3,
    tagType: 2,
  })
  if (res.code === '000') {
    console.log('getConfig ', JSON.stringify(res))
    if (res.value.length > 0) {
      res.value.forEach((config) => {
        if (config.level <= 3) {
          evaluation.starLowLevelList.push(config)
        } else {
          evaluation.starHighLevelList.push(config)
        }
      })
    }
  }
}

// 金额格式化
const formatAmount = (value) => {
  const num = Number(value)
  if (isNaN(num)) {
    console.warn('formatAmount: 输入不是有效数字', value)
    return '0.00'
  }
  return (num / 100).toFixed(2)
}

const requestDialogAppraise1 = async () => {
  let _errStr = ''
  if (evaluation.starValue <= 0) {
    _errStr = '请选择评分'
  } else if (evaluation.selectTag.length === 0) {
    _errStr = '请选择评价标签'
  }
  const _formData = {
    orderId: chat.dialogId,
    score: evaluation.starValue,
    content: evaluation.msg,
    tagsList: evaluation.selectTag,
  }
  const res = await requestDialogAppraise(_formData)
  console.log('requestDialogAppraise1:', res)
  if (res) {
    empty.showEvaluation = false
    evaluation.show = false
    evaluation.starValue = 0
    evaluation.selectTag = []
    evaluation.selectTagId = []
    evaluation.msg = ''
  }
}

const requestRecordHistory1 = async () => {
  const oldSize = chat.list.length
  const res = await requestRecordHistory({
    pageNum: param.page,
    pageSize: param.pageSize,
    maxId: chat.maxId,
  })
  console.log('requestRecordHistory', res)
  if (res.code === '000') {
    chat.list = [...res.value.list, ...chat.list]
    if (res.value.list.length < param.pageSize) {
      empty.showNoMore = true
    } else {
      param.page++
      empty.showNoMore = false
    }
    const newSize = chat.list.length
    if (newSize - oldSize >= 2) {
      scrollToView(chat.list[newSize - oldSize - 2].timestamp)
    }
    empty.request = false
  }
}

// 消息处理函数
const handleSend = (conversationType, to, payload) => {
  console.log('handleSend')
  if (empty.closeConversation) {
    showReconnect()
    return
  }

  if (to == null && payload == null) {
    const content = chat.sendText
    if (!content?.trim()) {
      uni.showToast({
        icon: 'none',
        title: '不能发送空白消息',
        duration: 1200,
      })
      return
    }
  }

  const msg = {
    type: conversationType ?? TYPE.conversation[1],
    from: {
      id: isLogin.value ? userInfo.uId : 0,
      username: isLogin.value ? userInfo.nickName : '微信用户',
      type: TYPE.send[1],
      avatar: isLogin.value ? userInfo.avatar : '',
    },
    to: {
      id: chat.toId,
      type: TYPE.send[0],
    },
    payload: {
      type: TYPE.content[0],
      content: chat.sendText,
    },
    tenantId: 'wx69fdd1c0ac8f3e90',
    timestamp: dateFormatToTimestamp(getNowDateTime()),
    dialogId: chat.dialogId,
  }

  if (to != null) msg.to = to
  if (payload != null) msg.payload = payload

  webSocketSend(msg)
}

const requestDialogFinish1 = async () => {
  let res = await requestDialogFinish(chat.dialogId)
  console.log('requestDialogFinish', res)
  // if (reuslt) {
  // 	console.log("requestDialogFinish data=", data)
  // }
}

const onHotMsg = (data) => {
  console.log('hotMsg data=', data)
  handleSend(
    TYPE.conversation[0],
    { id: data.id, type: TYPE.send[0] },
    { type: TYPE.content[0], content: data.question },
  )
}

const sendOrder = (data) => {
  console.log('sendOrder data=', data)
  handleSend(
    TYPE.conversation[1],
    { id: data.id, type: TYPE.send[0] },
    { type: TYPE.content[4], content: JSON.stringify(data) },
  )
  empty.showOrders = false
}

const onOrder = () => {
  // console.log("onOrder ")
  empty.showOrders = true
}

const onEvaluation = () => {
  // console.log("onEvaluation ")
  empty.showEvaluation = true
}
const onCloseConversation = () => {
  console.log('onCloseConversation ')
  message
    .confirm({
      msg: '您是否要结束本次会话',
      title: '提示',
    })
    .then(() => {
      onModalCloseConversation()
    })
  scrollBottom(Math.random().toString(36).substr(2, 16))
}

const linktap = (event) => {
  console.log('linktap ', event)
  if (event.href.includes('http')) {
    uni.navigateTo({
      url: '/pages_other/web?url=' + encodeURIComponent(event.href),
    })
  }
}

const showReconnect = () => {
  empty.showReconnectConversation = true
}

const onReconnect = () => {
  console.log('onReconnect ')
  initWebSocket()
  empty.showReconnectConversation = false
  empty.closeConversation = false

  //重置 会话重连参数
  chat.toId = '0'
  chat.dialogId = '0'
  chat.showWait = false
  empty.hasQuestionList = false
  evaluation.show = false
}

const starChange = (value) => {
  if ((evaluation.starValue <= 3 && value > 3) || (evaluation.starValue > 3 && value <= 3)) {
    evaluation.selectTag = []
    evaluation.selectTagId = []
  }
  evaluation.starValue = value.value
}

const onEvaluationSelect = (item) => {
  if (evaluation.selectTagId.indexOf(item.tagId) == -1) {
    evaluation.selectTagId.push(item.tagId)
    evaluation.selectTag.push(item)
  } else {
    evaluation.selectTagId.splice(evaluation.selectTagId.indexOf(item.tagId), 1)
    evaluation.selectTag.splice(evaluation.selectTagId.indexOf(item.tagId), 1)
  }
}

const onEvaluationConfirm = () => {
  requestDialogAppraise1()
}

const onModalCloseConversation = () => {
  webSocketClose()
  empty.closeConversation = true
  requestDialogFinish1()
  //处理
  console.log('onModalCloseConversation dialogId=', chat.dialogId)
  if (
    chat.dialogId !== null &&
    chat.dialogId !== undefined &&
    chat.dialogId !== '' &&
    chat.dialogId !== '0' &&
    chat.dialogId !== 0
  ) {
    evaluation.show = true
    onEvaluation()
  }
  conversation.show = false
}

const onConversationTimeOut = () => {
  webSocketClose()
  requestDialogFinish1()
  empty.closeConversation = true
  // evaluation.show = true
  conversation.show = false
  scrollBottom(scrollBottom(Math.random().toString(36).substr(2, 16)))
}

const onPreviewsImage = (url) => {
  let previewImgs = []
  previewImgs.push(config.url.getHostUrl(url))
  uni.previewImage({
    urls: previewImgs,
    // sizeType: ['original', 'compressed'],
    sizeType: ['compressed'],
    current: 0,
  })
}

const toOrderDetail = (orderId) => {
  uni.navigateTo({
    url: '/pages-sub/mine/order/orderDetail?orderId=' + orderId,
  })
}

const focusTextarea = (e) => {
  // console.log("focusTextarea event.detail=", e.detail)
  // setInputHeight(e.detail.height)
  // uni.showKeyboard()
}
const blurTextarea = (e) => {
  // console.log("blurTextarea event.detail=", e.detail)
  // setInputHeight(0)
  // uni.hideKeyboard()
}
//@keyboardheightchange
const keyboardheightchange = (e) => {
  //键盘高度发生变化的时候触发此事件，event.detail = {height: height, duration: duration}
  // console.log("keyboardheightchange event.detail=", e.detail)
  // if (event.detail.height > 0) {
  // 	setInputHeight(e.detail.height)
  // } else {
  // 	setInputHeight(0)
  // }
}

const confirmTextarea = (e) => {
  // console.log("confirmTextarea value=" + e.detail.value)
  handleSend()
}

const scroll = (event) => {
  // console.log("scroll scrollTop=", event.detail.scrollTop)
}

const setInputHeight = (height) => {
  // $nextTick(() => {
  chat.inputHeight = height
  // });
  // console.log("setInputHeight inputHeight=" + chat.inputHeight)
}

const scrollToView = (id) => {
  console.log('scrollToView id=', id)
  nextTick(() => {
    chat.scrollIntoView = 'chatId' + id
  })
}

const scrollBottom = (random) => {
  //Math.random().toString(36).substr(2,16)
  console.log('scrollBottom random=', random)
  chat.bottomId = 'bottomId' + random
  nextTick(() => {
    chat.scrollIntoView = chat.bottomId
  })
}

// 类型判断方法
// conversation 类型判断
const isQuestion = (type) => type === TYPE.conversation[0]
const isChat = (type) => type === TYPE.conversation[1]
const isQuestionList = (type) => type === TYPE.conversation[2]
const isSelf = (type) => type === TYPE.conversation[3]
const isDialog = (type) => type === TYPE.conversation[4]
const isTips = (type) => type === TYPE.conversation[5]

// send 类型判断
const isAdmin = (type) => type === TYPE.send[0]
const isUser = (type) => type === TYPE.send[1]
const isSystem = (type) => type === TYPE.send[2]

// content 类型判断
const isText = (type) => type === TYPE.content[0]
const isHtml = (type) => type === TYPE.content[1]
const isImageUrl = (type) => type === TYPE.content[2]
const isJson = (type) => type === TYPE.content[3]
const isOrder = (type) => type === TYPE.content[4]
const isTimeout = (type) => type === TYPE.content[5]

// 工具方法 - Emoji转换
const formatEmojitoBase64 = (str) => {
  const patt = /[\ud800-\udbff][\udc00-\udfff]/g
  return str.replace(patt, (char) => {
    if (char.length === 2) {
      const H = char.charCodeAt(0)
      const L = char.charCodeAt(1)
      const code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00
      return `&#${code};`
    }
    return char
  })
}

const formatBase64toEmoji = (str) => {
  const reg = /&#.*?;/g
  return str.replace(reg, (char) => {
    if (char.length === 9) {
      const code = parseInt(char.match(/[0-9]+/g))
      const H = Math.floor((code - 0x10000) / 0x400) + 0xd800
      const L = ((code - 0x10000) % 0x400) + 0xdc00
      return unescape(`%u${H.toString(16)}%u${L.toString(16)}`)
    }
    return char
  })
}

// 工具方法 - 订单和时间处理
const getOrderStatus = (status) => getAppStatus(status)
const formatMsgTime = (timestamp) => dateFormatToTime(timestamp)
const formatTime = (time) => dateFormatToTime(dateFormatToTimestamp(time))

// 工具方法 - JSON解析
const formatHotQuestion = (str) => JSON.parse(str)
const formatOrder = (str) => JSON.parse(str)

// 获取视图高度
const getViewHeight = () => {
  uni
    .createSelectorQuery()
    .select('#chat-bottom')
    .boundingClientRect((res) => {
      chat.bottomHeight = res?.height || 0
      setContentHeight()
    })
    .exec()

  uni
    .createSelectorQuery()
    .select('#chat-menu-box')
    .boundingClientRect((res) => {
      chat.menuHeight = res?.height || 0
      setContentHeight()
    })
    .exec()
}

const setContentHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  chat.contentHeight =
    systemInfo.screenHeight -
    chat.titleBarHeight -
    // chat.bottomHeight -
    chat.inputHeight -
    chat.menuHeight
}
// 生命周期
onMounted(() => {
  webSocketClose()
  initWebSocket()
  const rect = uni.getMenuButtonBoundingClientRect?.()
  chat.titleBarHeight = rect ? rect.top + rect.height + 8 : 0
  // chat.titleBarHeight = 8
  getViewHeight()
  getConfig()
  loadMoreData()

  uni.onKeyboardHeightChange((res) => {
    chat.inputHeight = res.height > 0 ? res.height : 0
    setContentHeight()
  })
})

onUnload(() => {
  webSocketClose()
})
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f3f4f4;
}

.transparent-navbar {
  background-color: transparent !important;
  border: none !important;
  position: relative;
  z-index: 100;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 0;
}

.top-section {
  position: relative;
  width: 90%;
  padding: 20rpx;
  display: block;
  margin-bottom: 20rpx;
}

.overlay-container {
  margin-top: 150rpx;
  position: relative; /* 关键：开启新定位上下文 */
  z-index: 1; /* 确保内容层在图片上方 */
  width: 100%;
}

/* 原有的.flame-icon样式需保留 */
.flame-icon {
  width: 30rpx;
  height: 30rpx;
  margin: 0 10rpx;
}

/* 确保卡片样式不变 */
.card-container {
  margin-top: 20rpx;
  min-height: 250rpx;
}
.question-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 18rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

/* 移植原有聊天样式 */
.chat-scroll-view {
  position: relative;
  z-index: 1;
  border-radius: 16rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.chat-content {
  padding: 20rpx;
}

.view-loadmore {
  display: flex;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 400;
  color: #a3a7ad;
  line-height: 36rpx;
}

.view-nomore {
  display: flex;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 400;
  color: #a3a7ad;
  line-height: 36rpx;
}

.chat-admin {
  display: flex;
  padding: 20rpx 0;
}

.chat-admin-avatar {
  display: flex;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  overflow: hidden;
}

.chat-admin-box {
  background-color: #fff;
}

.chat-admin-info {
  margin: 10rpx 36rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #6f7894;
  line-height: 23rpx;
}

.chat-admin-content {
  background-color: #ffffff;
  position: relative;
  max-width: 486rpx;
  border-radius: 8rpx;
  word-wrap: break-word;
  padding: 28rpx 24rpx;
  margin: 0 24rpx;
  border-radius: 5px;
  font-size: 24rpx;
  font-weight: 400;
  color: #08080a;
  line-height: 36rpx;
  white-space: pre-wrap;
}

.chat-admin-hot-content {
  background-color: #fff;
  position: relative;
  width: 486rpx;
  border-radius: 8rpx;
  word-wrap: break-word;
  padding: 28rpx 24rpx;
  margin: 0 24rpx;
  border-radius: 5px;
}

.hot-content-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2f72f6;
  line-height: 42rpx;
  padding-bottom: 30rpx;
}

.hot-content {
  font-size: 24rpx;
  font-weight: 400;
  color: #08080a;
  line-height: 36rpx;
}

.hot-content-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.hot-content-line {
  height: 1rpx;
  width: 100%;
  margin: 22rpx 0;
  background-color: #eeeeee;
}

.hot-content-line:last-child {
  height: 0rpx;
}

.chat-admin-content::after {
  position: absolute;
  display: inline-block;
  content: '';
  width: 0;
  height: 0;
  top: 10rpx;
  right: 100%;
  border: 12rpx solid transparent;
  border-right: 12rpx solid #ffffff;
}

.chat-admin-hot-content::after {
  position: absolute;
  display: inline-block;
  content: '';
  width: 0;
  height: 0;
  top: 10rpx;
  right: 100%;
  border: 12rpx solid transparent;
  border-right: 12rpx solid #ffffff;
}

.chat-user {
  display: flex;
  padding: 20rpx 30rpx;
  justify-content: flex-end;
}

.chat-user-avatar {
  display: flex;
  justify-content: center;
  width: 78rpx;
  height: 78rpx;
  background: #c2dcff;
  border-radius: 8rpx;
  overflow: hidden;
}

.chat-user-box {
}

.chat-user-info {
  display: flex;
  justify-content: flex-end;
  margin: 10rpx 36rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #6f7894;
  line-height: 23rpx;
}

.chat-user-content {
  background-color: #fff;
  position: relative;
  max-width: 486rpx;
  border-radius: 8rpx;
  word-wrap: break-word;
  padding: 28rpx 24rpx;
  margin: 0 24rpx;
  border-radius: 5px;
  font-size: 24rpx;
  font-weight: 500;
  color: #08080a;
  line-height: 42rpx;
  white-space: pre-wrap;
}

.chat-user-content::after {
  position: absolute;
  display: inline-block;
  content: '';
  width: 0;
  height: 0;
  left: 100%;
  top: 10rpx;
  border: 12rpx solid transparent;
  border-left: 12rpx solid #f5f5f5;
}

.view-close {
  display: flex;
  justify-content: center;
  height: 36rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #a3a7ad;
  line-height: 36rpx;
}

.chat-menu-box {
  width: 100%;
  height: 60rpx;
  display: flex;
  flex-direction: row;
  position: relative;
  margin-bottom: 150rpx;
}

.chat-menu-order {
  width: 160rpx;
  height: 56rpx;
  background: #ffffff;
  border-radius: 48rpx;
  margin-left: 24rpx;

  font-size: 28rpx;
  font-weight: 400;
  color: #000000;
  line-height: 56rpx;
  text-align: center;
}

.chat-menu-evaluation {
  width: 160rpx;
  height: 56rpx;
  background: #ffffff;
  border-radius: 48rpx;
  margin-left: 32rpx;

  font-size: 28rpx;
  font-weight: 400;
  color: #000000;
  line-height: 56rpx;
  text-align: center;
}

.chat-menu-close {
  width: 160rpx;
  height: 56rpx;
  background: #ffffff;
  border-radius: 48rpx;
  border: 1rpx solid #ff3b30;
  margin-left: 32rpx;

  font-size: 28rpx;
  font-weight: 400;
  color: #ff3b30;
  line-height: 56rpx;
  text-align: center;
}

/* 适配新布局的调整 */
.chat-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 16rpx;
}

.send-msg {
  display: flex;
  align-items: center;
  width: 100%;
  position: fixed;
  margin-bottom: 50rpx;
}

.uni-textarea {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 20rpx; /* 调整内边距，让内容不贴边 */
  box-sizing: border-box; /* 确保padding不会增加总宽度 */
}

.terea-style {
  flex: 1; /* 让textarea占据剩余空间 */
  height: 120rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 32rpx;
  padding: 22rpx 20rpx; /* 只保留顶部内边距，底部留出空间给图片 */
  margin-right: 20rpx; /* 和图片之间的间距 */
  background: #fff;
  border-radius: 16rpx;
}

.chat-bottom-send {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  /* 确保图片底部对齐 */
  align-self: center;
}

button::after {
  border: none;
}

.order-box {
  height: 210rpx;
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  margin: 32rpx 32rpx 0rpx;
  padding: 24rpx 32rpx;
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
  color: #fc7a43;
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
  margin-top: 20rpx;

  width: 144rpx;
  height: 58rpx;
  background: #2f72f6;
  border-radius: 58rpx;

  font-size: 24rpx;
  font-weight: 500;
  color: #ffffff;
  line-height: 58rpx;
  text-align: center;
}
</style>
