/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-07 09:40:20
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-18 14:25:37
 * @FilePath: \huijiashenghuo_niapp\src\service\serve\serveApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'
export const getlistOfAppointmentHours = (param) => {
  return http({
    url:
      '/serviceItem/listOfAppointmentHours/' +
      param.serviceId +
      '/' +
      param.day +
      '/' +
      param.addressId,
    method: 'GET',
  })
}
export const getListOfAppointmentTimes = (param) => {
  return http({
    url: '/serviceItem/listOfAppointmentTimes/' + param.serviceId,
    method: 'GET',
  })
}
export const getCommentCount = (param) => {
  return http({
    url: '/serviceItem/commentCount/' + param.id,
    method: 'GET',
  })
}
export const get_classify_list = (param) => {
  return http({
    url: '/category/queryCategory/' + param.cateName,
    method: 'GET',
  })
}
export const get_classify_list_filter = (param) => {
  return http({
    url: '/category/queryCategory/all/' + param.uId,
    method: 'GET',
    showLoading: true,
  })
}
export const get_service_item_list = (param) => {
  return http({
    url: '/category/serviceItemAllByCate/' + param.type + '/' + param.search + '/' + param.uId,
    method: 'GET',
  })
}
export const search_service_item_list = (param) => {
  return http({
    url: '/category/serviceItemAll/' + param.search + '/' + param.uId,
    method: 'GET',
  })
}
export const getServeDetail = (param) => {
  return http({
    url: '/wechat/serviceItem/' + param.serviceId + '/' + param.uId,
    method: 'GET',
  })
}
export const getServeGroupsDetail = (param) => {
  return http({
    url: '/wechat/serviceItem',
    data: param,
    method: 'GET',
  })
}
export const getServeItemData = (param) => {
  return http({
    url: '/kuaixiu/api/serveitem/findServeItem',
    data: param,
  })
}
export const getClassifyIndex = (param) => {
  return http({
    url: '/kuaixiu/api/classify/getClassifyIndex',
    data: param,
  })
}
