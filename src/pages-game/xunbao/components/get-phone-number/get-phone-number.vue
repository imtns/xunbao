<template>
  <view>
    <button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumberUserInfo" bindtap="operation"></button>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import apiConfig from '@/pages-game/xunbao/api/api.config'
import { login } from '@/api/auth'
import tool from '@/pages-game/xunbao/js/tool'
export default {
  name: 'get-phone-number',
  data() {
    return {
      encryptedData: '', //包括敏感数据在内的完整用户信息的加密数据
      iv: '', //加密算法的初始向量
      session_key: '' //是对用户数据进行加密签名的会话密钥
    }
  },
  mounted() {
    // if (!wx.getStorageSync('userInfo').mobile) this.myLogin()
    let _autoGetisPhone = setInterval(() => {
      if (!tool.storage('userInfo')) {
        this.myLogin()
        clearInterval(_autoGetisPhone)
      }
    }, 100)
  },
  methods: {
    //显示、隐藏
    // isShow() {
    //   this.setData({ isShow: !this.isShow })
    // },
    //登录
    myLogin() {
      login()
        .then(({ code }) => {
          console.log('【code】', code)
          return apiConfig.getOpenid({
            js_code: code
          })
        })
        .then(({ code, data }) => {
          console.log('【code, data】', code, data)
          if (code == 1) {
            this.session_key = data.session_key
            tool.loading_h()
          } else {
            tool.loading_h()
            console.log('【服务器异常，请稍后再试】')
          }
        })
    },
    //点击获取手机号按钮
    getPhoneNumberUserInfo(e) {
      tool.loading('')
      if (e.detail.encryptedData) {
        this.encryptedData = e.detail.encryptedData
        this.iv = e.detail.iv
        this.decryptPhone()
      } else {
        tool.alert('用户拒绝授权')
        this.$emit('getUserMobileCallback', { status: false })
      }
      tool.loading_h()
    },
    //解密手机号
    decryptPhone() {
      let _data = {
        e_data: encodeURIComponent(this.encryptedData),
        session_key: encodeURIComponent(this.session_key),
        iv: encodeURIComponent(this.iv)
      }
      apiConfig.getPhoneNumber(_data).then(({ code, data }) => {
        if (code == 1) {
          let userInfo = tool.storage('userInfo') || {}
          userInfo.mobile = data.mobile || data.phone || data.purePhoneNumber || data.phoneNumber
          this.setUserInfo(userInfo)
          tool.storage('userInfo', userInfo)
          this.$emit('getUserMobileCallback', { status: true, mobile: data })
        } else {
          console.log('【手机号解密失败】')
        }
        tool.loading_h('')
      })
    },
    ...mapMutations(['setUserInfo'])
  },
  computed: {
    ...mapState(['userInfo'])
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
