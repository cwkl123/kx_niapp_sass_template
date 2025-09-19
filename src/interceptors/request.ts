/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-25 15:55:54
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-05 13:34:33
 * @FilePath: \huijiashenghuo_uniapp\src\interceptors\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable no-param-reassign */
import qs from 'qs'
import { useLoginStore } from '@/store'
import { platform } from '@/utils/platform'
import { getEnvBaseUrl } from '@/utils'

export type CustomRequestOptions = UniApp.RequestOptions & {
  showLoading?: boolean
  loadingTitle?: string
  showFinish?: boolean
  finishTitle?: string
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 请求基准地址
const baseUrl = getEnvBaseUrl()

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // console.log(options, '1111111111111111111111111')
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 自动拼接代理前缀
        options.url = import.meta.env.VITE_APP_PROXY_PREFIX + options.url
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    // 1. 请求超时
    options.timeout = 20000 // 10s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      'tenant-id': 'wx3ce16b0a073907cb',
      platform, // 可选，与 uniapp 定义的平台一致，告诉后台来源
      ...options.header,
    }
    // 3. 添加 token 请求头标识
    const loginInfoStore = useLoginStore()
    const token = loginInfoStore.loginInfo.token
    // console.log(token, '1111111111111111111111111111111111111111111111111111111token值')
    if (token) {
      // options.header.Authorization = `Bearer ${token}`
      options.header.token = token
    }
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
