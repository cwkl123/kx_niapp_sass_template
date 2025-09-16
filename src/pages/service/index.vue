<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '服务',
  },
}
</route>
<template>
  <view class="container">
    <z-paging ref="paging" refresher-only @onRefresh="onRefresh">
      <!-- 顶部导航栏 -->
      <view class="header" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
        <view :style="{ backgroundColor: themeColor }" class="header-bg"></view>
        <view class="search-area" @click="handleSearchClick">
          <image src="/static/images/service/search.png" class="search-icon" mode="aspectFit" />
          <view class="search-input">请输入关键词搜索</view>
          <button class="search-btn">搜索</button>
        </view>
        <view class="header-local flex center">
          <image :src="getImage(logoImg)" style="width: 260rpx; height: 64rpx"></image>
        </view>
        <image src="/static/images/service/cow.png" class="header-cow" mode="aspectFit" />
      </view>

      <!-- 服务详情内容 -->
      <view class="service-container" :style="tabbarStyle">
        <!-- 左侧分类导航 -->
        <view class="left-categories">
          <scroll-view scroll-y :show-scrollbar="false" :scroll-into-view="scrollIntoViewId">
            <view
              v-for="(category, index) in leftList"
              :key="category.cateId"
              class="category-item"
              :class="{ active: activeCategory === category.cateId }"
              :style="
                activeCategory === category.cateId
                  ? { color: themeColor, borderLeftColor: themeColor }
                  : null
              "
              @click="selectCategory(category.cateId, index)"
              :id="`cateId-${category.cateId}`"
            >
              {{ category.cateName }}
            </view>
          </scroll-view>
        </view>

        <view class="right-services">
          <scroll-view scroll-y :show-scrollbar="false">
            <!-- 空状态 -->
            <view class="empty-state" v-if="filteredServices.length === 0">
              <image src="/static/images/mine/order/noneOrder.png" class="empty-image" />
              <text class="empty-text">暂无服务项目</text>
            </view>

            <!-- 服务项目列表 -->
            <view
              class="service-section"
              v-for="(service, index) in filteredServices"
              :key="service.cateId"
            >
              <view class="section-title">{{ service.cateName }}</view>
              <view class="service-grid">
                <view
                  class="service-item"
                  v-for="item in service.serviceItems"
                  :key="item.id"
                  @click="navigateToService(item)"
                >
                  <image :src="getImage(item.url)" class="service-icon" mode="aspectFit" />
                  <text class="service-name">{{ item.serviceTitle }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaInsets } from '@/utils'
import { useLoginStore, useUserStore, useConfigStore } from '@/store'
import { get_classify_list_filter, get_service_item_list } from '@/service/serve/serveApi'

const systemInfo = uni.getSystemInfoSync()
const isIOS = systemInfo.platform === 'ios'
let logoImg = inject('logoImg')
// 常量定义（可根据实际情况调整）
const HEADER_HEIGHT = 130 // 顶部区域高度
const TABBAR_HEIGHT = isIOS ? 100 : 74 // TabBar 高度

// 动态计算内容区域高度
const tabbarStyle = `height: calc(100vh - ${HEADER_HEIGHT}px - ${TABBAR_HEIGHT}px);`
const { safeAreaInsets } = getSafeAreaInsets()
const loginInfoStore = useLoginStore()
const userStore = useUserStore()
const configStore = useConfigStore()

const image = ref(true)
const activeCategory = ref('property') // 当前激活的分类和标签
const scrollIntoViewId = ref('')
const paging = ref(null)
let themeColor = inject('themeColor')

// 分类数据（数据库返回）
const leftList = ref([])
const filteredServices = ref([])
// 计算获取当前分类下的服务项
watchEffect(async () => {
  console.log(activeCategory.value)
  const { code, value } = await get_service_item_list({
    search: activeCategory.value,
    type: 1,
    uId: loginInfoStore.loginInfo.isLogin ? userStore.userInfo.uId : 0,
  })
  console.log('服务项数据:', value)
  if (code === '000') {
    filteredServices.value = value.filter((item) => {
      return item.serviceItems.length > 0
    })
    console.log('服务项数据:', filteredServices.value)
  } else {
    filteredServices.value = []
  }
})
// 选择分类
const selectCategory = (categoryId, index) => {
  if (categoryId) {
    uni.setStorageSync('cateID_key', categoryId)
    activeCategory.value = categoryId
  }
}
const getImage = (url) => {
  return import.meta.env.VITE_UPLOAD_BASEURL + url
}
const handleSearchClick = () => {
  uni.navigateTo({
    url: '/pages-sub/home/searchService', // 替换为你实际的搜索页面路径
  })
}
// 导航到服务详情
const navigateToService = (service) => {
  // 检查登录状态
  // if (!checkLogin()) {
  //   return
  // }
  if (service.serviceId == 487) {
    uni.navigateToMiniProgram({
      appId: 'wx76c98516a2e8ef44',
      path: 'pages/home/home',
    })
  } else {
    uni.navigateTo({
      url: `/pages-sub/service/serviceInfo?data=${JSON.stringify({
        serveItemId: service.serviceId,
        orderId: '',
      })}`,
    })
  }
}
onShow(async () => {
  configStore.fetchConfig()
  await getServeLeftClass()
  getCateKey()
})
const getCateKey = () => {
  const keyId = uni.getStorageSync('cateID_key')
  if (!keyId) {
    activeCategory.value = leftList.value[0].cateId
  } else {
    const item = leftList.value.find((i) => i.cateId === keyId)
    activeCategory.value = item ? keyId : leftList.value[0].cateId
  }
  uni.setStorageSync('cateID_key', activeCategory.value)
  scrollIntoViewId.value = `cateId-${activeCategory.value}`
}

