<template>
  <scroll-view :scroll-y="true" class="vertical-nav">
    <view v-for="(item, index) in options" :key="index" :class="item.code === navId ? 'sidebar active' : 'sidebar'" :data-code="item.code" :data-name="item.name" @click="navClick(item, index)">
      {{ item.name }}
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'verticalNav',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    defaultSelect: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      navId: ''
    }
  },
  watch: {
    defaultSelect: {
      handler(val) {
        this.navId = val
      },
      immediate: true
    }
  },
  methods: {
    navClick(item, index) {
      this.navId = item.code
      this.$emit('click', item, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-nav {
  width: 176rpx;
  padding: 0 0 15rpx;
  overflow-y: scroll;

  .sidebar {
    padding: 36rpx 20rpx 36rpx 24rpx;
    color: rgb(0 0 0 / 45%);

    // height: 40rpx;
    font-size: 24rpx;
    line-height: 40rpx;

    &.active {
      position: relative;
      color: rgb(0 0 0 / 85%);
      font-weight: bold;
      font-size: 26rpx;

      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        width: 8rpx;
        height: 32rpx;
        margin-top: -16rpx;
        background: #356ad3;
        border-radius: 0rpx 4rpx 4rpx 0rpx;
        content: '';
      }
    }
  }
}
</style>
