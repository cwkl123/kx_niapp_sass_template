/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-03 14:23:27
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-09 10:19:26
 * @FilePath: \huijiashenghuo_niapp\src\service\base\addressApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'
export const updateDefaultAddress = (param) => {
  return http({
    url: '/kuaixiu/api/address/update_default_address',
    data: param,
    showLoading: true,
    loadingTitle: '正在设置',
    showFinish: true,
    finishTitle: '设置成功！',
  })
}

export const findAddressCount = (param) => {
  return http({
    url: '/repairsAddress/findAddressCount',
    data: param,
  })
}

export const getUserAddress = (param) => {
  return http({
    url: '/repairsAddress/findRepairsAddress',
    data: param,
    showLoading: true,
  })
}

export const addAddress = (param) => {
  return http({
    url: '/repairsAddress/insertRepairsAddress',
    data: param,
    showLoading: true,
    loadingTitle: '正在保存',
    showFinish: true,
    finishTitle: '保存成功！',
  })
}

export const updateAddress = (param) => {
  return http({
    url: '/repairsAddress/updateRepairsAddress',
    method: 'POST',
    data: param,
    showLoading: true,
    loadingTitle: '正在保存',
    showFinish: true,
    finishTitle: '保存成功！',
  })
}

export const deleteAddress = (param) => {
  return http({
    url: '/repairsAddress/delete/' + param.repairsId,
    method: 'GET',
    data: param,
    showLoading: true,
    loadingTitle: '正在删除',
    showFinish: true,
    finishTitle: '删除成功！',
  })
}

export const getAddressDetail = (param) => {
  return http({
    url: '/repairsAddress/findDefaultRepairsAddress',
    method: 'GET',
  })
}

export const getRegion = (param) => {
  return http({
    url: '/location/county',
    method: 'POST',
    showLoading: true,
    data: {
      cityName: '上海市',
      cityId: '310100000000',
    },
  })
}

export const getlocationTown = (param) => {
  return http({
    url: '/location/town',
    method: 'POST',
    data: param,
    showLoading: true,
  })
}

export const getBindAddress = (param) => {
  return http({
    url: '/kuaixiu/orgbank/getOrgBankList',
    data: param,
    method: 'POST',
  })
}
