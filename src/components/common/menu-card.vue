<template>
  <view class="menu-card">
    <view class="item-wrap">
      <view v-for="(item, index) in options" :key="index" class="item" @click="menuClick(item)">
        <view class="left">
          <image mode="aspectFill" :src="item.icon"></image>
          <text>{{ item.text }}</text>
        </view>
        <view v-if="item.href" class="right">
          <uni-icons type="right" size="16"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'menuCard',
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    menuClick(item) {
      console.log('menuClick', item)
      if (item.href) {
        uni.navigateTo({
          url: item.href
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-card {
    box-sizing: border-box;
    width: 686rpx;
    height: 314rpx;
    margin: 32rpx auto 0;
    padding: 32rpx;
    background: linear-gradient(178deg, #FFF 0%, #FFF 18%, #FFF 99%);
    border: 2rpx solid rgb(255 255 255 / 80%);
    border-radius: 16rpx;
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgb(41 50 61 / 2%);
    backdrop-filter: blur(5rpx);

    .item-wrap {
      display: flex;
      justify-content: space-around;
      margin-top: 38rpx;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #29323D;
        font-size: 28rpx;

        image {
          width: 64rpx;
          height: 64rpx;
          margin-bottom: 26rpx;
        }
      }
    }
  }
</style>
