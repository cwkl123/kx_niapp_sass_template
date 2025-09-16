/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-26 14:25:58
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-05 13:34:27
 * @FilePath: \huijiashenghuo_niapp\src\utils\Ezrequest.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getEnvBaseUrl } from '@/utils'
const baseUrl = getEnvBaseUrl()
import ezTimeUtil from './ezTimeUtil'
import mackData from './mackData'

export async function EzPost(param, backpage, backtype) {
  console.log('param=' + JSON.stringify(param))
  if ('GET' == param.method) {
    param.method = 'GET'
  } else {
    param.method = 'POST'
  }
  var _self = this,
    isJson = param.isJson || false,
    url = baseUrl + param.url,
    method = param.method,
    header = {},
    data = param.data || {},
    token = ''

  var _cfg = param.cfg || {}

  //拼接完整请求地址
  var requestUrl = url

  var timestamp = Date.parse(new Date()) //时间戳
  //请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
  // todo 处理header =============
  // token 信息
  header['tenant-id'] = 'wx69fdd1c0ac8f3e90'
  // 请求类型

  if (isJson) {
    header['content-type'] = 'application/json'
    // data = JSON.stringify(data)
  } else {
    header['content-type'] = 'application/x-www-form-urlencoded'
  }

  //用户交互:加载圈
  if (_cfg.showLoading) {
    uni.showLoading({
      title: _cfg.loadText || '加载中...',
    })
  }

  // console.log("网络请求start");
  //网络请求_
  let err = true
  let res = {}

  if (_cfg.isTest == true) {
    err = false
    res = {
      statusCode: 200,
      data: {
        code: 0,
        data: mackData[url],
      },
    }
  } else {
    // 发起网络请求
    try {
      res = await uni.request({
        url: requestUrl,
        method: method,
        header: header,
        data: data,
      })
    } catch (e) {
      console.log('接口调用失败==========')
      console.error(e)
    }
  }

  if (_cfg.showLoading) {
    if (_cfg.sleep) {
      await ezTimeUtil.sleep(_cfg.sleep)
    }
    uni.hideLoading()
  }
  if (res.statusCode != 200) {
    return {
      code: 101,
      data: null,
      message: '请求错误',
    }
  }
  return res.data
}

export function ApiResult(res, resCfg) {
  console.log('ApiResult res=' + JSON.stringify(res))
  let reuslt = res.code == '000'
  let data = {}
  resCfg = resCfg || {
    showErr: true,
  }
  if (resCfg.showErr != false) {
    resCfg.showErr = true
  }
  data = res.value
  if (resCfg && reuslt) {
    if (resCfg.type == 'p2l') {
      data = res.value.list
    } else {
      data = res.value
    }
  }
  if (resCfg && res.code == '102' && res.code == resCfg.code) {
    data = resCfg.code
    resCfg.showErr = false
  }

  console.log('ApiResult data=' + JSON.stringify(data))
  if (res.code === '500') {
    //accessToken 过期，重新登录
    uni.switchTab({
      url: '/pages/mine/index',
    })
    return
  }
  // todo 失败提示
  let _detErrText = res.message || '操作失败!'
  console.log(res)
  if (!reuslt && resCfg.showErr) {
    uni.showToast({
      icon: 'none',
      title: resCfg.errText || _detErrText,
      duration: 1200,
    })
  }
  // todo 成功提示
  let _suErrText = resCfg.sucText || '操作成功'
  if (reuslt && resCfg.showSuc) {
    uni.showToast({
      title: _suErrText,
      duration: 1200,
    })
  }
  let _netStatus = {
    code: res.code ?? '-1',
    message: res.message ?? '',
  }

  return [reuslt, data, _netStatus]
}
