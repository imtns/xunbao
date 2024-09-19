<template>
  <t-captcha id="captcha" app-id="193558030" @verify="handlerVerify" @ready="handlerReady" @close="handlerClose" @error="handlerError" />
</template>

<script>
import { ls } from '@/utils/util'

export default {
  data() {
    return {
      methodName: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const pages = getCurrentPages().reverse()
    const url = pages[0] && pages[0].route
    uni.$off(`captcha-${url}`, this.showCaptcha)
    uni.$on(`captcha-${url}`, this.showCaptcha)
  },
  created() {},
  methods: {
    showCaptcha(o) {
      this.methodName = o
      this.selectComponent('#captcha').show()
    },
    // 验证码验证结果回调
    handlerVerify(ev) {
      // 如果使用了 mpvue，ev.detail 需要换成 ev.mp.detail
      if (ev.detail.ret === 0) {
        // 验证成功
        console.log('ticket:', ev.detail.ticket)
        ls('ticket', ev.detail.ticket)
        const pages = getCurrentPages().reverse()
        const url = pages[0] && pages[0].route
        this.bus.post('captchaCallback' + '-' + url, this.methodName)
      } else {
        // 验证失败
        // 请不要在验证失败中调用refresh，验证码内部会进行相应处理
      }
    },
    // 验证码准备就绪
    handlerReady() {
      console.log('验证码准备就绪')
    },
    // 验证码弹框准备关闭
    handlerClose(ev) {
      // 如果使用了 mpvue，ev.detail 需要换成 ev.mp.detail,ret为0是验证完成后自动关闭验证码弹窗，ret为2是用户主动点击了关闭按钮关闭验证码弹窗
      if (ev && ev.detail.ret && ev.detail.ret === 2) {
        console.log('点击了关闭按钮，验证码弹框准备关闭')
        const pages = getCurrentPages().reverse()
        const url = pages[0] && pages[0].route
        uni.$emit(`captcha-${url}-close`)
      } else {
        console.log('验证完成，验证码弹框准备关闭')
      }
    },
    // 验证码出错
    handlerError(ev) {
      console.log(ev.detail.errMsg)
      this.selectComponent('#captcha').refresh()
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    position: relative;
  }
</style>
