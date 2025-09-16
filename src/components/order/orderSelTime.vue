<template>
  <view class="container">
    <!-- 日期选择区域 -->
    <view class="date-container">
      <view class="date-list">
        <view
          v-for="(item, index) in dateList"
          :key="item.day"
          @click="selectDate(item, index)"
          class="date-item"
          :class="{ active: activeDateIndex === index }"
        >
          <text class="week-day">{{ getWeekName(item.week) }}</text>
          <text class="date">{{ item.date }}</text>
          <view v-if="activeDateIndex === index" class="indicator"></view>
        </view>
      </view>
    </view>

    <!-- 时间选择区域 -->
    <view class="time-container">
      <scroll-view scroll-y>
        <view class="time-list">
          <view
            v-for="(item, index) in timeList"
            :key="index"
            @click="selectTime(item, index)"
            class="time-item"
            :class="{
              available: item.num > 0,
              selected: activeTimeIndex === index,
            }"
          >
            {{ formatTime(item.times) }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部确认栏 -->
    <view class="footer">
      <view class="selected-time">
        预约时间: {{ selectedDate.date }}日 {{ formatTime(selectedTime.times) }}
      </view>
      <button class="confirm-btn" @click="confirmSelection">确定</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrderHourTimes, getOrderWeekTimes } from '@/service/order/orderApi'
const props = defineProps({
  serviceId: {
    type: Number,
    default: '',
  },
  addressId: {
    type: Number,
    default: '',
  },
})
//  定义weekList常量
const weekList = ref(['周日', '周一', '周二', '周三', '周四', '周五', '周六'])

const dateList = ref([])
const timeList = ref([])
const activeDateIndex = ref(0)
const activeTimeIndex = ref(-1)
const selectedDate = computed(() => {
  return dateList.value[activeDateIndex.value] || {}
})

const selectedTime = computed(() => {
  return timeList.value[activeTimeIndex.value] || { str_time: '' }
})
const initDateList = async () => {
  console.log('props.serviceId:', props.serviceId)
  console.log('props.addressId:', props.addressId)
  try {
    const { code, value } = await getOrderWeekTimes({
      serviceId: props.serviceId,
    })
    console.log('initDateList', value)
    if (code === '000') {
      dateList.value = value

      // 默认加载第一个日期的可用时间
      if (dateList.value.length > 0) {
        await loadTimeSlots(dateList.value[0].day)
      }
    }
  } catch (error) {
    console.error('获取日期列表失败:', error)
    uni.showToast({
      title: '获取日期列表失败',
      icon: 'none',
    })
  }
}
const loadTimeSlots = async (day) => {
  try {
    const { code, value } = await getOrderHourTimes({
      serviceId: props.serviceId,
      day: day,
      addressId: props.addressId,
    })

    if (code === '000') {
      let times = value.map((item) => ({
        times: item.str_time,
        num: parseInt(item.num),
        serviceFee: item.serviceFee,
      }))
      // 新增：如果是今天则过滤时间段
      const todayStr = new Date().toISOString().split('T')[0]
      if (day === todayStr) {
        times = filterTimesForToday(times)
      }

      timeList.value = times
    }
  } catch (error) {
    console.error('获取时间段失败:', error)
    uni.showToast({
      title: '获取时间段失败',
      icon: 'none',
    })
  }
}
// 7. 日期选择方法
const selectDate = async (item, index) => {
  activeDateIndex.value = index
  activeTimeIndex.value = -1 // 重置时间选择
  await loadTimeSlots(item.day) // 加载新日期的时间段
}

// 8. 时间选择方法
const selectTime = (item, index) => {
  if (item.num <= 0) {
    uni.showToast({
      title: '该时间段不可预约',
      icon: 'none',
    })
    return
  }
  activeTimeIndex.value = index
}
// 9. 格式化时间显示
const formatTime = (timeStr) => {
  return timeStr?.split(' - ')[0] || ''
}

