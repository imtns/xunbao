<template>
  <view>
    <!-- 自定义顶部栏 -->
    <view class="nav-bar" :style="{ height: navBarHeight + 'px', backgroundColor: transparent ? 'transparent' : iconConfig[theme].bgColor }">
      <view class="halfPage">
        <view v-if="!noIcon" class="arrowContainer" @click="goback">
          <image v-if="theme === 'darkWhite'" class="img" :src="transparent ? iconConfig[theme].back : iconConfig[theme].whiteBack"></image>
          <image v-else-if="haveBackPath()" class="img" :src="iconConfig[theme].back"></image>
          <image v-else class="img" :src="iconConfig[theme].home"></image>
          <div v-if="$slots.extra">
            <slot name="extra" />
          </div>
        </view>
        <view class="title" :style="{ maxWidth: `calc(100vw - ${menuWidth * 2}px - 24px)`, color: iconConfig[theme].textColor }">
          <slot name="title">{{ title }}</slot>
        </view>
      </view>
    </view>
    <x-toast ref="toast" />
    <uni-popup ref="noticePop" :mask-click="false" type="center">
      <div style="position: relative">
        <div class="content-body">
          <div class="notice-content">
            <div class="title">系统提示</div>
            <div class="text">
              {{ systemUpdate }}
            </div>
            <div v-if="systemUpdate && (systemUpdate.includes('账号异常') || systemUpdate.includes('注销'))" class="button" @click="go('/pages/mine/concat/customer')">联系客服</div>
          </div>
        </div>
      </div>
    </uni-popup>
    <!-- <global-login ref="login" /> -->
    <!-- 占位，高度与顶部栏一样 -->
    <view v-if="(!transparent && !noHolder) || extraHolder" :style="{ height: navBarHeight + 'px' }"></view>
  </view>
</template>

<script>
import { ls } from '@/utils/util'
import { mapState } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    homePath: {
      type: String,
      default: '/pages/home/index'
    },
    // light dark
    theme: {
      type: String,
      default: 'light'
    },
    systemTextColor: {
      type: String,
      default: ''
    },
    customEvent: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    noHolder: {
      type: Boolean,
      default: false
    },
    noIcon: {
      type: Boolean,
      default: false
    },
    extraHolder: Boolean,
    customBack: Boolean
  },
  data() {
    return {
      navBarHeight: 0,
      menuRight: 0,
      menuTop: 0,
      menuHeight: 0,
      menuWidth: 0,
      iconConfig: {
        light: {
          bgColor: 'white',
          textColor: 'black',
          back: 'https://udstatic.imeik.com/pcUploads/1662459956976/icon_back_dark.png',
          home: 'https://udstatic.imeik.com/pcUploads/1662459991268/icon_home_dark.png'
        },
        dark: {
          bgColor: 'black',
          textColor: 'white',
          back: 'https://udstatic.imeik.com/pcUploads/1662459976807/icon_back_light.png',
          home: 'https://udstatic.imeik.com/pcUploads/1662460006960/icon_home_light.png'
        },
        darkWhite: {
          bgColor: 'white',
          textColor: 'white',
          whiteBack: 'https://udstatic.imeik.com/pcUploads/1662459956976/icon_back_dark.png',
          back: 'https://udstatic.imeik.com/pcUploads/1662459976807/icon_back_light.png',
          home: 'https://udstatic.imeik.com/pcUploads/1662460006960/icon_home_light.png'
        }
      }
    }
  },
  computed: {
    ...mapState(['systemUpdate', 'userInfo'])
  },

  watch: {
    systemUpdate: {
      handler(value) {
        console.log('系统公告', value)
        if (value) {
          setTimeout(() => {
            // 系统升级弹窗，以下手机白名单不弹窗
            const pages = getCurrentPages().reverse()
            const url = pages[0] && pages[0].$page.fullPath
            const isWhiteList = ['15669015921', '15330210558'].includes(this.userInfo.phone)
            console.log('currentPage', url)
            // 白名单不弹，客服页面不弹
            if (!isWhiteList && !url.includes('customer')) {
              if (value?.includes('账号异常') || value?.includes('注销')) {
                uni.clearLogin() // 清除token
                this.$store.commit('setIsLogin', false)
                this.$store.commit('setTodayCheckIn', false)
              }
              this.popShow = true
              this.$refs.noticePop.open()
            }
          }, 500)
        }
      },
      immediate: true,
      deep: true
    },
    transparent: {
      handler(value) {
        wx.setNavigationBarColor({
          frontColor: value && !this.systemTextColor ? '#ffffff' : '#000000',
          backgroundColor: value && !this.systemTextColor ? '#ffffff' : '#000000',
          animation: {
            duration: 300,
            timingFunc: 'easeIn'
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    // uni.$on('global-login', () => {
    //   this.$refs.login.open()
    // })
    uni.$on('toast', (message) => {
      this.$refs.toast.show({
        message
      })
    })

    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    // 胶囊按钮位置信息
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    console.log(systemInfo)
    console.log(menuButtonInfo)
    // 导航栏高度 = 状态栏高度 + 44(所有机型都适用)
    this.navBarHeight = systemInfo.statusBarHeight + 44
    this.menuRight = systemInfo.screenWidth - menuButtonInfo.right
    this.menuTop = menuButtonInfo.top
    this.menuHeight = menuButtonInfo.height
    this.menuWidth = menuButtonInfo.width
    ls('navBarHeight', this.navBarHeight)
    this.$emit('navBarHeight', this.navBarHeight)
  },

  methods: {
    haveBackPath() {
      const routers = getCurrentPages().map((i) => i.route)
      return routers.length > 1
    },

    goback() {
      if (this.customBack) {
        this.$emit('back')
        return
      }
      if (!this.customEvent) {
        if (this.haveBackPath()) {
          uni.navigateBack()
        } else {
          uni.redirectTo({
            url: this.homePath
          })
          //   uni.switchTab({
          //     url: this.homePath
          //   })
        }
      } else {
        if (this.haveBackPath()) {
          this.$emit('back', () => {
            uni.navigateBack()
          })
        } else {
          this.$emit('back', () => {
            uni.redirectTo({
              url: this.homePath
            })
            // uni.switchTab({
            //   url: this.homePath
            // })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-body {
  width: 622rpx;
  height: 724rpx;
  background: url('https://udstatic.imeik.com/pcUploads/1716433038316/%E8%83%8C%E6%99%AF%402x%20(1).png') no-repeat;
  background-size: contain;
  .notice-content {
    top: 368rpx;
    flex-direction: column;
    width: 550rpx;
    @include position-center-x;

    @include flex-center;
    .title {
      color: #000;
      font-weight: bold;
      font-size: 36rpx;
    }
    .text {
      margin-top: 40rpx;
      color: #29323d;
      font-size: 28rpx;
      line-height: 48rpx;
      text-align: center;
    }
    .button {
      width: 494rpx;
      height: 88rpx;
      margin-top: 35rpx;
      color: white;
      font-size: 28rpx;
      background: #3285f6;
      border-radius: 44rpx;
      @include flex-center;
    }
  }
}
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  padding-top: 10rpx;
  transition: background-color 0.5s;

  .title {
    position: absolute;
    bottom: 0rpx;
    left: 50%;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    transform: translate(-50%, -50%);
  }

  .arrowContainer {
    position: absolute;
    bottom: 6rpx;
    left: 10rpx;
    display: flex;
    align-items: center;
    .img {
      width: 80rpx;
      height: 85rpx;
    }
  }
}
</style>
