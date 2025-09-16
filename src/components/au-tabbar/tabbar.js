/*
 * @Author: August_rush
 * @Date: 2025-06-18 10:42:23
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-09 14:03:20
 * @FilePath: \huijiashenghuo_uniapp\src\components\au-tabbar\tabbar.js
 * @Description:
 *
 */
import { getMsgCount } from '@/service/msg/msgApi'
// 储存当前tabbar的索引
export const tabbarStore = reactive({
  curIdx: uni.getStorageSync('app-tabbar-index') || 0,
  unreadCount: 0,
  setCurIdx(idx) {
    this.curIdx = idx
    uni.setStorageSync('app-tabbar-index', idx)
  },
  unreadCount: uni.getStorageSync('unreadCount') || 0,
  setUnreadCount(count) {
    this.unreadCount = count
    uni.setStorageSync('unreadCount', count)
  },
})
