<template>
  <view v-if="showPrivacy" :class="privacyClass">
    <view :class="contentClass">
      <view class="title">隐私保护指引</view>
      <view class="des">
        感谢选择我们的小程序，我们非常重视您的个人信息安全和隐私保护。根据最新法律要求，使用我们的产品前，请仔细阅读“<text class="link" @tap="openPrivacyContract">{{ privacyContractName }} </text
        >”，以便我们向您提供更优质的服务！<br />我们将尽全力保护您的个人信息及合法权益，感谢您的信任！

        <br />
      </view>
      <view class="btns">
        <button class="item reject" @tap="exitMiniProgram">拒绝</button>
        <button id="agree-btn" class="item agree" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PrivacyPopup',
  props: {
    position: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      privacyContractName: '',
      showPrivacy: false,
      isRead: false,
      resolvePrivacyAuthorization: null
    }
  },
  computed: {
    privacyClass() {
      return this.position === 'bottom' ? 'privacy privacy-bottom' : 'privacy'
    },
    contentClass() {
      return this.position === 'bottom' ? 'content content-bottom' : 'content'
    }
  },
  mounted() {
    // console.log(wx.onNeedPrivacyAuthorization)
    // console.log(wx.getPrivacySetting)
    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization((resolve) => {
        this.resolvePrivacyAuthorization = resolve
      })
    }

    if (wx.getPrivacySetting) {
      wx.getPrivacySetting({
        success: (res) => {
          console.log(res, 'getPrivacySetting')
          if (res.needAuthorization) {
            this.privacyContractName = res.privacyContractName
            this.showPrivacy = true
          }
        }
      })
    }
  },

  methods: {
    openPrivacyContract() {
      wx.openPrivacyContract({
        success: () => {
          this.isRead = true
        },
        fail: () => {
          uni.showToast({
            title: '遇到错误',
            icon: 'error'
          })
        }
      })
    },
    exitMiniProgram() {
      this.$emit('reject-privacy') // 当用户拒绝隐私政策时发出事件
      wx.exitMiniProgram()
    },
    handleAgreePrivacyAuthorization() {
      // if (this.isRead) {
      this.showPrivacy = false
      this.$emit('agree-privacy') // 当用户同意隐私政策时发出事件
      if (typeof this.resolvePrivacyAuthorization === 'function') {
        this.resolvePrivacyAuthorization({
          buttonId: 'agree-btn',
          event: 'agree'
        })
      }
      // } else {
      // 	uni.showToast({
      // 		title: '请先阅读隐私授权协议',
      // 		icon: 'error',
      // 	});
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.privacy {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 50%);
}

.privacy-bottom {
  align-items: flex-end;
}

.content {
  box-sizing: border-box;
  width: 632rpx;
  padding: 48rpx;
  background: #fff;
  border-radius: 16rpx;
}

.content-bottom {
  position: absolute;
  bottom: 0;
  width: 96%;
  padding: 36rpx;
  border-radius: 16rpx 16rpx 0 0;
}

.content .title {
  color: #333;
  font-weight: bold;
  font-size: 32rpx;
  text-align: center;
}

.content .des {
  margin-top: 40rpx;
  color: #666;
  font-size: 26rpx;
  line-height: 1.6;
  text-align: justify;
}

.content .des .link {
  color: #07c160;
  text-decoration: underline;
}

.btns {
  display: flex;
  margin-top: 48rpx;
  margin-bottom: 12rpx;
}

.btns .item {
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-radius: 16rpx; */
  box-sizing: border-box;
  width: 200rpx;
  height: 72rpx;
  overflow: visible;
  border: none !important;
}

.btns .reject {
  margin-right: 16rpx;
  color: #666;
  font-weight: 300;
  font-size: 14px;
  background: #f4f4f5;
}

.btns .agree {
  width: 320rpx;
  color: #fff;
  font-size: 16px;
  background: #07c160;
}

.privacy-bottom .btns .agree {
  width: 440rpx;
}
</style>
