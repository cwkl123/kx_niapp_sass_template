// src/api/chatApi.ts
import { http } from '@/utils/http'

/**
 * 对话相关API接口
 */
export const chatApi = {
  /**
   * 获取问题列表
   * @param params 查询参数
   */
  async getQuestionsList(params: any) {
    return http.get('/wechat/questions', {
      params,
    })
  },

  /**
   * 获取对话历史记录
   * @param data 请求数据
   */
  async getRecordHistory(data: any) {
    return http.post('/record/history', data)
  },

  /**
   * 结束对话
   * @param dialogId 对话ID
   */
  async finishDialog(dialogId: string | number) {
    return http.post(`/dialog/finish/${dialogId}`)
  },

  /**
   * 获取系统配置
   * @param configType 配置类型
   * @param tagType 标签类型
   */
  async getConfigList(configType: string, tagType: string) {
    return http.get(`/system/getSysConfig/${configType}`, {
      params: { tagType },
    })
  },

  /**
   * 提交对话评价
   * @param data 评价数据
   */
  async submitDialogAppraise(data: any) {
    return http.post('/dialog/appraise', data, {
      sleep: 200,
      showLoading: true,
      loadingText: '正在提交',
    })
  },

  // async requestRecordHistory(param: any) {
  // 		var res = await EzPost({
  // 			url: cfgUrl.serverUrl + '/record/history',
  // 			data: param,
  // 			isJson: true

  // 		})
  // 		return ApiResult(res)
  // return http.post('/dialog/appraise', data, {
  //   sleep: 200,
  //   showLoading: true,
  //   loadingText: '正在提交'
  // })
  // 	},

  async getHostUrl(url: string) {
    // console.log("getHostUrl url=", url)
    if (url == null || url == '' || url == undefined) {
      return '/static/pholder.png'
    }

    if (url.substring(0, '/static/'.length) == '/static/') {
      return url
    }

    if (url.includes('http')) {
      return url
    }

    // console.log("getHostUrl 完整url=",  serverUrl+url)
    return 'http://120.25.165.230:8080' + url
  },
}
