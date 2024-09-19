<template>
  <div class="container">
    登录状态：{{ isLogin }}
    <view v-if="isLogin">用户名：{{ userInfo.nickName }}</view>
    <button style="background: orange" v-else @click="setToken">去登录</button>
    <button style="background: pink" @click="goGame">游戏页面</button>
  </div>
</template>

<script>
import { ls } from '@/utils/util'
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {
    setToken() {
      // token 写死在这里，request是从localstorage的token字段获取，不要修改request3，否则会出现token失效的情况
      //   ls('token', 123)
      wx.navigateTo({
        url: '/pages-sub/login/index'
      })
    },
    goGame() {
      wx.navigateTo({
        url: '/pages-game/xunbao/index'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
}
</style>
