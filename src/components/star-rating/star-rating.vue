<template>
  <view class="star-rating">
    <view class="star-rating-box" @touchstart="fun" @touchmove.stop.prevent="fun">
      <image
        v-for="(item, i) in 5"
        class="icon-start"
        :src="(i + 1) | getSrc(score)"
        mode=""
      ></image>
    </view>
    <text class="star-rating-title">{{ title }}</text>
  </view>
</template>

<script>
export default {
  name: 'star-rating',
  data() {
    return {
      iconStartSrcList: [
        '',
        '/static/delivery_icon_star_disable.png',
        '/static/delivery_icon_star_active.png',
      ],
      title: '',
      width: 0,
    }
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    score: {
      type: String,
      default: 0,
    },
  },
  methods: {
    fun(e) {
      let score = Math.ceil(
        ((e.changedTouches[0].pageX - e.currentTarget.offsetLeft) / this.width) * 5,
      )
      if (score >= 5) score = 5
      if (score <= 0) score = 0
      this.$emit('changeScore', {
        name: this.name,
        score,
      })
    },
    getDescBox() {
      uni
        .createSelectorQuery()
        .in(this)
        .select('.star-rating-box')
        .boundingClientRect((result) => {
          if (result) {
            this.width = result.width
          } else {
            this.getDescBox()
          }
        })
        .exec()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDescBox()
    })
  },
  filters: {
    getSrc: function (i, score) {
      if (score == 0) return '/static/star-rating/delivery_icon_star_empty.png'
      if (score < i) return '/static/star-rating/delivery_icon_star_disable.png'
      if (score >= i) return '/static/star-rating/delivery_icon_star_active.png'
    },
  },
  watch: {
    score(val) {
      if (val == 0) this.title = ''
      if (val == 1) this.title = '非常差'
      if (val == 2) this.title = '差'
      if (val == 3) this.title = '一般'
      if (val == 4) this.title = '满意'
      if (val == 5) this.title = '非常满意'
    },
  },
}
</script>

<style lang="scss">
.star-rating {
  display: flex;
  align-items: center;

  .icon-start {
    width: 30rpx;
    height: 30rpx;
    margin: 0 6rpx;
  }

  .star-rating-title {
    padding-left: 30rpx;
    color: #999;
    font-size: 24rpx;
  }
}
</style>
