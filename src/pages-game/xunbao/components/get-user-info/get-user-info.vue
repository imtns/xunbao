<template>
  <view>
    <button v-if="canIUseGetUserProfile" class="button" @click="getUserProfile">新</button>
    <button v-else open-type="getUserInfo" class="button" bindgetuserinfo="bindgetuserinfo">老</button>
  </view>
</template>

<script>
import login from '@/api/auth'
import tool from '@/pages-game/xunbao/js/tool'
export default {
  name: 'get-user-info',
  data() {
    return {
      canIUseGetUserProfile: true, //是否支持新版本授权
      isClickAuth: false //防止多次点击授权
    }
  },
  created() {
    this.canIUseGetUserProfile = uni.getUserProfile ? true : false
    // console.log(uni.getUserProfile)
  },
  methods: {
    //新版获取用户信息
    getUserProfile(e) {
      if (this.isClickAuth) return
      this.isClickAuth = true
      login.getUserProfile().then((res) => {
        console.log('【新版微信授权回调】', res)
        this.isClickAuth = false
        if (res.code) {
          tool.alert('用户拒绝了授权')
          console.log('【拒绝了授权】')
          this.$emit('getUserInfoCallback', { status: false })
        } else if (!res.code) {
          this.$emit('getUserInfoCallback', { status: true })
          // login.authorize(res.userInfo, this).then(res => {
          //   this.$emit("getUserInfoCallback", { status: true })
          // })
          // tool.loading_h()
        }
      })
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      // wx.getUserProfile({
      //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      //   success: res => {
      //     console.log("新版获取用户信息", res)
      //     login.authorize(res, this).then(res => {
      //       this.$emit("getUserInfoCallback", { status: true })
      //     })
      //     tool.loading_h()
      //   }
      // })
    },
    //获取用户信息
    bindgetuserinfo(e) {
      console.log('【老版微信授权】', e)
      if (!e.detail.userInfo) {
        console.log('【拒绝了授权】')
        this.$emit('getUserInfoCallback', { status: false })
        return
      }
      login.authorize(e, this).then((res) => {
        this.$emit('getUserInfoCallback', { status: true })
      })
      tool.loading_h()
    }
  }
}
</script>

<style scoped>
.button {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
