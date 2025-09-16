<template>
  <view style="width: 100%; height: 100%">
    <view
      v-if="ezViewStatex.isLoading"
      style="width: 100%; height: 100%; text-align: center; line-height: 50px"
    >
      <slot name="loading">
        <view style="margin-top: 20px">
          <view style="display: flex; justify-content: center; width: 100%">
            <view style="height: 30px; width: 30px">
              <u-loading mode="circle" size="40"></u-loading>
            </view>
          </view>
          <view style="display: flex; justify-content: center; font-size: 12px; color: #999999">
            正在加载中
          </view>
        </view>
      </slot>
    </view>
    <view v-if="ezViewStatex.isSuc" style="width: 100%; height: 100%">
      <slot></slot>
    </view>
    <view
      v-if="ezViewStatex.isFail"
      style="width: 100%; height: 100%; text-align: center; line-height: 50px"
    >
      <slot name="fail">
        <view style="margin-top: 30px; width: 100%">
          <view style="display: flex; justify-content: center; width: 100%">
            <view style="height: 200rpx; width: 320rpx">
              <image
                :src="$app.getHostUrl(errIcon)"
                mode=" aspectFit  widthFix"
                style="width: 100%; height: 100%"
              ></image>
            </view>
          </view>
          <view style="display: flex; justify-content: center; font-size: 12px; color: #999999">
            加载失败
          </view>
        </view>
      </slot>
    </view>

    <view v-if="ezViewStatex.isNoData" style="width: 100%; height: 100%">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: ['ezViewState', 'noDateText'],
  data() {
    return {
      errIcon: '/static/images/msg',
      ezViewStatex: this.ezViewState,
    }
  },
  watch: {
    ezViewState: {
      handler: function (val, oldval) {
        this.ezViewStatex = val
      },
      deep: true, //对象内部的属性监听，也叫深度监听
    },
  },
  methods: {},
}
</script>

<style></style>
