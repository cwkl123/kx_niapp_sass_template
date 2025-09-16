// const serverUrl = process.env.VUE_APP_BASE_URL
const serverUrl = import.meta.env.VITE_SERVER_BASEURL
// const serverUrl = 'https://run.tonglianjituan.com'
// const serverUrl = 'http://120.25.165.230:8764'
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL
const uploadUrl = import.meta.env.VITE_UPLOAD_BASEURL
export const formatDate = (dateString) => {
  let datePart = dateString.split(' ')[0] // 提取日期部分
  let formattedDate = datePart.replace(/-/g, '.') // 将 '-' 替换为 '.'
  return formattedDate
}
export const getHostUrl = (url) => {
  if (url == null || url == '' || url == undefined) {
    return '/static/pholder.png'
  }

  if (url.substring(0, '/static/'.length) == '/static/') {
    return url
  }

  if (url.includes('http')) {
    return url
  }

  return uploadUrl + url
}
export const formatAmount = (value) => {
  if (!value && value !== 0) return '0.00'
  return parseFloat(value).toFixed(2)
}

export const formatAmount0 = (value, num) => {
  if (!value && value !== 0) return '0'
  return parseFloat(value / 100).toFixed(num)
}
// 默认导出其他配置项
export default {
  serverUrl: serverUrl,
  websocketUrl: websocketUrl,
  uploadUrl: uploadUrl,
}
