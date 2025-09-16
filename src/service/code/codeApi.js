/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-27 14:23:38
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-06-27 14:23:53
 * @FilePath: \huijiashenghuo_niapp\src\service\code\codeApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'

export const bindInviteUser = (param) => {
  return http({
    method: 'POST',
    url: '/wechat/user/bindInviteUser',
    data: param,
    showLoading: true,
  })
}
