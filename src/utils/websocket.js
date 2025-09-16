// utils/useWebSocket.js
import { ref, computed, onUnmounted } from 'vue'
import { useLoginStore } from '@/store'

export function useWebSocket() {
  const loginStore = useLoginStore()

  // 响应式状态
  const socket = ref(null)
  const isReconnecting = ref(false)
  const messageCallback = ref(null)
  const sendMessageCallback = ref(null)

  // 配置参数
  const config = {
    url: import.meta.env.VITE_WEBSOCKET_URL,
    heartBeatTime: 20000,
    reconnectTime: 3000,
  }

  // 定时器引用
  const heartBeatInterval = ref(null)
  const reconnectInterval = ref(null)

  // 计算属性获取 token
  const token = computed(() => loginStore.loginInfo?.token || '')

  // 构建带 token 的 URL
  const getSocketUrl = () => {
    console.log(
      `${config.url}?token=${encodeURIComponent(token.value)}&tenant-id=wx69fdd1c0ac8f3e90`,
    )
    return `${config.url}?token=${encodeURIComponent(token.value)}&tenant-id=wx69fdd1c0ac8f3e90`
  }

  // 连接 WebSocket
  const connectSocket = () => {
    uni.closeSocket()
    if (!token.value) {
      console.error('未检测到 token，请先登录')
      return
    }
    const url = getSocketUrl()
    console.log('connectSocket url=', url)
    socket.value = uni.connectSocket({
      url: url,
      success: (res) => {
        console.log('connectSocket 正准备建立 websocket 中...')
      },
      fail: () => {
        console.log('connectSocket 建立 websocket 失败...')
      },
    })
    socket.value.onOpen((res) => {
      console.log('onOpen 连接已打开！') // 注意这里日志改了，便于区分
      startHeartBeat()
      stopReconnect()
      isReconnecting.value = false
    })
    // 监听 WebSocket 接收消息事件
    socket.value.onMessage((res) => {
      console.log('WebSocket 收到消息：', res.data)
      if (!res.data || res.data.toUpperCase() === 'PONG') return
      if (typeof messageCallback.value === 'function') {
        messageCallback.value(res.data)
      }
    })

    // 监听 WebSocket 连接关闭事件
    socket.value.onClose((res) => {
      console.log('WebSocket 连接已关闭', res)
      stopHeartBeat() // 停止心跳
      // 如果不是主动关闭（比如在重连中），则尝试重连
      if (!isReconnecting.value) {
        reconnect()
      }
    })

    // 监听 WebSocket 错误事件
    socket.value.onError((res) => {
      console.error('WebSocket 连接发生错误：', res)
      stopHeartBeat() // 停止心跳
      // 如果不是主动重连中，则尝试重连
      if (!isReconnecting.value) {
        reconnect()
      }
    })

    // // 监听 WebSocket 连接成功事件
    // uni.onSocketOpen((res) => {
    //   console.log('onSocketOpen 连接已打开')
    //   startHeartBeat()
    //   stopReconnect()
    //   isReconnecting.value = false
    // })

    // // 监听 WebSocket 接收消息事件
    // uni.onSocketMessage((res) => {
    //   console.log('onSocketMessage 收到消息：', JSON.parse(res.data))
    //   if (!res.data || res.data.toUpperCase() === 'PONG') return
    //   if (typeof messageCallback.value === 'function') {
    //     messageCallback.value(res.data)
    //   }
    // })

    // // 监听 WebSocket 连接关闭事件
    // uni.onSocketClose((res) => {
    //   console.log('onSocketClose 连接已关闭')
    //   if (!isReconnecting.value) {
    //     reconnect()
    //   }
    // })

    // // 监听 WebSocket 错误事件
    // uni.onSocketError((res) => {
    //   console.error('onSocketError 连接发生错误：', res)
    //   if (!isReconnecting.value) {
    //     reconnect()
    //   }
    // })
  }

  // 注册消息回调函数
  const onMessage = (callback) => {
    if (typeof callback === 'function') {
      messageCallback.value = callback
    }
  }

  // 消息发送成功回调函数
  const onSendMessage = (callback) => {
    if (typeof callback === 'function') {
      sendMessageCallback.value = callback
    }
  }

  // 发送消息
  const send = (data) => {
    if (!socket.value) {
      console.log('WebSocket 未连接')
      uni.showToast({
        icon: 'none',
        title: '消息发送失败',
        duration: 1200,
      })
      return
    }

    if (data && data !== 'PING') {
      uni.showLoading({
        title: '发送中...',
      })
    }

    uni.sendSocketMessage({
      data: data,
      success: () => {
        console.log('消息发送成功', data)
        if (data === 'PING') return

        if (typeof sendMessageCallback.value === 'function') {
          sendMessageCallback.value(JSON.parse(data))
        }
      },
      fail: () => {
        console.log('消息发送失败')
        uni.showToast({
          icon: 'none',
          title: '消息发送失败',
          duration: 1200,
        })
      },
      complete: () => {
        console.log('消息发送(失败/成功) complete:', data)
        uni.hideLoading()
      },
    })
  }

  // 发送心跳
  const startHeartBeat = () => {
    heartBeatInterval.value = setInterval(() => {
      send('PING')
    }, config.heartBeatTime)
  }

  // 停止心跳
  const stopHeartBeat = () => {
    console.log('stopHeartBeat')
    clearInterval(heartBeatInterval.value)
  }

  // 关闭连接
  const close = () => {
    console.log('close', '关闭连接')
    isReconnecting.value = true
    if (socket.value) {
      uni.closeSocket()
      socket.value = null
    }
    stopHeartBeat()
    stopReconnect()
  }

  // 重连
  const reconnect = () => {
    stopHeartBeat()
    isReconnecting.value = true
    console.log('reconnect', '正在准备重连...')

    reconnectInterval.value = setInterval(() => {
      console.log('reconnect', '正在重连中...')
      connectSocket()
    }, config.reconnectTime)
  }

  // 关闭重连
  const stopReconnect = () => {
    console.log('stopReconnect', '关闭重连...')
    clearInterval(reconnectInterval.value)
  }

  // 组件卸载时清理
  onUnmounted(() => {
    close()
  })

  return {
    socket,
    isReconnecting,
    connectSocket,
    onMessage,
    onSendMessage,
    send,
    close,
  }
}
