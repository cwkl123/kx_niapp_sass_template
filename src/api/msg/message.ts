// src/api/message.ts
import { http } from '@/utils/http'

/**
 * 消息相关API接口
 */
export const msgApi = {
  /**
   * 获取系统消息
   */
  async getSystemMsg() {
    return http.get('/wechat/system/message')
  },

  /**
   * 标记所有消息为已读
   */
  async getMsgReadAll() {
    return http.post('/wechat/user/messages/readAll', null, {
      sleep: 200,
      showLoading: true,
      loadingText: '',
    })
  },

  /**
   * 获取未读消息数量
   */
  async getMsgCount() {
    return http.get('/wechat/user/messages/unreadMessageNumber')
  },

  /**
   * 获取消息列表（分页）
   * @param param 分页参数 { page, pageSize }
   */
  async getMsgList(param: { page: number; pageSize: number }) {
    return http.get('/wechat/user/messages', {
      params: param,
    })
  },
}
