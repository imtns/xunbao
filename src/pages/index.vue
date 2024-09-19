<template>
  <div class="container">
    <button style="background: orange" @click="setToken">设置token</button>
    <button style="background: pink" @click="goGame">游戏页面</button>
  </div>
</template>

<script>
import { ls } from '@/utils/util'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    setToken() {
      // token 写死在这里，request是从localstorage的token字段获取，不要修改request3，否则会出现token失效的情况
      ls('token', 123)
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
