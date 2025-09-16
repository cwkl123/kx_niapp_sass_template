/*
 * @Author: cwkl123 1297224582@qq.com
 * @Date: 2025-06-25 15:59:48
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-07-15 15:22:44
 * @FilePath: \huijiashenghuo_uniapp\src\store\modules\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { doLogin, register, getWxUserInfo } from '@/service/base/loginApi'

const loginInfoState = {
  isBind: false,
  isLogin: false,
  token: null,
  wxUserData: null,
  loginData: null,
}

export const useLoginStore = defineStore(
  'loginInfo',
  () => {
    const userStore = useUserStore()
    const loginInfo = ref({ ...loginInfoState })
    const toLogin = async (wxCode, wxUserData) => {
      loginInfo.value.wxUserData = wxUserData
      const { code, value } = await doLogin({ code: wxCode })
      if (code === '000' && wxUserData !== null) {
        loginInfo.value.loginData = value
        const userInfo = {
          nickName: wxUserData.userInfo.nickName,
          avatar: wxUserData.userInfo.avatarUrl,
        }
        loginInfo.value.isBind = true
        userStore.setUserInfo(userInfo)
        return true
      } else {
        uni.showToast({
          title: '登陆失败',
          icon: 'none',
        })
        loginInfo.value.isBind = false
        return false
      }
    }

    // 二次登录
    const regLogin = async (phone) => {
      const registerInfo = {
        rawData: loginInfo.value.wxUserData.rawData,
        openId: loginInfo.value.loginData.openId,
        unionId: loginInfo.value.loginData.unionId,
        phone: phone,
        groupType: 1, //1小程序 2公众号
      }
      try {
        const { code: registerCode, value: registerValue } = await register(registerInfo)
        if (registerCode === '000' && registerValue != null) {
          loginInfo.value.token = registerValue.token
          const { code, value } = await getWxUserInfo()
          if (code === '000' && value != null) {
            loginInfo.value.isLogin = true
            loginInfo.value.isBind = false
            userStore.setUserInfo(value)
            return true
          }
        }
      } catch (error) {
        console.log(error)
        uni.showToast({
          title: '绑定手机号失败',
          icon: 'none',
        })
        loginInfo.value.isBind = true
        return false
      }
    }

    const loginOut = () => {
      loginInfo.value.isLogin = false
      loginInfo.value.token = null
      loginInfo.value.loginData = null
      loginInfo.value.wxUserData = null
      userStore.cleanUserInfo()
    }

    return {
      loginInfo,
      toLogin,
      regLogin,
      loginOut,
    }
  },
  {
    persist: true,
  },
)
