/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-07-07 14:28:54
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-08-27 15:55:16
 * @FilePath: \huijiashenghuo_niapp\src\pages-sub\mine\order\constants.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 订单状态Map
export const orderStatusMap = {
  100: '待首付款',
  110: '待接单',
  120: '待服务',
  130: '服务中',
  140: '待支付',
  150: '已完成',
  160: '已取消',
  170: '已取消',
  180: '待售后',
  190: '审核中',
}

export const statusClassMap = {
  110: 'status-waiting',
  120: 'status-serving',
  130: 'status-serving',
  140: 'status-pending',
  150: 'status-review',
  160: 'status-canceled',
  190: 'status-judge',
}
