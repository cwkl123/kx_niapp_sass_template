<template>
  <view class="container">
    <!-- 列表内容 -->
    <scroll-view
      class="list-container"
      scroll-y
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="onScrollToLower"
    >
      <view class="search-wrapper" style="padding: 10px 15px">
        <input
          class="search-input"
          type="text"
          placeholder="输入姓名或手机号"
          :value="searchText"
          confirm-type="search"
          @input="onInput"
          @confirm="onConfirm"
          clearable
        />

        <view class="cancel-btn" @click="handleCancel">取消</view>
      </view>
      <view v-if="loading" class="loading-text">加载中...</view>

      <view v-else-if="listData && listData.length">
        <view
          class="item-container"
          v-for="(item, index) in listData"
          :key="index"
          @click="toggleSelect(item.repairId)"
        >
          <view class="item-content">
            <view class="item-info">
              <view class="spacer"></view>
              <view class="name">{{ item.name || '未命名师傅' }}</view>
              <view class="spacer"></view>
              <view class="mobile">联系电话: {{ item.mobile || '暂无电话' }}</view>
              <view class="spacer"></view>
            </view>
            <view class="radio-container">
              <radio
                :value="item.repairId"
                color="#2F72F6"
                :checked="item.repairId === checkedId"
              />
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-container">
        <view class="empty-text">暂无师傅数据</view>
      </view>
    </scroll-view>

    <!-- 固定底部按钮 -->
    <view class="footer">
      <view class="confirm-btn" @click="toConfirmPage">确定服务人员</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { selectRepairer } from '@/service/order/orderApi'
const props = defineProps(['showSel', 'selectMaster'])
const searchText = ref('')
const param = ref({ search: '' })
const listData = ref([])
const checkedId = ref('')
const pageNum = ref(1)
const pageSize = 6
const finished = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const systemInfo = uni.getSystemInfoSync()
// 计算滚动区域高度
const scrollHeight = computed(() => {
  return systemInfo.windowHeight - 100 // 减去底部按钮高度
})

const onInput = (e) => {
  searchText.value = e.detail.value
}

const onConfirm = () => {
  param.value.search = searchText.value.trim()
  toReload({ search: param.value.search })
}

const loadDataFun = async (pageInfo, dataParam) => {
  console.log('loadDataFun param:', dataParam)
  const _param = {
    pageNum: pageInfo.pageNo,
    pageSize: pageInfo.pageSize,
  }
  if (dataParam && dataParam.search) {
    _param.searchKeyword = dataParam.search
  }
  return await selectRepairer(_param)
}

const loadData = async (isSearch = false) => {
  console.log(isSearch)
  if (loadingMore.value || finished.value) return
  loadingMore.value = true
  if (isSearch) {
    pageNum.value = 1
    finished.value = false
  }

  const pageInfo = {
    pageNo: pageNum.value,
    pageSize: pageSize,
  }

  const [res] = await Promise.all([loadDataFun(pageInfo, param.value)])

  const newList =
    res?.value?.list?.map((item) => ({
      name: item.name,
      mobile: item.mobile,
      repairId: item.repairId,
    })) || []

  if (pageNum.value === 1) {
    listData.value = newList
  } else {
    listData.value = listData.value.concat(newList)
  }

  finished.value = newList.length < pageSize
  if (!finished.value) pageNum.value += 1

  loadingMore.value = false
}

const toReload = (extraParam = {}) => {
  param.value = { ...param.value, ...extraParam }
  pageNum.value = 1
  finished.value = false
  loadData(true)
}

const onScrollToLower = () => {
  loadData()
}

// 切换选择/取消选择
const toggleSelect = (repairId) => {
  if (checkedId.value === repairId) {
    // 如果点击已选中的师傅，则取消选择
    checkedId.value = ''
  } else {
    // 否则选择新师傅
    checkedId.value = repairId
  }
}

// 组件挂载时自动加载数据
onMounted(() => {
  loadData(true)
})
const selectedMaster = computed(() => {
  return listData.value.find((item) => item.repairId === checkedId.value) || {}
})
const toConfirmPage = () => {
  if (!checkedId.value) {
    uni.showToast({
      title: '请先选择师傅',
      icon: 'none',
    })
    return
  }

  console.log(3333, selectedMaster.value)
  if (selectedMaster) {
    emit('selected', selectedMaster.value)
  }
}
const handleCancel = () => {
  searchText.value = ''
  param.value = {}
  pageNum.value = 1
  finished.value = false
  loadData(true)
  emit('close')
}
const emit = defineEmits(['selected', 'close'])
</script>

<style scoped lang="scss">
.container {
  height: 50vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.search-wrapper {
  padding: 8px 5px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  width: 70%;
  height: 35px;
  padding: 0 15px;
  padding-right: 30px;
  border-radius: 18px;
  background-color: #f5f5f5;
  font-size: 14px;
  color: #333;
}

/* 取消按钮 */
.cancel-btn {
  font-size: 16px;
  padding: 0 5px;
}
.list-view {
  height: calc(60vh - 125px);
  width: 100%;
}

.item-container {
  margin-bottom: 20px;
}

.radio-group {
  width: 100%;
}

.item-content {
  display: flex;
  margin-left: 15px;
  margin-right: 15px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.item-info {
  margin-left: 15px;
  height: 52px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.spacer {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 400;
  color: #373839;
}

.mobile {
  font-weight: 400;
  color: #b6b9bf;
  font-size: 10px;
}

.radio-container {
  flex-shrink: 0;
  width: 56rpx;
  height: 56rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-container {
  margin-top: 30px;
  width: 100%;
}

.empty-image-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.empty-image {
  height: 200rpx;
  width: 320rpx;
}

.empty-text {
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #999999;
  font-weight: 300;
}

.footer {
  height: 40px;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 10px;
  display: flex;
  padding-bottom: 10px;
}

.confirm-btn {
  letter-spacing: 2px;
  line-height: 40px;
  color: white;
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  border-radius: 100px;
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  box-shadow: 0px 3px 9px -2px rgba(55, 120, 248, 0.48);
  border-radius: 20px;
}
</style>
