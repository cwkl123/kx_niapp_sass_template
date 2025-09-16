/*
 * @Author: August_rush
 * @Date: 2025-06-26 17:05:36
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-10 17:11:10
 * @FilePath: \huijiashenghuo_uniapp\src\store\index.js
 * @Description:
 *
 */
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

export default store

// 模块统一导出

export * from './modules/login'
export * from './modules/user'
export * from './modules/theme'
