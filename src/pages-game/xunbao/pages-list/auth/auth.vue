<template>
  <view class="body flex-cen-col">
    <!-- 用户token -->
    <view class="token p">token:{{userInfo.token ? userInfo.token.slice(0, 20) + '...' : '****'}}</view>
    <!-- 用户头像昵称授权 -->
    <view  class="user-box por user-info">
      <template>
        <view class="avatar flex-cen"><img :src="userInfo.avatar || 'https://img.vrupup.com/web/szq/images/avatar_default.png'" alt=""></view>
        <view class="nickname p">{{userInfo.nickname || '微信用户'}}</view>
      </template>
      <get-user-info v-if="!userInfo.avatar" @getUserInfoCallback="getUserInfoCallback"></get-user-info>
    </view>
    <!-- 用户手机号授权 -->
    <view class="user-box por user-phone">
      <view class="p">{{userInfo.mobile || '1***********'}}</view>
      <get-phone-number v-if="!userInfo.mobile" @getUserMobileCallback="getUserMobileCallback"></get-phone-number>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  // import login from '../../../api/login'
  export default {
    data() {
      return {

      }
    },
    created() {
			
    },
    methods: {
      //获取用户信息_回调
      getUserInfoCallback(e) {
        console.log("【获取用户信息_组件回调】", e)
        if (e.status) {
          console.log("【获取用户信息、上传成功】") 
        } else {
          console.log("【获取用户信息、上传失败】")
        }
      },
      //获取手机号_回调
      getUserMobileCallback(e) {
        console.log("【获取手机号_回调】", e)
        if (e.status) {
          console.log("【获取手机号成功】", e.mobile.mobile)
        } else {
          console.log("【获取手机号失败】")
        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
    }
  }
</script>

<style scoped>
  .body{height: 100vh;background: #eee;}
  .openid{margin-bottom: 50rpx;}
  .user-box{width: 50%;margin:0 auto;border-radius: 10rpx;padding:20rpx 0;border: 1px solid #ddd;border-radius: 10rpx;background: #fff;}
	.user-box:nth-child(2){margin: 50rpx 0;}
  .p{font-size: 40rpx;line-height: 1.5;text-align: center;}
  .nickname{font-size: 30rpx;padding-top: 15rpx;}
  .avatar img{width: 140rpx;height: 140rpx;border-radius: 50%;border:2px solid #ddd;}
</style>
