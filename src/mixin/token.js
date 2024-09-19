/**
 * 此mixin目前主要做两件事：
 *    1、在onShow里判断页面登录状态是否发生了改变，如果变了刷新页面
 *       场景：进入A页面，等token过期，然后跳到B页面。此时在B页面token过期，会清除token，然后再返回A页面，需要刷新A页面。
 *       解决：在A页面onShow里判断登录状态是否改变（created时的登录状态是否=onShow时的登录状态），如果变了，就调用refreshCurrentPage刷新页面
 *    2、配合store管理页面是否已刷新过的状态，防止页面多次刷新
 *       场景：进入A页面，等token过期，然后跳到B页面。B页面上会调用多个接口，接口返回token失效，如果不判断状态，会刷新多次页面(request.js里处理逻辑)
 *       解决：在refreshCurrentPage方法里，设置当前页面刷新标志位为true，在request.js里判断为ture的话就不刷新页面（注：页面onHide时需要还原标志位）
 */
// import { refreshCurrentPage, getCurrentPage } from '@/utils/util'
// import store from '@/store/store'

export default {
  data() {
    return {
      //   _mixinLogin: uni.hasLogin()
    }
  },
  created() {
    // this._mixinLogin = uni.hasLogin()
  },
  //   onShow() {
  //     const nl = uni.hasLogin()
  //     // 登录状态发r生变化 - 刷新当前页面
  //     if (nl !== this._mixinLogin) {
  //       refreshCurrentPage()
  //     }
  //   },
  //   onHide() {
  //     // 页面离开时，重置标志位
  //     this._setRefreshedFlag(false)
  //   },
  methods: {
    // 是否已经刷新过page，防止token失效时，导致页面多次刷新
    // _setRefreshedFlag(flag) {
    //   const page = getCurrentPage()
    //   store.commit('setRefreshedPageMap', { url: (page && page.route) || '', flag })
    // }
  }
}
