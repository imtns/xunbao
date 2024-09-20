import App from './App'
// import './static/css/reset.css'
import './static/css/font-icon.css'
import './static/css/code-fun.css'
import './static/css/base.css'

// vuex store
import store from './store/store'

// 引入自定义的具体钩子实现
import hooks from './store/hooks'
// 自定义全局钩子，需结合store使用
import CustomHook from 'spa-custom-hooks'

import Mixin from './polyfill/mixins'
// import MixinReport from './mixin/report'
import Share from './mixin/share.js'

import Vue from 'vue'
import uView from './uview-ui'
// 埋点上报
import Tracker from './utils/report'
import { trackConfig } from './mixin/config'
import { detectWebp, redirectLogin } from './utils/tools'

import EventBus from '@/utils/eventbus'

// eslint-disable-next-line no-new
const tk = new Tracker({ tracks: trackConfig })
Vue.prototype.$elementTracker = tk.extraPageMethods && tk.extraPageMethods[0] // 挂载$elementTracker到vue
Vue.prototype.bus = EventBus
Vue.prototype.goLogin = redirectLogin
uni.$detectWebp = detectWebp()
// Polyfill.init()

Vue.use(CustomHook, hooks, store)
Vue.filter('price', (v) => Number(v).toFixed(2))
// Vue.mixin(MixinReport)
Vue.mixin(Mixin)
Vue.mixin(Share)
// Vue.mixin(MixinToken) 
Vue.config.productionTip = false
App.mpType = 'app'
App.store = store
Vue.use(uView)

Vue.mixin({
  data() {
    return {
      ASSETSURL: 'https://cdn.vrupup.com/s/116/'
    }
  }
})

Vue.prototype.$onLaunched = new Promise((resolve) => {
  Vue.prototype.$isResolve = resolve
})
const app = new Vue({
  ...App
})
app.$mount()
