<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '新添地址',
    navigationStyle: 'custom',
  },
}
</route>

<template>
  <view class="page-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: themeColor }">
      <view @click="goBack()" class="nav-content">
        <image src="/static/images/mine/back.png" class="back-icon" mode="aspectFit" />
        <text class="nav-title">{{ editTitle }}</text>
      </view>
    </view>

    <view class="content-container">
      <view style="flex: 1">
        <view class="form-container">
          <!-- 服务用户 -->
          <view class="form-item">
            <view class="form-label">服务用户</view>
            <input
              v-model="formData.name"
              placeholder="请输入姓名"
              class="form-input"
              placeholder-class="placeholder-style"
            />
            <view class="line-divider"></view>
          </view>

          <!-- 手机号 -->
          <view class="form-item">
            <view class="form-label">手机号</view>
            <view class="input-group">
              <view class="phone-prefix">+86</view>
              <input
                v-model="formData.phone"
                type="number"
                maxlength="11"
                placeholder="请输入手机号码"
                class="form-input phone-input"
                placeholder-class="placeholder-style"
              />
            </view>
            <view class="line-divider"></view>
          </view>

          <!-- 所在地区 -->
          <view class="form-item">
            <view class="form-label">所在地区</view>
            <view class="region-selector" @click="openAddresRegion">
              <text class="region-text">上海</text>
              <text v-if="!formData.townId" class="selector-hint">请选择</text>
              <text v-else class="selected-region">{{ countyName }} {{ townName }}</text>
              <image class="menu-arrow" :src="'/static/images/mine/index/close-icon.png'" />
            </view>
            <view class="line-divider"></view>
          </view>

          <!-- 详细地址 -->
          <view class="form-item">
            <view class="form-label">详细地址</view>
            <input
              v-model="formData.address"
              placeholder="请输入详细地址"
              class="form-input"
              placeholder-class="placeholder-style"
            />
            <view class="line-divider"></view>
          </view>

          <!-- 默认地址开关 -->
          <view class="checkbox-item" @click="switchDefault">
            <view class="custom-checkbox" :class="{ checked: formData.isDefault === 1 }">
              <wd-icon
                color="#fff"
                name="check"
                size="14px"
                v-if="formData.isDefault === 1"
              ></wd-icon>
            </view>
            <text class="checkbox-label">
              {{ formData.isDefault === 1 ? '已设为默认服务地址' : '设为默认服务地址' }}
            </text>
          </view>

          <!-- 保存按钮 -->
          <button class="save-btn" @click="saveAddress">保存信息</button>
        </view>
      </view>
    </view>

    <!-- 修复后的地区选择弹出层 -->
    <view class="drawer-container" :class="{ 'drawer-visible': showAddresRegion }">
      <view class="drawer-mask" @click="showAddresRegion = false"></view>
      <view class="drawer-content">
        <view class="drawer-header">
          <text class="drawer-title">选择地址</text>
        </view>

        <view class="address-selector">
          <view class="address-header">
            <text class="address-title">请选择所在区域</text>
            <button class="address-confirm" @click="confirmAddress">完成</button>
          </view>

          <view class="selected-tags">
            <view class="tag">上海市</view>
            <view class="tag">{{ selCounty.countyName }}</view>
            <view class="tag">{{ selTown.townName }}</view>
          </view>

          <view class="address-content">
            <scroll-view class="county-list" scroll-y>
              <view
                v-for="(item, key) in regionList"
                :key="key"
                class="county-item"
                :class="{ active: selCounty.countyId === item.countyId }"
                @click="onCountyClick(item)"
              >
                {{ item.countyName }}
              </view>
            </scroll-view>

            <scroll-view class="town-list" scroll-y>
              <view
                v-for="(item, key) in townList"
                :key="key"
                class="town-item"
                :class="{ active: selTown.townId === item.townId }"
                @click="onTownClick(item)"
              >
                {{ item.townName }}
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getlocationTown, getRegion, updateAddress, addAddress } from '@/service/base/addressApi'
import { useUserStore } from '@/store'

