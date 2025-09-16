/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-27 09:14:11
 * @LastEditors: August_rush 864011713@qq.com
 * @LastEditTime: 2025-06-30 09:11:52
 * @FilePath: \huijiashenghuo_uniapp\src\service\base\loginApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'

// 登录
export const doLogin = (param) => {
  return http({
    url: '/wxUser/login/' + param.code,
    showLoading: true,
    loadingTitle: '登录中',
    method: 'GET',
    showFinish: true,
    finishTitle: '登录成功！',
  })
}

// 注册
export const register = (param) => {
  return http({
    url: '/wxUser/regLogin',
    data: param,
    showLoading: true,
    loadingTitle: '正在绑定手机号',
    method: 'POST',
    showFinish: true,
    finishTitle: '绑定手机号成功！',
  })
}

// 获取手机号
export const getWXPhone = (param) => {
  return http({
    url: '/wxUser/phone',
    data: param,
    showLoading: true,
    loadingTitle: '正在获取手机号',
    method: 'POST',
  })
}

// 获取用户信息
export const getWxUserInfo = (param) => {
  return http({
    url: '/wxUser/userWxInfo',
    query: param,
    method: 'GET',
  })
}

// 获取token
export const getToken = (param) => {
  return http({
    url: '/wxUser/isPhone/' + param.openId,
    query: param,
    method: 'GET',
  })
}
