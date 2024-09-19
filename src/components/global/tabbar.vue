<template>
  <view class="tabbar-container">
    <view class="shadow" />
    <view v-if="!hideTab" class="tabbar-container-content" :style="{ paddingBottom: !sysInfo.model.includes('iPhone') ? '20rpx' : `calc(env(safe-area-inset-bottom) - 10rpx)` }">
      <view v-for="(item, index) in tabbarList" :key="index" class="tabbar-item" :class="[item.centerItem ? ' center-item' : '']" @click="changeItem(item)">
        <view class="item-top"><image :src="currentIndex == item.index ? item.selectIcon : item.icon"></image></view>
        <view class="item-bottom" :class="[currentIndex == item.index ? 'item-active' : '']">
          <text>{{ item.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sysInfo } from '@/utils/sysInfo'
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      sysInfo: sysInfo(),
      tabbarList: [
        {
          index: 0,
          path: '/pages/home/index',
          icon: '/static/tabBar/icon-home.png',
          selectIcon: '/static/tabBar/icon-home-active.png',
          text: '首页',
          centerItem: false
        },
        {
          index: 1,
          path: '/pages/product/index',
          icon: '/static/tabBar/icon-pinpai.png',
          selectIcon: '/static/tabBar/icon-pinpai-active.png',
          text: '品牌馆',
          centerItem: false
        },
        {
          index: 2,
          path: '/pages/auth/index',
          icon: '/static/tabBar/icon-scan.png',
          selectIcon: '/static/tabBar/icon-scan.png',
          text: '扫码验真',
          centerItem: true
        },
        {
          index: 3,
          path: '/pages/jifen/index',
          icon: '/static/tabBar/icon-jifen.png',
          selectIcon: '/static/tabBar/icon-jifen-active.png',
          text: '权益中心',
          centerItem: false
        },
        {
          index: 4,
          path: '/pages/center/center',
          icon: '/static/tabBar/icon-my.png',
          selectIcon: '/static/tabBar/icon-my-active.png',
          text: '我的',
          centerItem: false
        }
      ],
      hideTab: false
    }
  },
  computed: {
    currentIndex: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value, this.currentIndex)
      }
    }
  },
  mounted() {
    console.log('sysss', sysInfo())
    uni.$on('hideTab', (show) => {
      this.hideTab = show
    })
  },
  methods: {
    changeItem(item) {
      this.currentIndex = item.index
    }
  }
}
</script>
<style lang="scss">
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  .shadow {
    top: -36rpx;
    z-index: -1;
    width: 750rpx;
    height: 112rpx;
    background: url('data:image/png;base64,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')
      no-repeat;
    background-size: contain;
    filter: blur(10px);
    @include position-center-x;
  }
  &-content {
    display: flex;
    width: 100%;
    /* height: 134rpx; */
    // eslint-disable-next-line max-len
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAACGCAMAAAC1+//mAAAAllBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AJcWoAAAAMXRSTlMAnGP9+fXx46/WyYVy6EQyIQvtWSgQUi0UBnpObNG1qToajGc+uUgWu5bbw5qRXr+iREpBggAABThJREFUeNrs3Yl6ojAUBeBTQUVFFgHFfbeL2+T9X26+TmemtXUh4BLI+R9Bzne9SW4ARPRT1HHaQakQdkF/5bjTLjTlexNnVZCHGbSdToSrmthP65YoHKNVs2bzxTO04a3s15e3iiia1vrJnuAaQntUvJ/nUHXcc3wU3HO/sSxgyfqiMrJDZBIP6kIP5r7noqi6zmxoCB3UBzHSci1T6KS5cVA8fmCVhT5My0Uai6UeBeFA83WCIum2xzpl/Q9juYCszl5oajiIUBBeoym0tO9Ahj/Tq405VN6EKABnpOHf81/mzEdi/arQmzHO/bq1r8smwwnVPpLpbvWtCl8awFwHPqgJ3RnbLhLwNC8LnxXeQ04t+Ajf1T1c5BT9UEmmAczlojW0+O/8oeLggkDnNeoPzQB5023wCf5nBjhrwMJwaJSzjmbBpv0rY4AzeoK+KQ+QH/4ry9U3PZxU4o91xCg3I5MuS/sPRgkntJn2o5or5ILNrv0Io42jJtpNVyRlNKC+aCTomPIER8S6H6WeM1J+SzJ8E3RcNcZPS0Gn1RQfo+nzuOS0JTdlZLUWUJjNZZfU9ozLZc4F5T6U1RB0juniEKcsLjJLUNRG0Hl1HJgLusiwoSRL0CVzfBEX+476tRhKnrCOBV3UivFpKygJYw7l/BKUwBb/xTxgSsjYQTFPgpIox1zYyzMVezcHH11SDfwV8YgiuUoHCuFQX2KVCB9sQclVp1CGw9OS5Gx8GAqSUFfmzcEhN9QkDPFHR5CUDdTgs05J6eDdTJAcRbZnuAUpZ4Z3HPyVVVZiuVoSJKUKAKEgWW8KvA6+w8MSWSGAgSBpYzyaz3up0gYcMErp4dMEbNzlWQC4mZVG2YUkNu4P1wI8QWm8RZDCxl0BHlaCUhnhcSLew05lxQmC1GZ4mBdBadh4FZRSCffE6wnZvbJQpGdOkBSXqUp44XxYBq0QCXEMUglDaPpttvwOA7u8nZBaE/zxsqjFuLOQ9Sm9CvjPmEndx11NuQWZgQne/spm7+OOnjkpk4UBQdmsfZzCtKuGcc9sHeE4pl05jHt29Qh3MWXaGXcF1DzcQchrZ4y7Epoubm7CSW3GXRGVFW6szZFfxl0Zpo2b6nHDmHFXydjHzUS8Ycm4K2YY4kZCbskw7sqp7HATJc41Me4qsmJcXcxGhnFXVLOPK+tzApJxV9d4iiua8sNLjLvSKjauxmbXzrirrtbHVax4sZJxz4O1g8wme0GMez4sFxnDPhIkBOOeF/VdF2kF/Gb/B8Y9P6o9DylMe5z0/YdxzxNjXYogxd+9cBjsE+OeM+Zy4CGh6dzimO8Bxj2HatvAuxj19mzIuv4d455TTasRuD6O6HbavTHb9aMY9zwzqvXRpmEPSkG7HZTmdmNj1aus6acx7kSMOxHjTsS4k54Yd9II404aYdxJI4w7aYRx/93evaQmFARhGK0QjFcvPnCgXh0qqMPe/+byIARDsoL+z1nDN+guCoogcieI3Akid4LInSByJ4jcCSJ3gsidIHIniNwJIneCyJ0gcieI3Akid4LInSByJ4jcCSJ3gsidIHIniNwJIneCyJ0gcieI3Akid4LInSByJ4jcCSJ3gsidIHIniNwJUi7yE+O13hqEeKt5gxDzujcIca+xQYix1g1CrKtWDSKsqrxmSDFW1W3WIMDsVh9ODQKc6tO0bNC95VRftn6rdG+1rW+bXYOu7Tb142CVgK7ND/XkODTo1nCs3/aLBl1a7Ouv82ACT3dmw7n+N10v4+MFOvEYL9epnrwDK3rajXCanfkAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-position: top;
    background-size: 750rpx 134rpx;

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: env(safe-area-inset-bottom);
      background-color: white;
      content: '';
    }
  }
  .tabbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    /* height: 132rpx; */
    margin-top: 16rpx;
    color: #5a6067;
    text-align: center;
    &:nth-child(2) {
      position: relative;
      left: -5rpx;
    }
    &:nth-child(4) {
      position: relative;
      left: 5rpx;
    }
  }
  .item-active {
    color: #366bd5;
    font-weight: bold;
  }
  .center-item {
    position: relative;
    display: block;
  }

  .tabbar-item .item-top {
    width: 60rpx;
    height: 60rpx;
  }
  .center-item .item-top {
    position: absolute;
    top: -88rpx;
    left: 50%;
    flex-shrink: 0;
    width: 156rpx;
    height: 156rpx;
    border-radius: 50%;
    transform: translateX(-50%);
  }
  .tabbar-item .item-top image {
    width: 100%;
    height: 100%;
  }
  .tabbar-item .item-bottom {
    width: 100%;
    margin-top: 5rpx;
    font-size: 24rpx;
  }
  .center-item .item-bottom {
    position: absolute;
    bottom: 0rpx;
  }
  .center-item .item-top image {
    width: 100%;
    height: 100%;
  }
}
</style>
