<template>
  <view class="service-container">
    <!-- 左侧分类导航 -->
    <view class="left-categories">
      <scroll-view scroll-y style="height: 100%">
        <view
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          :style="getActiveStyle(category.id)"
          @click="selectCategory(category.id, index)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 右侧服务列表 -->
    <view class="right-services">
      <scroll-view scroll-y style="height: 100%">
        <!-- 空状态 -->
        <view class="empty-state" v-if="filteredServices.length === 0">
          <image src="/static/images/empty.png" class="empty-icon" />
          <text class="empty-text">暂无服务项目</text>
        </view>

        <!-- 服务项目列表 -->
        <view
          class="service-section"
          v-for="(service, index) in filteredServices"
          :key="service.id"
        >
          <view class="section-title">{{ service.name }}</view>
          <view class="service-grid">
            <view
              class="service-item"
              v-for="item in service.items"
              :key="item.id"
              @click="navigateToService(item)"
            >
              <image :src="item.icon" class="service-icon" mode="aspectFit" />
              <text class="service-name">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义props
const props = defineProps({
  // 可以添加props如果需要
})

// 当前激活的分类
const activeCategory = ref('property')

// 分类数据 (写死数据)
const categories = ref([
  { id: 'property', name: '物业+居家' },
  { id: 'elderly', name: '养老' },
  { id: 'longhua', name: '龙华街道' },
  { id: 'housing', name: '房屋维修' },
  { id: 'cleaning', name: '保洁服务' },
  { id: 'appliance', name: '电器维修' },
  { id: 'waterproof', name: '防水疏通' },
  { id: 'air', name: '空气治理' },
  { id: 'installation', name: '安装服务' },
  { id: 'disinfection', name: '清洗消杀' },
  { id: 'exclusive', name: '懂家专属' },
  { id: 'internal', name: '懂家内部' },
  { id: 'carwash', name: '洗车服务' },
])

// 服务数据 (写死数据)
const services = ref([
  // 物业+居家分类下的服务
  {
    id: 'property',
    name: '物业+居家',
    items: [
      { id: 'toilet', name: '马桶维修', icon: '/static/icons/toilet.png' },
      { id: 'shower', name: '花洒维修', icon: '/static/icons/shower.png' },
      { id: 'hose', name: '软管更换', icon: '/static/icons/hose.png' },
      { id: 'cabinet', name: '浴室柜维修', icon: '/static/icons/cabinet.png' },
      { id: 'kitchen', name: '橱柜维修', icon: '/static/icons/kitchen.png' },
      { id: 'drainer', name: '下水器更换', icon: '/static/icons/drainer.png' },
      { id: 'curtain', name: '浴帘架维修', icon: '/static/icons/curtain.png' },
      { id: 'sink', name: '洗手盆维修', icon: '/static/icons/sink.png' },
      { id: 'socket', name: '开关插座维修', icon: '/static/icons/socket.png' },
      { id: 'circuit', name: '电路检修', icon: '/static/icons/circuit.png' },
      { id: 'indoor', name: '室内门维修', icon: '/static/icons/indoor.png' },
      { id: 'security', name: '防盗门维修', icon: '/static/icons/security.png' },
      { id: 'window', name: '窗户维修', icon: '/static/icons/window.png' },
    ],
  },
  // 电器维修分类下的服务
  {
    id: 'appliance',
    name: '电器维修',
    items: [
      { id: 'tv', name: '电视维修', icon: '/static/icons/tv.png' },
      { id: 'fridge', name: '冰箱维修', icon: '/static/icons/fridge.png' },
      { id: 'washer', name: '洗衣机维修', icon: '/static/icons/washer.png' },
      { id: 'ac', name: '空调维修', icon: '/static/icons/ac.png' },
    ],
  },
  // 其他分类可以类似添加...
])

// 计算当前分类下的服务
const filteredServices = computed(() => {
  const category = services.value.find((s) => s.id === activeCategory.value)
  return category ? [category] : []
})

// 选择分类
const selectCategory = (categoryId, index) => {
  activeCategory.value = categoryId
}

// 导航到服务详情
const navigateToService = (service) => {
  uni.navigateTo({
    url: `/pages/service/detail?id=${service.id}`,
  })
}

const getActiveStyle = (id) => {
  if (id == activeCategory.value) {
    return {
      color: themeColor.value,
      borderLeftColor: themeColor.value,
    }
  } else {
    return null
  }
}
</script>

<style lang="scss" scoped>
.service-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.left-categories {
  width: 180rpx;
  background-color: #f5f5f5;

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
}

.right-services {
  flex: 1;
  padding: 20rpx;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;

    .empty-icon {
      width: 200rpx;
      height: 200rpx;
      opacity: 0.5;
    }

    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .section-title {
    font-size: 32rpx;
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
        width: 80rpx;
        height: 80rpx;
      }

      .service-name {
        margin-top: 10rpx;
        font-size: 24rpx;
        color: #666;
        text-align: center;
      }
    }
  }
}
</style>
