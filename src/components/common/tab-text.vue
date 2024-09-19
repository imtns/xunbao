<template>
  <!-- 选项卡 -->
  <view class="tab-text">
    <view class="left" :class="[className, spaceAround ? 'space-around' : '']">
      <view v-for="(item, index) in options" :key="index" :class="[activeTab===item.value ? 'active' : '', fullfilled ? 'tab-item': '']" :data-index="item.value" @click="onTabClick(item)">
        <text>{{ item.label }}</text>
      </view>
    </view>
    <!--extra-->
    <slot slot="extra" class="right" name="extra"></slot>
  </view>
</template>

<script>
export default {
  name: 'tabText',
  props: {
    // {label,value}
    options: {
      type: Array,
      default: () => []
    },
    defaultSelect: {
      type: [Number, String],
      default: ''
    },
    // 选择底部横条颜色 - ''、gold、blue
    className: {
      type: String,
      default: ''
    },
    // tab栏是否间隔相等
    spaceAround: {
      type: Boolean,
      default: false
    },
    // tab是否占满整行
    fullfilled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: ''
    }
  },
  watch: {
    defaultSelect: {
      handler(val) {
        this.activeTab = val
      },
      immediate: true
    }
  },
  methods: {
    onTabClick(item) {
      this.activeTab = item.value
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1rpx solid #eee;
    padding: 16rpx 32rpx 18rpx;

    .left {
      display: flex;
      align-items: flex-end;

      .tab-item {
        width: 50%;
        text-align: center;
      }

      view {
        margin-right: 64rpx;
        color: #5A6067;
        font-size: 30rpx;
        line-height: 42rpx;

        &.active {
          position: relative;
          color: #001226;
          font-weight: 600;
          font-size: 36rpx;
          line-height: 50rpx;

          &::after {

            // border-radius: 4rpx;
            position: absolute;
            top: 74rpx;
            bottom: 0;
            left: 50%;
            width: 32rpx;
            height: 4rpx;
            margin-left: -16rpx;
            background: linear-gradient(270deg, #217AFF 0%, #11B1FF 100%);
            border-radius: 6rpx;
            content: "";
          }
        }
      }

      &.gold {
        view {
          &.active {
            &::after {
              background: #FFDC3C;
            }
          }
        }
      }

      &.blue {
        view {
          &.active {
            &::after {
              top: 63rpx;
              background: linear-gradient(270deg, #217AFF 0%, #11B1FF 100%);
              border-radius: 8rpx;
            }
          }
        }
      }
    }

    .space-around {
      position: relative;
      justify-content: space-around;
      width: 100%;

      view {
        margin-top: 19rpx;
      }
    }

    .right {
      display: flex;
      align-items: center;
      color: #5A6067;
      font-size: 26rpx;

      image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 4rpx;
      }
    }
  }
</style>
