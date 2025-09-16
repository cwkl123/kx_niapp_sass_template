/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-25 15:59:54
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-06-27 14:51:15
 * @FilePath: \huijiashenghuo_uniapp\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { myInfo, updateUserData, sendCode, editPhone } from '@/service/user/userSelApi'
import { defineStore } from 'pinia'

const userInfoState = {
  petBaseVoList: [],
  userInfo: {},
}

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref({ ...userInfoState })

    // 更新用户信息
    const upDateUser = async () => {
      // const res = await myInfo()
      setUserInfo(res)
    }
    // 清除用户信息
    const cleanUserInfo = () => {
      userInfo.value.userInfo = null
    }
    // 设置用户信息
    const setUserInfo = (val) => {
      userInfo.value = val
    }
    // 设置用户头像
    const setUserAvatar = (avatar) => {
      userInfo.value.avatar = avatar
    }

    const setPetList = (petList) => {
      userInfo.value.petBaseVoList = petList
    }

    return {
      userInfo,
      upDateUser,
      cleanUserInfo,
      setUserInfo,
      setUserAvatar,
    }
  },
  {
    persist: true,
  },
)