// 10. 确认选择
const confirmSelection = () => {
  if (activeTimeIndex.value === -1) {
    uni.showToast({
      title: '请选择预约时间',
      icon: 'none',
    })
    return
  }
  const [startTime, endTime] = selectedTime.value.times.split(' - ')
  const formattedAppointTime = selectedTime.value.times.replace(' - ', '~')
  const selectedData = {
    day: selectedDate.value.date, //月.日
    startTime: startTime,
    appointDate: selectedDate.value.day, //年-月-日
    appointTime: formattedAppointTime, //8:00~8：00
    serviceFee: selectedTime.value.serviceFee, //服务费
    serviceStartTime: `${selectedDate.value.day} ${startTime}:00`,
    serviceEndTime: `${selectedDate.value.day} ${endTime}:00`,
  }

  // 这里可以触发父组件的事件或进行其他操作
  console.log('选择的预约时间:', selectedData)
  uni.showToast({
    title: '预约时间已选择',
    icon: 'success',
  })

  // 返回选择结果给父组件
  emit('selected', selectedData)
}

const filterTimesForToday = (times, today) => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + 60

  return times.filter((item) => {
    const [start] = item.times.split(' - ')
    const [hour, minute] = start.split(':').map(Number)
    const slotMinutes = hour * 60 + minute

    // 只保留晚于当前时间的时段
    return slotMinutes > currentMinutes
  })
}

defineExpose({
  initDateList,
})

const getWeekName = (weekIndex) => {
  return weekList.value[weekIndex] || '未知'
}
const emit = defineEmits(['selected'])
</script>

<style scoped>
.container {
  background-color: #f8f9f8;
  padding: 10px;
  width: 100vw; /* 确保宽度占满屏幕 */
  box-sizing: border-box;
}
/* 新的日期容器样式 */
.date-container {
  width: 100%;
  overflow: hidden; /* 禁止滚动 */
}
.date-list {
  display: flex;
  flex-wrap: nowrap; /* 禁止换行 */
  justify-content: space-around; /* 均匀分布 */
  width: 100%;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 80px;
  padding: 8px 0;
}

.week-day {
  font-size: 16px;
  font-weight: 500;
}

.date {
  font-size: 12px;
  margin-top: 4px;
}

.time-container {
  height: 220px;
  margin: 12px 0;
}

.time-list {
  background-color: white;
  border-radius: 8px;
}

.time-item {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f2f5;
}

.footer {
  display: flex;
  background-color: white;
  border-radius: 20px;
  padding: 12px 16px;
  margin-top: 10px;

  align-items: center; /* 添加此行使内容垂直居中 */
}

.selected-time {
  flex: 1;
  font-size: 16px;
}

.confirm-btn {
  width: 100px;
  /* height: 40px; */
  background: linear-gradient(223deg, #2f72f6 0%, #6c9dff 100%);
  color: white;
  border-radius: 20px;
  border: none;
  margin: 10rpx;
  display: flex; /* 添加flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 5px; /* 移除默认padding */
  line-height: normal; /* 重置行高 */
}
.date-item.active {
  background-color: #f0f7ff; /* 浅蓝色背景 */
  border-radius: 8px;
}

.date-item.active .week-day {
  color: #2f72f6; /* 蓝色文字 */
  font-weight: bold;
}

.date-item.active .date {
  color: #2f72f6; /* 蓝色文字 */
}

.date-item .indicator {
  margin-top: 6px;
  height: 3px;
  width: 24px;
  background-color: #2f72f6; /* 蓝色指示条 */
  border-radius: 2px;
}

/* 时间选中状态样式 */
.time-item.selected {
  background-color: #f0f7ff; /* 浅蓝色背景 */
  position: relative;
}

.time-item.selected::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: #2f72f6; /* 左侧蓝色标记 */
}

.time-item.selected {
  color: #2f72f6; /* 蓝色文字 */
  font-weight: bold;
}
</style>
