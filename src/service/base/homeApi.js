import { http } from '@/utils/http'
export const getAdvertList = (param) => {
  return http({
    url: '/advert/getList',
    showLoading: true,
    method: 'POST',
    data: param,
  })
}
export const requestIndexMenu = (param) => {
  return http({
    url: '/wechat/index/menu',
    data: param,
    method: 'GET',
  })
}
export const requestAdvertList = (param) => {
  return http({
    url: '/wechat/advert/getList',
    method: 'GET',
    data: param,
  })
}
