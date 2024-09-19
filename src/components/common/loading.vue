<template>
  <view v-if="loading" class="loading-wrap">
    <image src="https://udstatic.imeik.com/pcUploads/1653555219217/loading.gif"></image>
  </view>
</template>

<script>
export default {
  name: 'loading',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    // margin: 100rpx 0;
    height: 100%;

    image {
      width: 160rpx;
      height: 160rpx;
    }
  }
</style>
