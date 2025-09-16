<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '服务地址',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="page-container">
    <view
      style="position: absolute; width: 100%; height: 360px; z-index: 0; padding-top: -20px"
      :style="`background: linear-gradient(180deg, ${themeColor} 40%, #2f72f600 80%)`"
    ></view>
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view @click="goBack()">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">服务地址</text>
      </view>
    </view>

    <view style="position: relative; z-index: 1; height: 100%">
      <!-- 搜索区域 -->
      <view class="search-section">
        <view class="search-box">
          <image src="/static/images/mine/search_iocn.png" class="search-iocn" />
          <input
            v-model="searchKeyword"
            placeholder="搜索地址/姓名/电话"
            class="search-input"
            @confirm="searchAddress"
          />
          <button class="search-btn" @click="searchAddress">搜索</button>
        </view>
      </view>

      <scroll-view class="content-container" scroll-y="true">
        <!-- 内容区域 -->
        <view class="content-section">
          <!-- 地址列表区域 -->
          <view v-if="filteredAddressList.length > 0" class="address-list">
            <view
              v-for="(item, index) in filteredAddressList"
              :key="index"
              class="address-card"
              :class="{ 'default-card': item.isDefault == 1 }"
            >
              <view @click="backAddress(item)">
                <view class="card-header">
                  <text class="name">{{ item.name }}</text>
                  <text class="phone">{{ item.phone }}</text>
                </view>

                <view class="address-info">
                  {{ item.provinceName }}
                  <text v-if="item.cityName !== '市辖区'">{{ item.cityName }}</text>
                  {{ item.countyName }} {{ item.townName }} {{ item.address }}
                </view>
              </view>

              <view class="card-footer">
                <view class="default-label" v-if="item.isDefault == 1">
                  <view class="check-mark"></view>
                  <text>已设为默认服务地址</text>
                </view>

                <view class="default-label" v-if="item.isDefault != 1" @click="editAddress(item)">
                  <view class="radio-dot"></view>
                  <text>设为默认服务地址</text>
                </view>

                <view class="actions">
                  <view class="action-btn" @click.stop="editAddress(item)">
                    <image src="/static/images/mine/address/edit.jpg" class="action-icon" />
                    <text>编辑</text>
                  </view>
                  <view class="action-btn" @click.stop="deleteUserAddress(item)">
                    <image src="/static/images/mine/address/delete.jpg" class="action-icon" />
                    <text>删除</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- 空状态 -->
          <view v-else class="empty-state">
            <view class="cow-container">
              <image src="/static/images/mine/address/noneAddress.png" class="empty-image" />
            </view>
            <view class="empty-text">您还未建立任何服务地址，赶紧创建吧!</view>
            <button class="create-btn" @click="toaddAddress">创建新地址</button>
          </view>
        </view>
      </scroll-view>

      <view v-if="filteredAddressList.length > 0" class="bottom-actions">
        <button class="confirm-btn" @click="toaddAddress">创建新地址</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { deleteAddress, getUserAddress } from '@/service/base/addressApi'
import { useUserStore } from '@/store'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

let themeColor = inject('themeColor')
const addressList = ref<any[]>([])
const userStore = useUserStore()
const selectAddress = ref(false)
const searchKeyword = ref('') // 搜索关键词
const filteredAddressList = ref<any[]>([]) // 筛选后的地址列表

const searchAddress = () => {
  if (!searchKeyword.value.trim()) {
    // 关键词为空时显示全部
    filteredAddressList.value = [...addressList.value]
    return
  }

  const keyword = searchKeyword.value.trim().toLowerCase()
  filteredAddressList.value = addressList.value.filter((item) => {
    // 组合搜索字段
    const searchContent = [
      item.name,
      item.phone,
      item.provinceName,
      item.cityName,
      item.countyName,
      item.townName,
      item.address,
    ]
      .join('')
      .toLowerCase()

    return searchContent.includes(keyword)
  })
}
// 加载地址列表
const loadAddressList = async () => {
  try {
    const res = await getUserAddress({
      uId: userStore.userInfo.uId,
    })
    if (res.code == '000') {
      addressList.value = res.value
      filteredAddressList.value = [...res.value]
      console.log('加载地址列表成功', addressList.value)
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none',
    })
    console.error('获取地址数据失败:', error)
  }
}

let eventChannel: UniApp.EventChannel | null = null
onLoad((options) => {
  console.log(options)
  if (options.selectAddress) {
    selectAddress.value = true
    const currentPage = getCurrentPages().pop()
    if (currentPage) {
      eventChannel = currentPage.getOpenerEventChannel()
    }
  }
  loadAddressList()
})
onShow(loadAddressList) // 确保从编辑页面返回时刷新数据

// 编辑地址
const editAddress = (item: any) => {
  uni.navigateTo({
    url: `/pages-sub/mine/address/addAddress?editData=${JSON.stringify(item)}`,
  })
}