const getServeLeftClass = async () => {
  let { code, value } = await get_classify_list_filter({
    uId: loginInfoStore.loginInfo.isLogin ? userStore.userInfo.uId : 0,
  })
  if (code == '000') {
    leftList.value = [...value, {}]
  }
}
const onRefresh = async () => {
  try {
    // 调用数据获取API
    await getServeLeftClass()
    getCateKey()
    uni.showToast({
      title: '加载成功',
      duration: 800,
    })
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    paging.value?.complete()
  }
}
// 跳转到登录页
// const goToLogin = () => {
//   showLoginModal.value = false
//   tabbarStore.setCurIdx(4)
//   uni.switchTab({
//     url: '/pages/mine/index',
//   })
// }
// 检查登录状态的工具方法
// const checkLogin = () => {
//   if (!loginInfoStore.loginInfo.isLogin) {
//     showLoginModal.value = true
//     return false
//   }
//   return true
// }
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  position: relative;
  height: 220rpx; // 整体高度
  padding: 0 30rpx;
  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30vh;
    z-index: 1;
  }
}

.search-area {
  position: absolute;
  bottom: 3px; // 固定在 header 最下边
  left: 30rpx;
  right: 250rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 35rpx;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 5px 0 10px;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  .search-icon {
    width: 28rpx;
    height: 28rpx;
    margin-right: 10rpx;
  }

  .search-input {
    flex: 1;
    font-size: 28rpx;
    color: #b2b2b2;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-btn {
    background: linear-gradient(to right, #8ed7ff, #3964ff);
    color: white;
    border-radius: 30rpx;
    font-size: 12px;
    padding: 0 30rpx;
    height: 40rpx;
    line-height: 60rpx;
    margin-left: 5rpx;
    border: none;
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
  }
}
.header-local {
  position: absolute;
  bottom: 30rpx; // 位于搜索框上方一点
  left: 40rpx;
  width: 250rpx;
  height: 150rpx;
  z-index: 3;
}

.header-cow {
  position: absolute;
  bottom: -90rpx; // 右下角
  right: 0rpx;
  width: 270rpx; /* 增大宽度 */
  height: 270rpx; /* 增大高度 */
  z-index: 3;
  /* 保持图片比例 */
  object-fit: contain;
  z-index: 3;
}
.service-container {
  display: flex;
  width: 100%;
  position: relative;
  top: 10rpx; // 向上移动覆盖背景
  z-index: 10;
  background-color: white;
  overflow: hidden;
}

.left-categories {
  width: 180rpx;
  background-color: rgba(142, 195, 239, 0.18);
  height: 100%;
  overflow: auto;

  .category-item {
    padding: 30rpx 20rpx;
    font-size: 28rpx;
    text-align: center;
    color: #333;
    border-left: 6rpx solid transparent;

    &.active {
      background-color: #fff;
      font-weight: bold;
    }
  }
  .category-item:last-child {
    margin-bottom: 20px;
  }
}

.right-services {
  flex: 1;
  height: 100%; // 加上这个才能生效 scroll-y
  position: relative;

  .empty-state {
    position: absolute; // 改为绝对定位
    top: 50%; // 垂直居中
    left: 50%; // 水平居中
    transform: translate(-50%, -50%); // 精确居中
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; // 确保宽度足够

    .empty-image {
      width: 500rpx; // 调整图片大小
      height: 400rpx;
    }

    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .section-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin: 20rpx 0;
    padding-left: 20rpx;
  }

  .service-grid {
    display: flex;
    flex-wrap: wrap;

    .service-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0;

      .service-icon {
        width: 94rpx;
        height: 94rpx;
      }

      .service-name {
        margin-top: 10rpx;
        font-size: 24rpx;
        color: #666;
        text-align: center;
      }
    }
    .service-item:last-child {
      margin-bottom: 20px;
    }
  }
}
.login-popup {
  width: 80vw;
  background: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;

  .popup-content {
    padding: 30rpx;
    text-align: center;

    .popup-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 16rpx;
    }

    .popup-message {
      font-size: 28rpx;
      color: #666666;
    }
  }

  .popup-footer {
    display: flex;
    height: 88rpx;
    border-top: 1rpx solid #f0f0f0;

    .popup-btn {
      flex: 1;
      height: 100%;
      line-height: 88rpx;
      font-size: 28rpx;
      background: transparent;
      border-radius: 0;
      margin: 0;
      padding: 0;

      &::after {
        border: none;
      }

      &.cancel-btn {
        color: #999999;
      }

      &.confirm-btn {
        color: #2f72f6;
        font-weight: bold;
      }
    }

    .divider {
      width: 1rpx;
      height: 100%;
      background-color: #dedede;
    }
  }
}
</style>
