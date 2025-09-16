import { http } from '@/utils/http'

export const getCommentCount = (param) => {
  return http({
    url: '/gifts/commentCount/' + param.id,
    method: 'GET',
  })
}
export const requestGiftsScanAndView = (param) => {
  return http({
    url: '/wechat/gifts/scanAndView',
    method: 'GET',
    data: param,
  })
}
export const requestGiftsScanAndReceive = (param) => {
  return http({
    url: '/wechat/gifts/scanAndReceive',
    data: param,
    method: 'POST',
    showLoading: true,
  })
}
export const requestGiftsScanCount = (param) => {
  return http({
    url: '/wechat/gifts/wait/count',
    method: 'GET',
  })
}
export const requestGiftsWaitList = (param) => {
  return http({
    url: '/wechat/gifts/wait',
    method: 'GET',
    data: param,
    showLoading: true,
  })
}
export const getIndexGiftsList = () => {
  return http({
    url: '/gifts/isIndex',
    method: 'GET',
  })
}
export const requestGiftsList = (param) => {
  return http({
    url: '/wechat/getGiftList',
    method: 'GET',
    data: param,
  })
}
export const createGiftsOrders = (param) => {
  return http({
    url: '/wechat/gifts/' + param.giftId + '/order',
    method: 'POST',
  })
}
export const buyGifts = (param) => {
  return http({
    url: '/wechat/gifts/' + param.orderId + '/purchase',
    method: 'POST',
  })
}
export const redeemGift = (param) => {
  return http({
    url: '/wechat/gifts/redeem',
    method: 'POST',
    data: param,
    showLoading: true,
  })
}
export const getGiftOrder = (param) => {
  return http({
    url: '/wechat/gift-orders/' + param.orderId,
    method: 'GET',
    data: param,
  })
}
export const getUserGiftCount = (param) => {
  return http({
    url: '/wechat/users/current/gifts/coupons/count',
    method: 'GET',
    data: param,
  })
}
export const getUserGiftsList = (param) => {
  return http({
    url: '/wechat/users/current/gifts/coupons',
    method: 'GET',
    data: param,
  })
}
export const getUserValidGiftsList = (param) => {
  return http({
    url: '/wechat/users/current/gifts/coupons/valid',
    method: 'GET',
    data: param,
    showLoading: true,
  })
}
export const getUserInvalidGiftsList = (param) => {
  return http({
    url: '/wechat/users/current/gifts/coupons/invalid',
    method: 'GET',
    data: param,
    showLoading: true,
  })
}
export const getGiftDetails = (param) => {
  return http({
    url: '/wechat/gifts/' + param.id + '/detail',
    method: 'GET',
  })
}
export const addDetailView = (param) => {
  return http({
    url: '/wechat/gifts/addDetailView/' + param.id,
    method: 'GET',
  })
}
export const addBuyView = (param) => {
  return http({
    url: '/wechat/gifts/addBuyView/' + param.id,
    method: 'GET',
  })
}
export const requestUserGiftsTag = (param) => {
  return http({
    url: '/wechat/user/tag',
    method: 'GET',
  })
}
