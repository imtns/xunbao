<template>
  <view class="btn" :style="{ width: width, height: height, 'box-shadow': shadow ? '0px 5rpx 18rpx 16rpx rgba(119, 158, 204, 0.15)' : '' }">
    <u-button
      :openType="openType"
      type="success"
      :custom-style="{ width: width, height: height, 'font-size': `${fontSize}rpx` }"
      :hairline="plain"
      :plain="plain"
      :color="btn_bg"
      shape="circle"
      @click="click"
    >
      <slot>{{ btn_text }}</slot>
    </u-button>
  </view>
</template>

<script>
export default {
  name: 'dy-button',
  props: {
    fontSize: { 
      type: [String, Number],
      default: '32'
    },
    openType: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    btn_text: {
      type: String,
      default: ''
    },
    btn_bg: {
      type: String,
      default: '#000000'
    },
    width: {
      type: String,
      default: '690rpx'
    },
    height: {
      type: String,
      default: '94rpx'
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    click() {
      console.log('click')
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  border-radius: 50rpx;
}
</style>
