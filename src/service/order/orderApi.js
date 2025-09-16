import { http } from '@/utils/http'

export const getConfigData = (param) => {
  return http({
    url: '/miniProgram/getData',
    method: 'POST',
    data: param,
  })
}
export const getOrderCount = (param) => {
  return http({
    url: '/order/orderCountByUser',
    method: 'GET',
  })
}
export const getOrderWeekTimes = (param) => {
  return http({
    url: '/serviceItem/listOfAppointmentTimes/' + param.serviceId,
    method: 'GET',
  })
}

export const getOrderHourTimes = (param) => {
  return http({
    url:
      '/serviceItem/listOfAppointmentHours/' +
      param.serviceId +
      '/' +
      param.day +
      '/' +
      param.addressId,
    method: 'GET',
    showLoading: true,
  })
}
export const createOrder = (param) => {
  return http({
    url: '/order/ins',
    data: param,
    showLoading: true,
    loadingTitle: '正在提交...',
  })
}
export const getOrderPage = (param) => {
  return http({
    showLoading: true,
    url: '/order/queryOrder',
    data: param,
  })
}
export const selectRepairer = (param) => {
  return http({
    url: '/repairer/selectRepairer',
    data: param,
  })
}

export const evaluateOrder = (param) => {
  return http({
    showLoading: true,
    url: '/appraise/insert',
    loadingTitle: '正在提交',
    showFinish: true,
    finishTitle: '提交成功！',
    data: param,
  })
}
export const cancelOrder = (param) => {
  return http({
    showLoading: true,
    url: '/order/cancelOrder/' + param.orderId,
    method: 'GET',
    loadingTitle: '正在取消',
    showFinish: true,
    finishTitle: '取消成功！',
  })
}
export const getConfig = (param) => {
  return http({
    url: '/kuaixiu/api/kxConfig/getConfig',
    data: param,
  })
}
export const getDetail = (param) => {
  return http({
    url: '/order/getOrderDetail/' + param.orderId,
    method: 'GET',
    showLoading: true,
  })
}
export const updateOrderTime = (param) => {
  return http({
    showLoading: true,
    url: '/order/updateOrderTime',
    loadingTitle: '正在修改',
    showFinish: true,
    finishTitle: '修改成功！',
    data: param,
  })
}
export const goPay = (param) => {
  return http({
    showLoading: true,
    url: '/trade/applet',
    data: param,
  })
}
export const getUpdateOrder = (param) => {
  return http({
    url: '/order/getOrderUpdate',
    method: 'GET',
  })
}
export const getstimee = (param) => {
  return http({
    showLoading: true,
    url: '/order/ins',
    loadingTitle: '正在提交',
    data: param,
  })
}
export const updateOrderAddress = (param) => {
  return http({
    url: '/order/updateOrderAddress/' + param.orderId + '/' + param.repairsId,
    method: 'GET',
    showLoading: true,
    loadingTitle: '正在修改',
    showFinish: true,
    finishTitle: '修改成功！',
    data: param,
  })
}
export const updateOrderBatch = (param) => {
  return http({
    url: '/order/updateBatch',
    data: param,
    showLoading: true,
    loadingTitle: '正在跳转',
  })
}