let themeColor = inject('themeColor')
const userStore = useUserStore()
// 表单数据
const formData = reactive({
  uId: '',
  name: '',
  phone: '',
  address: '',
  provinceId: '',
  cityId: '',
  countyId: '',
  townId: '',
  isDefault: 0, // 默认地址 0 否 1 是
})
const isEdit = ref(false)
// 地区选择相关
const showAddresRegion = ref(false)
const countyName = ref('')
const townName = ref('')
const editTitle = ref('新添服务地址')

const selProvince = ref({
  provinceId: '310000000000',
  provinceName: '上海市',
})

const selCity = ref({
  cityId: '310100000000',
  cityName: '上海市',
})

const selCounty = ref({
  countyName: '徐汇区',
  countyId: '310104000000',
})
const selTown = ref({
  townName: '天平路街道',
  townId: '310104003000',
  countyId: '310104000000',
})
const regionList = ref<any[]>([])
const townList = ref<any[]>([])

// 打开地区选择器
const openAddresRegion = () => {
  showAddresRegion.value = true
  if (regionList.value.length === 0) {
    getRegionData(formData.countyId, countyName.value, formData.townId, townName.value)
  }
}
const confirmAddress = () => {
  // 验证是否选择了区和街道
  if (!selCounty.value.countyId) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return
  }
  if (!selTown.value.townId) {
    uni.showToast({ title: '请选择所在街道', icon: 'none' })
    return
  }

  // 更新表单数据
  formData.countyId = selCounty.value.countyId
  formData.townId = selTown.value.townId
  formData.provinceId = selProvince.value.provinceId
  formData.cityId = selCity.value.cityId

  // 更新显示名称
  countyName.value = selCounty.value.countyName
  townName.value = selTown.value.townName

  showAddresRegion.value = false
}
//加载地址
const getRegionData = async (countyId, countyName, townId, townName) => {
  console.log(
    'getRegion ，携带参数 ',
    ' countyId:' +
      countyId +
      ' countyName:' +
      countyName +
      ' townId:' +
      townId +
      ' townName:' +
      townName,
  )
  let res = await getRegion()
  if (res.code == '000') {
    console.log('getRegion', res.value)
    regionList.value = res.value || []
    if (countyId) {
      console.log('getRegion ，携带参数  编辑 ')
      selCounty.value.countyId = countyId
      selCounty.value.countyName = countyName
    }

    getLocationTown(countyId, townId, townName)
  }
}
const onCountyClick = (county: any) => {
  selCounty.value.countyId = county.countyId
  selCounty.value.countyName = county.countyName
  getLocationTown(county.countyId)
}
const onTownClick = (town: any) => {
  selTown.value.townId = town.townId
  selTown.value.townName = town.townName
  onRegionChange()
}
const getLocationTown = async (countyId, townId, townName) => {
  try {
    let res = await getlocationTown({
      countyId: selCounty.value.countyId,
    })
    if (res.code == '000') {
      console.log('getlocationTown', res.value)
      townList.value = res.value
      if (countyId) {
        console.log('getLocationTown ，编辑 ')
        selTown.value.townId = townId
        selTown.value.townName = townName
        selTown.value.countyId = countyId
      } else {
        console.log('getLocationTown ，创建 ')
        selTown.value.townId = townList.value[0].townId
        selTown.value.townName = townList.value[0].townName
        selTown.value.countyId = countyId
      }
    }
    onRegionChange()
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('选择地址失败:', error)
  }
}
const onRegionChange = () => {}

// 默认地址状态
const switchDefault = () => {
  formData.isDefault = formData.isDefault === 1 ? 0 : 1
}

// 保存地址
const saveAddress = async () => {
  console.log('保存地址信息:', formData)

  // 示例表单验证
  if (!formData.name) {
    uni.showToast({ title: '请填写服务用户', icon: 'none' })
    return
  }

  if (!formData.phone || !/^1\d{10}$/.test(formData.phone)) {
    uni.showToast({ title: '请填写正确的手机号码', icon: 'none' })
    return
  }

  if (!formData.townId) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return
  }

  if (!formData.address) {
    uni.showToast({ title: '请填写详细地址', icon: 'none' })
    return
  }
  if ('徐汇区' !== countyName.value) {
    uni.showToast({ title: '当前地址不在服务区内 (服务区仅限徐汇区)', icon: 'none' })
    return
  }
  formData.uId = userStore.userInfo.uId
  let res = null
  try {
    if (isEdit.value) {
      res = await updateAddress(formData)
    } else {
      res = await addAddress(formData)
    }
    if (res.code == '000') {
      console.log('res', res)
      // 成功后返回
      uni.navigateBack()
    } else {
      uni.showToast({ title: res.message || '保存失败', icon: 'none' })
    }
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    console.error('保存失败:', error)
  }
}

