/*
 * @Author: August_rush
 * @Date: 2025-06-30 09:08:38
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-18 09:35:21
 * @FilePath: \huijiashenghuo_uniapp\src\service\user\userSelApi.js
 * @Description:
 *
 */
import { http } from '@/utils/http'
export const updateUserData = (param) => {
  return http({
    url: '/kuaixiu/api/user/update_user_data',
    data: param,
    showLoading: true,
    loadingTitle: '正在提交',
    showFinish: true,
    finishTitle: '提交成功！',
  })
}

export const myInfo = (param) => {
  return http({
    url: '/kuaixiu/api/user/get_user_data',
  })
}

export const sendCode = (param) => {
  return http({
    url: '/kuaixiu/api/user/sendCode',
    data: param,
  })
}

export const editPhone = (param) => {
  return http({
    url: '/kuaixiu/api/user/editPhone',
    data: param,
  })
}

export const updateInfo = (param) => {
  return http({
    url: '/wxUser/update',
    data: param,
    showLoading: true,
  })
}
