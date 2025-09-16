/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-27 15:01:22
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-06-27 15:02:04
 * @FilePath: \huijiashenghuo_niapp\src\service\invoice\invoiceApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { http } from '@/utils/http'

export const invoiceIsuse = (param) => {
  return http({
    url: '/wechat/invoice/isuse',
    data: param,
    showLoading: true,
  })
}
