/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-25 15:59:48
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-19 16:09:05
 * @FilePath: \huijiashenghuo_uniapp\src\store\modules\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { getConfigData } from '@/service/order/orderApi'

export const useConfigStore = defineStore('config', () => {
  // 1. 状态
  const themeColor = ref('#0652d5')
  const isConfigLoaded = ref(false) // 标记配置是否已加载
  const programName = ref('')
  const logo = ref('')
  const logoImg = ref('')
  const defaultServiceImg = ref('')
  provide('programName', programName)
  provide('logo', logo)
  provide('logoImg', logoImg)
  provide('defaultServiceImg', defaultServiceImg)

  // 2. 动作
  const fetchConfig = async () => {
    try {
      const param = {
        name: 'miniProgramHomeConfig',
        tenantId: 'wx69fdd1c0ac8f3e90',
      }
      const res = await getConfigData(param)
      if (res.code === '000' && res.value?.themeColor) {
        programName.value = res.value.programName
        themeColor.value = res.value.themeColor
        logoImg.value = res.value.logoImg
        logo.value = res.value.logo
        defaultServiceImg.value = res.value.defaultServiceImg
        // console.log('Store: 配置加载成功', res.value)
      }
    } catch (error) {
      console.error('Store: 配置加载失败', error)
    } finally {
      isConfigLoaded.value = true // 无论成功失败，都标记为已加载
    }
  }

  // 3. 返回状态和动作
  return {
    themeColor,
    isConfigLoaded,
    fetchConfig,
  }
})