// 删除地址
const deleteUserAddress = async (item: any) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除 ${item.name} 的地址吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await deleteAddress({ repairsId: item.repairsId })
          if (res.code === '000') {
            uni.showToast({ title: '删除成功' })
            loadAddressList()
          }
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'none' })
          console.error('删除地址失败:', error)
        }
      }
    },
  })
}

// 跳转到新添地址页面
const toaddAddress = () => {
  uni.navigateTo({
    url: '/pages-sub/mine/address/addAddress',
  })
}
//返回地址
const backAddress = (address) => {
  if (selectAddress.value && eventChannel) {
    eventChannel.emit('onAddressSelected', address)
    uni.navigateBack()
  }
}
// 返回
const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/mine/index',
    })
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f3f4f4;
}

/* 导航栏样式 */
.nav-bar {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 10px 16px;

  .back-icon {
    width: 12px;
    height: 16px;
    margin-bottom: 2px;
    margin-right: 8px;
  }

  .nav-title {
    margin-left: 4px;
    color: white;
    font-size: 18px;
    font-weight: 500;
  }
}

.search-section {
  padding: 20rpx 30rpx;

  .search-box {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 40rpx;
    height: 70rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

    .search-input {
      flex: 1;
      font-size: 28rpx;
      padding: 0 30rpx;
      height: 100%;
      color: #545454;
    }

    .search-iocn {
      width: 45rpx;
      height: 45rpx;
      padding-left: 20rpx;
    }

    .search-btn {
      height: 60rpx;
      min-width: 120rpx;
      line-height: 60rpx;
      font-size: 28rpx;
      color: white;
      background: linear-gradient(90deg, #2a8bff, #4aa9ff);
      margin: 0;
      padding: 0 25rpx;
      border-radius: 30rpx;
      margin-right: 8rpx;
      font-weight: 500;

      &::after {
        border: none;
      }
    }
  }
}
.content-container {
  flex: 1;
  position: relative;
  z-index: 10;
  height: calc(85vh - 110px);
  /* 减去背景图高度 */
  overflow: hidden;
  /* 隐藏超出容器的内容 */
}
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30rpx 20rpx;
  overflow-y: auto;
  /* 允许垂直滚动 */
  height: 100%;

  /* 地址列表样式 */
  .address-list {
    display: flex;
    flex-direction: column;
    gap: 25rpx;
  }

  .address-card {
    background: white;
    border-radius: 20rpx;
    padding: 32rpx 30rpx;
    box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
  }

  .default-card {
    // border-left: 6rpx solid #2f72f6;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 22rpx;

    .name {
      font-size: 28rpx;
      color: #1a1a1a;
    }

    .phone {
      font-size: 28rpx;
      color: #555;
      margin-left: 30rpx;
    }
  }

  .address-info {
    font-size: 28rpx;
    color: #666;
    line-height: 1.5;
    margin-bottom: 32rpx;
    padding-bottom: 28rpx;
    border-bottom: 1rpx dashed #f0f0f0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .default-label {
      display: flex;
      align-items: center;
      color: #2f72f6;
      font-size: 26rpx;
      font-weight: 500;

      /* 蓝色打勾图标 */
      .check-mark {
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        background-color: #2f72f6;
        position: relative;
        margin-right: 10rpx;
        display: inline-block;
        vertical-align: middle;
      }

      .check-mark::after {
        content: '';
        position: absolute;
        top: 8rpx;
        left: 10rpx;
        width: 14rpx;
        height: 6rpx;
        border-left: 2rpx solid white;
        border-bottom: 2rpx solid white;
        transform: rotate(-45deg);
        transform-origin: center;
      }

      /* 未选中状态的空心圆点 */
      .radio-dot {
        width: 26rpx;
        height: 26rpx;
        border-radius: 50%;
        border: 2rpx solid #cccccc;
        position: relative;
        margin-right: 10rpx;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .actions {
      display: flex;
      gap: 36rpx;
    }

    .action-btn {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #888;

      .action-icon {
        width: 32rpx;
        height: 36rpx;
        margin-right: 10rpx;
      }
    }
  }

  /* 空状态样式 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120rpx;

    .cow-container {
      position: relative;
      width: 480rpx;
      height: 450rpx;
      margin-bottom: 50rpx;
    }

    .empty-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 480rpx;
      height: 450rpx;
    }

    .empty-text {
      font-size: 32rpx;
      color: #606266;
      text-align: center;
      margin-bottom: 30rpx;
      line-height: 1.6;
    }

    .create-btn {
      background: linear-gradient(90deg, #87ceff, #4a7bff);
      color: white;
      border-radius: 50rpx;
      width: 50%;
      height: 90rpx;
      line-height: 90rpx;
      font-size: 32rpx;
      font-weight: 500;

      &::after {
        border: none;
      }
    }
  }
}
.bottom-actions {
  display: flex;
  flex-direction: column;
}
.confirm-btn {
  height: 40px;
  width: 90%;
  margin: 2vh 16px;
  background: linear-gradient(90deg, #a8cffe, #3476f6);
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
