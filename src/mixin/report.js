/**
 * 数据埋点
 *  1、页面曝光
 *  2、元素曝光
 */
import { EVENT_ID_ELEMENT_EXPOSE, EVENT_ID_PV, trackConfig, EVENT_ID_ELEMENT_CLICK } from './config'
import { refreshToken, wxGetOpenId } from '@/http/wx'
import { getActivePage } from '@/utils/report/helper'
import { topShareConfig } from '@/mixin/config'
import report from '@/utils/report/report'
import { ls, lsGet } from '@/utils/util'
import { getCurrentAppId } from '@/utils'

const observers = []
const expose = {
  data() {
    return {
      pageSession: {}, // 每次访问页面的session
      reportedLeavePv: {} // 已上报的页面离开PV,用来防止同一个pageSession上报两次 {pageUrl: pageSession}
    }
  },
  created() {
    // 只在页面级别调用
    const page = getActivePage()
    if (page && page.route && this.mpType === 'page') {
      this.mixinGetOpenId()
    }
  },
  onUnload() {
    this.initPv('hide') // 页面离开pv

    this.destoryObserve()
  },
  onShow() {
    this.initReport()
    this.refreshUserToken()
    uni.$emit('pageShow', { page: getActivePage().route })
  },
  onShareAppMessage() {
    const page = getActivePage()
    const conf = topShareConfig[page.route] || {}
    const dataKeys = Object.assign({ activityName: '页面右上角...中转发给朋友按钮', actionRank: 1, activityId: 'forward_others' }, conf.dataKeys || {})

    report({ eventId: EVENT_ID_ELEMENT_CLICK, dataKeys })
  },
  onShareTimeline() {
    const page = getActivePage()
    const conf = topShareConfig[page.route] || {}
    const dataKeys = Object.assign({ activityName: '页面右上角...中分享朋友圈按钮', actionRank: 2, activityId: 'forward_moments' }, conf.dataKeys || {})

    report({ eventId: EVENT_ID_ELEMENT_CLICK, dataKeys })
  },
  onHide() {
    this.initPv('hide') // 页面离开pv
    uni.$emit('pageHide', { page: getActivePage().route })
  },
  methods: {
    /**
     * 对接统一登录后，只在登录成功时调用获取openId和unionId
     * 为了防止登录后获取openId和unionId失败，所以每个页面created的时候判断，如果没有，则获取
     */
    mixinGetOpenId() {
      // 已获取过则不再获取
      if (lsGet('openId') && lsGet('unionId')) {
        return
      }

      uni.login({
        success(data) {
          if (data.errMsg === 'login:ok') {
            console.log('wx.login了', data)
            wxGetOpenId({
              appId: getCurrentAppId(),
              code: data.code
            })
              .then((res) => {
                ls('openId', res.openId || '')
                ls('unionId', res.unionId || '')
              })
              .catch(() => {})
          }
        },
        fail(err) {
          console.log('登录获取openid失败', err)
        }
      })
    },

    // 刷新token
    refreshUserToken() {
      refreshToken({}).then(_ => {})
    },

    // 上报初始化
    initReport() {
      // 2022-10-19 每个页面都需要上报PV，如果要携带参数pageContent，需要在trackConfig进行配置
      this.initPv('show') // 页面进入pv
      this.$nextTick(() => {
        this.initExport() // 节点曝光
      })
    },

    // pv上报初始化
    initPv(type = 'show') {
      const page = getActivePage()

      // 生成page session
      if (type === 'show') {
        this.pageSession[page.route] = Math.random().toString(16).substring(2) + new Date().getTime()
      }

      // 判断是否已经上报过相同pageSession的离开PV
      const pvs = this.reportedLeavePv[page.route] || ''
      if (type === 'hide' && pvs === this.pageSession[page.route]) {
        return
      }
      if (type === 'hide') {
        this.reportedLeavePv[page.route] = this.pageSession[page.route]
      }

      // 是否在配置文件里 且 是页面(mpType === 'page')
      if (page && page.route && this.mpType === 'page') {
        const exposes = trackConfig[page.route] && trackConfig[page.route].exposure || []
        const ep = exposes.find(i => !i.element)

        // 如果有特殊配置 - 则走配置项
        if (ep) {
          ep.eventId = ep.eventId || EVENT_ID_PV
          ep.dataKeys = ep.dataKeys || {}
          ep.dataKeys._reportTime = type // 加上时间戳字段 startTime 或 endTime
          ep.dataKeys.pageSession = this.pageSession[page.route] // pageSession
          report(ep, page.data)
        } else {
          // 没有特殊配置 - 走默认的上报 - 带上所有的query参数
          const dataKeys = { _reportTime: type, pageSession: this.pageSession[page.route] }
          if (page.options && Object.keys(page.options).length) {
            dataKeys.pageContent = page.options
          }
          report({ eventId: EVENT_ID_PV, dataKeys: dataKeys }, page.data)
        }
      }
    },

    // 曝光初始化
    initExport() {
      // 销毁监听，防止重复监听
      this.destoryObserve()

      const page = getActivePage()
      const exposes = (trackConfig[page.route] && trackConfig[page.route].exposure || []).filter(i => i.element)

      // 需要曝光上报的节点列表
      if (exposes && exposes.length) {
        for (let i = 0; i < exposes.length; i++) {
          const index = observers.length + 1
          observers[index] = uni.createIntersectionObserver(null, { observeAll: true })
          // 相对于xx节点
          if (exposes[i].relative) {
            observers[index].relativeTo(exposes[i].relative).observe(exposes[i].element, (res) => {
              if (res.intersectionRatio > 0) {
                exposes[i].eventId = exposes[i].eventId || EVENT_ID_ELEMENT_EXPOSE
                report({ ...exposes[i], dataset: res.dataset || {} }, page.data)
              }
            })
          } else {
            // 相对与视窗
            observers[index].relativeToViewport().observe(exposes[i].element, (res) => {
              if (res.intersectionRatio > 0) {
                exposes[i].eventId = exposes[i].eventId || EVENT_ID_ELEMENT_EXPOSE
                report({ ...exposes[i], dataset: res.dataset || {} }, page.data)
              }
            })
          }
        }
      }
    },

    // 销毁监听
    destoryObserve() {
      if (observers.length) {
        observers.map(i => {
          i.disconnect()
          return i
        })
      }
    }
  }
}

export default expose
