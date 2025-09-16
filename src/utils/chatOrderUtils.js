// 状态列表配置
export const statusList = [
  {
    name: '待首付款',
    status: 100,
    color: '#53CCAF',
    background: 'rgba(83, 204, 175, 0.10)',
  },
  {
    name: '待接单',
    status: 110,
    color: '#53CCAF',
    background: 'rgba(83, 204, 175, 0.10)',
  },
  {
    name: '待服务',
    status: 120,
    color: '#FC7A43',
    background: 'rgba(252,122,67,0.1)',
  },
  {
    name: '服务中',
    status: 130,
    color: '#8770FC',
    background: 'rgba(135, 112, 252, 0.10)',
  },
  {
    name: '待支付',
    status: 140,
    color: '#53CCAF',
    background: 'rgba(83, 204, 175, 0.10)',
  },
  {
    name: '已完成',
    status: 150,
    color: '#398AFD',
    background: 'rgba(47, 114, 246, 0.10)',
  },
  {
    name: '已取消',
    status: 160,
    color: '#A1A1A1',
    background: 'rgba(161, 161, 161, 0.10)',
  },
  {
    name: '已取消',
    status: 170,
    color: '#A1A1A1',
    background: 'rgba(161, 161, 161, 0.10)',
  },
  {
    name: '待售后',
    status: 180,
    color: '#FC7A43',
    background: 'rgba(252,122,67,0.1)',
  },
]

/**
 * 根据状态码获取订单状态信息
 * @param {number} status - 订单状态码
 * @returns {Object} 包含状态名称、颜色和背景色的对象
 */
export function getAppStatus(status) {
  // 优先匹配精确状态码
  const match = statusList.find((item) => item.status === status)

  // 未找到时返回默认值
  return (
    match || {
      name: '未知状态',
      color: '#666',
      background: '#f5f5f5',
    }
  )
}

/**
 * 时间格式化方法
 * @param {string|number} timeString - 时间字符串或时间戳
 * @returns {string} 格式化后的中文日期字符串 (格式：YYYY年MM月DD日)
 */
export function formatTime(timeString) {
  if (!timeString) return ''

  try {
    let date

    // 处理数字类型的时间戳（包括字符串形式的数字）
    if (typeof timeString === 'number' || /^\d+$/.test(timeString)) {
      let timestamp = parseInt(timeString)
      // 处理10位时间戳（秒级）
      if (timestamp.toString().length === 10) {
        timestamp *= 1000
      }
      date = new Date(timestamp)
    }
    // 处理字符串类型的时间
    else {
      // 替换特殊字符确保浏览器兼容性
      const formattedTime = timeString.replace(/-/g, '/').replace(/\./g, '/')
      date = new Date(formattedTime)
    }

    // 验证日期有效性
    if (isNaN(date.getTime())) {
      return timeString
    }

    // 获取日期各部分并格式化为中文
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}年${month}月${day}日`
  } catch (e) {
    console.error('时间格式化错误:', e)
    return timeString
  }
}

/**
 * 获取当前格式化的日期时间
 * @returns {string} YYYY-MM-DD HH:mm:ss 格式的当前时间
 */
export function getNowDateTime() {
  return dateFormatToTime(Date.now())
}

/**
 * 日期字符串转时间戳
 * @param {string} time - 日期字符串 (YYYY-MM-DD HH:mm:ss)
 * @returns {number} 时间戳(毫秒)
 */
export function dateFormatToTimestamp(time) {
  return new Date(time.replace(/-/g, '/')).getTime()
}

// 预定义格式的快捷方法
export const dateFormatToTime = (timestamp) => formatDate(timestamp)
export const dateFormatToDate = (timestamp) => formatDate(timestamp, 'YYYY年MM月DD日')
export const dateFormat = (timestamp) => formatDate(timestamp, 'MM-DD HH:mm')
