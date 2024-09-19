<template>
  <view class="waterMark">
    <view class="copyright">{{ copyright || defaultText }}</view>
    <template v-if="shouldShow">
      <view v-for="rowIdx in 3" :key="rowIdx" class="row">
        <view v-for="colIdx in 4" :key="colIdx" class="col">{{ text }}</view>
      </view>
    </template>
  </view>
</template>

<script>
const defaultText = '视频版权归属爱美客全轩课堂所有，未经授权盗取视频者必将追究法律责任'
export default {
  name: 'WaterMark',
  props: {
    // 动画展示的文案
    copyright: {
      type: String,
      default: defaultText
    },
    // 是否无限循环
    infinite: {
      type: Boolean,
      default: false
    },
    // 动画播放次数
    animateTimes: {
      type: Number,
      default: 1
    },
    // 两次动画之间的间隔
    delay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      defaultText: defaultText,
      userInfo: this.lsGet('userInfo'),
      shouldShow: false,
      animate: this.$mp.component.animate,
      count: 0
    }
  },
  computed: {
    /**
     * 水印文案
     */
    text() {
      const { nickName, objectCode } = this.userInfo
      if (nickName && objectCode) {
        return `${nickName} ${objectCode.substr(-10)}`
      } else {
        return '全轩课堂'
      }
    },

    /**
     * 通过字符数除以7*1000毫秒的方式,保证不同字数,动画速度相同
     * 当字数太小的时候会有速度回太快 这样需要给一个最小时间5000ms
     */
    animateDuration() {
      const duration = (Math.ceil(this.getByteLen(this.copyright)) / 7) * 1000 || 10000
      return duration > 5000 ? duration : 5000
    }
  },
  mounted() {
    this.startAnimate()
  },
  methods: {
    /**
     * 中文两个字符,英文数字算一个字符,因为英文数字是半角字符,所以需要计算在内
     */
    getByteLen(val) {
      const copyrightText = val || defaultText
      const len = copyrightText.replace(/[\u0391-\uFFE5]/g, 'aa').length
      return len
    },

    /**
     * left距离为100%到0
     * translate为-100%相当于文案宽度
     * 这样两者叠加是正确的
     */
    startAnimate() {
      this.animate(
        '.copyright',
        [
          {
            left: '100%',
            translate: ['0', '0']
          },
          {
            left: '0',
            translate: ['-100%', '0']
          }
        ],
        this.animateDuration,
        () => {
          // 第一次动画结束就展示水印
          if (!this.shouldShow) {
            this.shouldShow = true
          }
          this.count++
          // 如果是无限循环,则忽略动画次数,按照间隔时间运行下次动画
          if (this.infinite) {
            setTimeout(() => {
              this.startAnimate()
            }, this.delay)
          } else {
            // 如果不是,则根据动画次数来运行
            if (this.animateTimes > this.count) {
              setTimeout(() => {
                this.startAnimate()
              }, this.delay)
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.waterMark {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  /* 无视鼠标事件，相当于鼠标事件透传下去一样 */
  pointer-events: none;

  .row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;
  }

  .col {
    color: rgba(255, 255, 255);
    font-size: 22rpx;
    line-height: 32rpx;
    text-shadow: 2rpx 2rpx 2rpx rgba(0, 0, 0, 50%);
    transform: rotate(-25deg);
    opacity: 0.15;
    pointer-events: none;
  }

  .copyright {
    position: absolute;
    top: 25rpx;
    left: 100%;
    height: 31rpx;
    color: rgba(255, 255, 255, 65%);
    font-size: 24rpx;
    white-space: nowrap;
    text-shadow: 2rpx 2rpx 8rpx rgba(0, 0, 0, 50%);
    transform: translateX(0);
    pointer-events: none;
  }
}
</style>
