import { http } from '@/utils/http'
export const getSystemMsg = (param) => {
  return http({
    url: '/wechat/system/message',
    method: 'GET',
  })
}
export const getMsgReadAll = (param) => {
  return http({
    url: '/wechat/user/messages/readAll',
    showLoading: true,
    showFinish: true,
  })
}

export const getMsgCount = (param) => {
  return http({
    url: '/wechat/user/messages/unreadMessageNumber',
    method: 'GET',
  })
}

export const getMsgList = (param) => {
  const queryString = Object.entries(param)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&')

  return http({
    url: `/wechat/user/messages?${queryString}`,
    method: 'GET',
  })
}
