<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '评价',
  },
}
</route>

<template>
  <view class="ez-page" style="background-color: white">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: themeColor }">
      <view class="nav-content" @click="toBack">
        <image src="/static/images/mine/back.png" class="back-icon" />
        <text class="nav-title">评价</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-area">
      <view>
        <!-- 评分区域 -->
        <view class="v-header-box">
          <view class="v-header-title">综合评分</view>
          <view class="rating-container">
            <view v-for="star in 5" :key="star" @click="setRating(star)">
              <image
                :src="star <= evaluation.starValue ? activeStarIcon : emptyStarIcon"
                class="star-icon"
              />
            </view>
          </view>
          <view class="v-header-evaluate">
            {{ evaluation.starValue <= 0 ? '请评分' : evaluation.starValue <= 3 ? '一般' : '好' }}
          </view>
        </view>

        <!-- 标签区域 -->
        <view
          v-if="
            evaluation.starValue > 0 &&
            evaluation.starLowLevelList.length > 0 &&
            evaluation.starHighLevelList.length > 0
          "
          class="tag-container"
        >
          <view
            v-for="(item, index) in evaluation.starValue <= 3
              ? evaluation.starLowLevelList
              : evaluation.starHighLevelList"
            :key="index"
            @click="onEvaluationSelect(item)"
          >
            <view
              class="tag-item"
              :class="{ 'tag-selected': evaluation.selectTagId.indexOf(item.tagId) !== -1 }"
            >
              {{ item.tagName }}
            </view>
          </view>
        </view>

        <!-- 备注区域 -->
        <view class="remark-area">
          <textarea
            v-model="evaluation.msg"
            class="remark-textarea"
            :placeholder="evaluation.hint"
            placeholder-style="color:#999; font-size: 28rpx;"
            maxlength="-1"
          />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-container">
      <view @click="onEvaluationConfirm" class="submit-button">提交评价</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getConfigList } from '@/service/base/sysConfigApi'
import { evaluateOrder } from '@/service/order/orderApi'

let themeColor = inject('themeColor')
const activeStarIcon = '/static/images/mine/order/star-rating/delivery_icon_star_active.png'
const emptyStarIcon = '/static/images/mine/order/star-rating/delivery_icon_star_empty.png'
// 评价数据
const evaluation = ref({
  title: '请对本次服务进行评价',
  hint: '评价备注',
  starValue: 0,
  msg: '',
  starHighLevelList: [] as any[],
  starLowLevelList: [] as any[],
  selectTagId: [] as string[],
  selectTag: [] as any[],
})

// 页面参数
const pageParam = ref<any>({})

// 页面加载
onLoad((options: any) => {
  if (options) {
    try {
      pageParam.value.orderId = options.orderId
      requestConfig()
    } catch (error) {
      console.error('解析参数失败:', error)
    }
  }
})

// 请求配置
const requestConfig = async () => {
  try {
    const res = await getConfigList({
      configType: 3,
      tagType: 1,
    })

    if (res.code == '000' && Array.isArray(res.value)) {
      res.value.forEach((config) => {
        if (config.level <= 3) {
          evaluation.value.starLowLevelList.push(config)
        } else {
          evaluation.value.starHighLevelList.push(config)
        }
      })
    }
  } catch (error) {
    console.error('请求评价配置失败:', error)
    uni.showToast({
      title: '加载配置失败',
      icon: 'none',
    })
  }
}

// 提交评价
const requestEvaluateOrder = async () => {
  // 验证表单
  let errorMsg = ''
  if (evaluation.value.starValue <= 0) {
    errorMsg = '请选择评分'
  } else if (evaluation.value.selectTag.length === 0) {
    errorMsg = '请选择评价标签'
  }

  if (errorMsg) {
    uni.showToast({ title: errorMsg, icon: 'none' })
    return
  }
  try {
    const res = await evaluateOrder({
      orderId: pageParam.value.orderId,
      score: evaluation.value.starValue,
      content: evaluation.value.msg,
      tagsList: evaluation.value.selectTag,
    })

    if (res.code == '000') {
      uni.$emit('evaluate_order', { msg: '评价成功' })
      uni.redirectTo({
        url: `/pages-sub/mine/order/orderList?refresh=true`,
      })
    }
  } catch (error) {
    console.error('提交评价失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
}

// 设置评分
const setRating = (value: number) => {
  // 清空选中的标签
  if (
    (evaluation.value.starValue <= 3 && value > 3) ||
    (evaluation.value.starValue > 3 && value <= 3)
  ) {
    evaluation.value.selectTag = []
    evaluation.value.selectTagId = []
  }

  // 设置新评分值
  evaluation.value.starValue = value
}

// 选择评价标签
const onEvaluationSelect = (item: any) => {
  const index = evaluation.value.selectTagId.indexOf(item.tagId)

  if (index === -1) {
    evaluation.value.selectTagId.push(item.tagId)
    evaluation.value.selectTag.push(item)
  } else {
    evaluation.value.selectTagId.splice(index, 1)
    evaluation.value.selectTag.splice(index, 1)
  }
}

// 确认评价
const onEvaluationConfirm = () => {
  requestEvaluateOrder()
}

// 返回上一页
const toBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.ez-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
}

/* 导航栏样式 - 完全还原 */
.nav-bar {
  height: 44px;
  padding: 40px 16px 0px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;

  .nav-content {
    display: flex;
    align-items: center;
    height: 100%;
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

.content-area {
  flex: 1;
  height: 0;
  background-color: white;
  overflow-y: auto;
}

/* 评分区域 */
.v-header-box {
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 60rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
}

.v-header-title {
  height: 60rpx;
  font-weight: 500;
  color: #47494a;
  font-size: 20rpx;
  line-height: 60rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.rating-container {
  display: flex;
  gap: 30rpx;
  align-items: center;
  flex: 1;
}

.star-icon {
  width: 50rpx;
  height: 50rpx;
}

.v-header-evaluate {
  height: 60rpx;
  font-weight: 500;
  color: #47494a;
  font-size: 20rpx;
  line-height: 60rpx;
  margin-left: 50rpx;
  flex-shrink: 0;
}

/* 标签区域 */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  margin: 16rpx 32rpx 0;
}

.tag-item {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  padding: 16rpx 30rpx;
  background: #f9f9f9;
  border-radius: 72rpx;
  font-weight: 400;
  color: #333333;
  line-height: 50rpx;
  font-size: 28rpx;
  text-align: center;
  letter-spacing: 0px;
  margin-right: 30rpx;
  margin-top: 24rpx;

  &.tag-selected {
    background: #2f72f6;
    color: #ffffff;
  }
}

/* 备注区域 */
.remark-area {
  display: flex;
  background: #f6f7f9;
  border-radius: 20rpx;
  margin: 40rpx 32rpx 0;
}

.remark-textarea {
  height: 180rpx;
  width: 100%;
  font-size: 28rpx;
  color: #333333;
  padding: 22rpx 20rpx;
  line-height: 32rpx;
  box-sizing: border-box;
}

/* 提交按钮区域 */
.submit-container {
  padding: 20px 15px;
  display: flex;
}

.submit-button {
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
