const statusList = [
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

export function getAppStatus(status) {
  for (let item of statusList) {
    if (item.status == status) {
      return item
    }
  }
}

export function getNowDateTime() {
  return dateFormatToTime(Date.now())
}

export function dateFormatToTimestamp(time) {
  let date = new Date(time.replace(/-/g, '/').replace(/\./g, '/'))
  return Date.parse(date.toString())
}

export function dateFormatToTime(timestamp) {
  timestamp = timestamp ? timestamp : null
  let date = new Date(timestamp)
  let Y = date.getFullYear() + '.'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.'
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

// 将statusList也导出
export { statusList }
