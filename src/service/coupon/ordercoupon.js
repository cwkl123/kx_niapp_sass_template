/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-27 14:23:38
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-15 09:34:06
 * @FilePath: \huijiashenghuo_niapp\src\service\coupon\ordercoupon.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'

export const approveDiscount = (param) => {
  return http({
    method: 'POST',
    url: '/repairsAddress/findRepairsAddress',
  })
}

export const couponPopUpWindows = () => {
  return http({
    method: 'POST',
    url: '/userCoupon/couponPopUpWindows',
  })
}
export const availableCouponList = (param) => {
  return http({
    method: 'POST',
    url: '/userCoupon/availableCouponList',
    data: param,
    showLoading: true,
  })
}
export const receiveDiscount = (param) => {
  return http({
    method: 'POST',
    url: '/userCoupon/getCoupon',
    data: param,
    showLoading: true,
    showFinish: true,
    finishTitle: '领取成功！',
  })
}
export const userDiscountList = (param) => {
  return http({
    method: 'POST',
    url: '/userCoupon/userCouponList',
    data: param,
    showLoading: true,
  })
}
export const useDiscount = (param) => {
  return http({
    method: 'POST',
    url: '/userCoupon/userCouponUsableList',
    data: param,
    showLoading: true,
  })
}
export const savaOrderCoupon = (param) => {
  return http({
    method: 'POST',
    url: '/order/savaOrderCoupon',
    data: param,
    showLoading: true,
  })
}
export const getServiceCouponCount = (param) => {
  return http({
    url: '/wechat/serviceItem/' + param.serviceId + '/' + param.uId + '/couponCount',
    method: 'GET',
  })
}
export const getServiceCouponList = (param) => {
  return http({
    url: '/wechat/serviceItem/' + param.serviceId + '/' + param.uId + '/coupons',
    method: 'GET',
  })
}
export const getOrderCouponList = (param) => {
  return http({
    url: '/wechat/order/' + param.orderId + '/coupons',
    method: 'GET',
  })
}
