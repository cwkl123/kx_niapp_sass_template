/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-27 15:01:22
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-06-27 15:04:26
 * @FilePath: \huijiashenghuo_niapp\src\service\msg\chatApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'
export const requestQuestionsList = (param) => {
  return http({
    url: '/wechat/questions',
    method: 'GET',
    data: param,
  })
}
export const requestRecordHistory = (param) => {
  return http({
    url: '/record/history',
    data: param,
    showLoading: true,
  })
}
export const requestDialogFinish = (param) => {
  return http({
    url: '/dialog/finish/' + param,
    data: param,
    showLoading: true,
  })
}
export const getConfigList = (param) => {
  return http({
    url: '/system/getSysConfig/' + param.configType,
    method: 'GET',
    data: {
      tagType: param.tagType,
    },
  })
}
export const requestDialogAppraise = (param) => {
  return http({
    url: '/dialog/appraise',
    data: param,
    showLoading: true,
    loadingTitle: '正在提交',
    showFinish: true,
    finishTitle: '提交成功！',
  })
}
