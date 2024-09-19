<template>
  <view>
    <view class="code" @click="getCode">{{ isThrottle == 2 ? currentTimes + 's' : message[isThrottle] }}</view>
  </view>
</template>

<script>
import { regex_phone } from '@/pages-game/xunbao/js/regexp'
export default {
  name: 'count-down',
  props: {
    phone: {
      //手机号
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      message: ['获取验证码', '发送中'], //提示文字
      totalTimes: 60, //倒计时总秒数
      currentTimes: '-', //当前秒
      isThrottle: 0, //是否成功发送（0为未发送，1为发送中，2为发送成功）
      isThrottleMsg: ['未发送', '验证码正在发送中', '验证码已发送，请注意查看']
    }
  },
  methods: {
    //点击获取验证码按钮
    getCode() {
      this.validator()
        .then(() => {
          this.$emit('sendCode', { code: this.isThrottle, msg: this.isThrottleMsg[this.isThrottle] })
          if (!this.isThrottle) this.isThrottle = 1
        })
        .catch((err) => {
          uni.showToast({ icon: 'none', title: err.msg })
        })
    },
    //更新按钮状态
    updateStatus(status) {
      this.isThrottle = status
      status == 2 && this.countDown()
    },
    //发送成功后倒计时
    countDown() {
      this.currentTimes = this.totalTimes
      let _countDown = setInterval(() => {
        if (this.currentTimes > 1) {
          this.currentTimes = --this.currentTimes
        } else {
          clearInterval(_countDown)
          this.isThrottle = 0
        }
      }, 1000)
    },
    //表单验证
    validator() {
      return new Promise((resolve, reject) => {
        if (!this.phone) {
          reject({ code: 0, msg: '手机号不能为空' })
        }
        if (!regex_phone.test(this.phone)) {
          reject({ code: 0, msg: '手机号不符合规范' })
        }
        resolve({ code: 1, msg: '验证通过' })
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../static/css/base.styl'
.code
  width: 135rpx
  height: h = 44rpx
  line-height: h
  border: 1px solid #707070
  border-radius: 22px
  font-size 18rpx
  color:#616569
  text-align center
  cursor: pointer
</style>
<style scoped>
@media screen and (min-width: 750px) {
  .code {
    width: 100px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}
</style>