// 返回逻辑
const goBack = () => {
  uni.navigateBack()
}

// 页面加载钩子
onLoad((options) => {
  if (options.editData) {
    // 编辑模式下初始化表单数据
    const data = JSON.parse(options.editData)
    Object.assign(formData, data)
    if (data.countyName) {
      countyName.value = data.countyName
    }
    if (data.townName) {
      townName.value = data.townName
    }
    editTitle.value = '编辑服务地址'
    isEdit.value = true
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
}

.content-container {
  position: relative;
  z-index: 1;
}

/* 导航栏样式 */
.nav-bar {
  position: relative;
  z-index: 1;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 40px 16px 0px 16px;

  .nav-content {
    display: flex;
    align-items: center;
  }

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

.form-container {
  border-radius: 8px;
  padding: 0 15px;
  margin-top: 10px;
}

.form-item {
  position: relative;
}

.form-label {
  font-size: 15px;
  padding-top: 15px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  font-size: 16px;
  padding: 10px 15px;
  color: #333;
  background-color: transparent;
  border: none;
}

.phone-input {
  flex: 1;
}

.placeholder-style {
  color: #999 !important;
}

.line-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #f0f0f0;
}

.input-group {
  display: flex;
  align-items: center;
}

.phone-prefix {
  font-size: 16px;
  color: #333;
  margin-left: 12px;
}

.region-selector {
  display: flex;
  align-items: center;
  padding: 10px 15px;

  .region-text {
    font-size: 16px;
    color: #333;
  }

  .selector-hint {
    flex: 1;
    text-align: right;
    font-size: 16px;
    color: #999;
    margin-right: 4px;
  }

  .selected-region {
    flex: 1;
    text-align: right;
    font-size: 16px;
    color: #333;
  }
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 20px 0;

  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;

    &.checked {
      background-color: #2f72f6;
      border-color: #2f72f6;
    }
  }

  .checkbox-label {
    font-size: 14px;
    color: #666;
  }
}

.save-btn {
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border-radius: 20px;
  height: 44px;
  line-height: 44px;
  margin: 20px 0;
  border: none;
}

.menu-arrow {
  width: 40rpx;
  height: 40rpx;
  margin-left: 10px;
}

/* 地址选择器样式 */
.address-selector {
  padding: 20rpx;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.address-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.address-confirm {
  background-color: #2f72f6;
  color: white;
  font-size: 28rpx;
  padding: 8rpx 20rpx;
  margin-right: 20px;
  border-radius: 8rpx;
  line-height: normal;

  &::after {
    border: none;
  }
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.tag {
  background-color: #f8f8f9;
  color: #333;
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  margin-right: 15rpx;
  margin-bottom: 10rpx;
}

.address-content {
  display: flex;
  height: 800rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
}

.county-list,
.town-list {
  height: 100%;
}

.county-list {
  width: 40%;
  border-right: 1rpx solid #eee;
}

.town-list {
  width: 60%;
}

.county-item,
.town-item {
  padding: 20rpx;
  font-size: 28rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.county-item.active,
.town-item.active {
  color: #2f72f6;
  background-color: #f0f7ff;
}

/* 新增抽屉样式 */
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  opacity: 0;
  z-index: 1000;

  .drawer-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .drawer-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
}

.drawer-container.drawer-visible {
  opacity: 1;
  visibility: visible;

  .drawer-content {
    transform: translateY(0);
  }
}

.drawer-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.drawer-title {
  font-size: 18px;
  font-weight: bold;
}

.drawer-visible {
  visibility: visible;
  opacity: 1;
}

.drawer-content {
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.drawer-visible .drawer-content {
  transform: translateY(0);
}
</style>
