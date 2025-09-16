<!--
 * @Author: August_rush
 * @Date: 2025-06-18 10:39:38
 * @LastEditors: cwkl123 1297224582@qq.com
 * @LastEditTime: 2025-09-16 15:08:06
 * @FilePath: \huijiashenghuo_uniapp\src\components\au-tabbar\au-tabbar.vue
 * @Description: 
 * 
-->
<script setup>
import { tabBarList as _tabBarList } from '@/utils/index'
import { useLoginStore } from '@/store'
import { tabbarStore } from './tabbar'
import { getMsgCount } from '@/service/msg/msgApi'

const loginInfoStore = useLoginStore()
const tabbarList = _tabBarList.map((item) => ({ ...item, path: `/${item.pagePath}` }))
function selectTabBar({ value: index }) {
  if (tabbarList[index].text === 'logo') {
    tabbarStore.setCurIdx(uni.getStorageSync('app-tabbar-index') || 0)
    return
  }
  const url = tabbarList[index].path
  tabbarStore.setCurIdx(index)
  uni.switchTab({ url })
}

// 获取未读消息数
const fetchUnreadCount = async () => {
  try {
    const res = await getMsgCount()
    console.log('消息', res.value.count)
    if (res?.value?.count > 0) {
      tabbarStore.setUnreadCount(res.value.count)
    } else {
      tabbarStore.setUnreadCount(0)
    }
  } catch (e) {
    tabbarStore.setUnreadCount(0)
    console.error('获取未读消息失败', e)
  }
}
const toChat = () => {
  uni.navigateTo({
    url: `/pages-sub/service/chat/chatPage`,
  })
}
onLoad(() => {
  // #ifdef APP-PLUS | H5
  uni.hideTabBar({
    fail: (err) => {
      console.log('隐藏tabbar失败', err)
    },
    success: (res) => {
      console.log('隐藏tabbar成功', res)
    },
  })
  // #endif
})
onShow(() => {
  if (loginInfoStore.loginInfo.isLogin) {
    fetchUnreadCount()
  }
})
const systemInfo = uni.getSystemInfoSync()
const isIOS = systemInfo.platform.toLowerCase() === 'ios'
const tabbarStyle = isIOS
  ? 'padding-top: 12rpx !important; padding-bottom: 12px !important;'
  : 'padding-top: 12rpx !important;'
</script>

<template>
  <wd-tabbar
    :custom-style="tabbarStyle"
    fixed
    v-model="tabbarStore.curIdx"
    bordered
    placeholder
    @change="selectTabBar"
  >
    <template v-for="(item, idx) in tabbarList" :key="item.path">
      <wd-tabbar-item v-if="item.text !== 'logo'" :title="item.text">
        <template #icon>
          <wd-img
            :src="idx === tabbarStore.curIdx ? item.selectedIconPath : item.iconPath"
            height="50rpx"
            width="50rpx"
          />
          <!-- 在消息tab显示角标 -->
          <view v-if="item.text === '消息' && tabbarStore.unreadCount > 0" class="badge">
            {{ tabbarStore.unreadCount > 99 ? '99+' : tabbarStore.unreadCount }}
          </view>
        </template>
      </wd-tabbar-item>
      <wd-tabbar-item v-else>
        <template #icon>
          <image class="logo-img" :src="item.iconPath" @click="toChat" />
        </template>
      </wd-tabbar-item>
    </template>
  </wd-tabbar>
</template>

<style lang="scss" scoped>
.logo-img {
  margin-top: -100rpx;
  height: 180rpx;
  width: 180rpx;
  z-index: 1000;
}
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -10rpx;
  right: -30rpx;
  height: 18px;
  width: 28px;
  border-radius: 20px;
  background: red;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
