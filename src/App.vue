<script>
import './utils/init'
import './utils/request' // 初始化云函数

export default {
  data() {
    return {
      loaded: false
    }
  },
  onLaunch() {
    wx.getSystemInfo({
      success(res) {}
    })
  },
  onShow(options) {},
  globalData: {},
  methods: {}
}
</script>

<style lang="scss">
@import './uni.scss';
@import './static/font/iplus/iconfont.css';
// @import './static/font/Gilroy-Bold/index.css';
page {
  min-height: 100vh !important;
  background-color: #f7f7f7 !important;
}

* {
  word-break: break-all;
}

// 去掉烦人的边框
button::after {
  border: 0; // 或者 border: none;
}

@font-face {
  font-weight: bold;
  font-family: Gilroy;
  font-style: normal;
  src: url('https://udstatic.imeik.com/pcUploads/1726634114509/Gilroy-Bold.woff2') format('woff2'), url('https://udstatic.imeik.com/pcUploads/1726634111844/Gilroy-Bold.woff') format('woff'),
    url('https://udstatic.imeik.com/pcUploads/1726634109135/Gilroy-Bold.ttf') format('truetype');
  font-display: swap;
}

@font-face {
  font-family: Gilroy-bold; /* 指定字体名称 */
  src: url('https://udstatic.imeik.com/pcUploads/1704872978082/gilroy-bold-4.otf');
}

@font-face {
  font-family: AlimamaShuHeiTi; /* 指定字体名称 */
  src: url('https://udstatic.imeik.com/iclub/font/AlimamaShuHeiTi.otf');
}

wx-swiper .wx-swiper-dot {
  width: 8rpx;
  height: 8rpx;
}
wx-swiper .wx-swiper-dot-active {
  width: 24rpx;
  height: 8rpx;
  background: #fff;
  border-radius: 4rpx;
}
</style>
