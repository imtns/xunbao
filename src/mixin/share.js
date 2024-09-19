import { cropShareImage, pageOptionsToQuery, addUserIdWhenShare } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isCallbackRunning: false,
      url: '',
      transparentBar: true,
      // 默认的全局分享内容
      share: {
        title: '欢迎加入爱美客粉丝会员CLUB',
        path: '/pages/home/index', // 全局分享的路径，比如 首页
        imageUrl: 'https://udstatic.imeik.com/pcUploads/1705993409989/WechatIMG1621%20(1).jpg' // 全局分享的图片(可本地可网络)
      }
    }
  },
  computed: {
    ...mapState(['iclubDictoryTree', 'commonConfig', 'isLogin'])
  },
  watch: {
    iclubDictoryTree: {
      handler(c) {
        if (!c) return
        const title = c?.options?.find?.((item) => item.name === 'shareTitle')
        const imageUrl = c?.options?.find?.((item) => item.name === 'shareImage')
        if (title && imageUrl) {
          this.share.title = title.sign
          this.share.imageUrl = imageUrl.sign
        }
        // this.share.title = c.shareTitle
        // this.share.imageUrl = c.shareImage
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    const pages = getCurrentPages().reverse()
    const url = pages[0] && pages[0].route

    this.bus.register(`captchaCallback-${url}`, this, (methodName) => {
      console.log('captchaCallback', methodName)
      this.captchaCallback(methodName)
    })
  },
  beforeDestroy() {
    const pages = getCurrentPages().reverse()
    const url = pages[0] && pages[0].route
    this.bus.unregister(`captchaCallback-${url}`, this)
  },
  onLoad(options) {
    // 默认分享当前页面全路径 - 带query
    this.share.path = this.$mp.page.route + `${pageOptionsToQuery(this.$mp.page.options) ? '?' + pageOptionsToQuery(this.$mp.page.options) : ''}`
  },
  onPageScroll(res) {
    this.transparentBar = res.scrollTop < 40
  },
  methods: {
    captchaCallback(methodName) {
      console.log('reRunCaptchaMethod 1', methodName)
      this[`${methodName}`]?.()
    },
    phoneFilter(val) {
      if (!val) return
      val = val.toString()
      const reg = /^(.{3}).*(.{4})$/
      return val?.replace(reg, '$1****$2')
    },
    go(url, auth = false, isRedirect = false) {
      if (auth && !this.isLogin) {
        this.goLogin()
        return
      }
      if (isRedirect) {
        wx.redirectTo({ url })
      } else {
        wx.navigateTo({
          url
        })
      }
    }
  },
  // 定义全局分享
  // 1.发送给朋友
  onShareAppMessage(res) {
    // 优先取页面里自定义的shareInfo配置
    const info = this.shareInfo || {}
    this.$shareCallBack && this.$shareCallBack()
    this.shareInfo?.callback?.()

    return {
      title: info.title || this.share.title,
      path: addUserIdWhenShare(info.path || this.share.path), // 带上uid
      imageUrl: cropShareImage(info.imageUrl || this.share.imageUrl)
    }
  },
  // 2.分享到朋友圈
  onShareTimeline(res) {
    // 优先取页面里自定义的shareInfo配置
    const info = this.shareInfo || {}
    this.$shareCallBack && this.$shareCallBack('timeline')

    return {
      title: info.title || this.share.title,
      path: addUserIdWhenShare(info.path || this.share.path), // 带上uid
      imageUrl: info.imageUrl || this.share.imageUrl
    }
  }
}
