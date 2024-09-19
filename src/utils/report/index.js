import { getBoundingClientRect, isClickTrackArea, getActivePage, flatten, getPrevPage } from './helper'
import { EVENT_ID_ELEMENT_CLICK } from '../../mixin/config'
import Wrapper from './wrapper'
import report from './report'

/**
 * 原生小程序支持区分page还是component，但是经过uni打包后
 * 都是以component的形式存在，所以去掉 methodTracker
 */
class Tracker extends Wrapper {
  constructor({ tracks, isUsingPlugin }) {
    super(isUsingPlugin)
    // 埋点配置信息
    this.tracks = tracks
    // 自动给每个page增加elementTracker方法，用作元素埋点
    this.addPageMethodExtra(this.elementTracker())
    // 自动给page component下预先定义的方法进行监听，用作方法执行埋点
    this.addComponentMethodWrapper(this.comMethodTracker())
    // // 自动给page下预先定义的方法进行监听，用作方法执行埋点 - uni编译后的没有直接存在page里的，所以这里暂时用不到
    // this.addPageMethodWrapper(this.methodTracker())
  }

  // 元素点击埋点
  elementTracker() {
    // elementTracker变量名尽量不要修改，因为他和wxml下的名字是相对应的
    const elementTracker = (e) => {
      const tracks = this.findActivePageTracks('element')
      const { data } = getActivePage()
      /**
       * pageUrl referrerUrl提前获取，然后显示的传给report
       *    因为如果该节点自身有跳转行为，会先页面跳转，然后再执行$elementTracker埋点上报（此时获取的当前页面路由和前项页路由不对了）
       */
      const pageUrl = getActivePage().route
      const referrerUrl = getPrevPage().route || ''
      tracks.forEach((track) => {
        getBoundingClientRect(track.element).then((res) => {
          res.boundingClientRect.forEach((item) => {
            const isHit = isClickTrackArea(e, item, res.scrollOffset)
            track.pageUrl = pageUrl // 当前页路由
            track.referrerUrl = referrerUrl // 前一页路由
            track.dataset = item.dataset
            track.eventId = track.eventId || EVENT_ID_ELEMENT_CLICK
            isHit && report(track, data)
          })
        })
      })
    }
    return elementTracker
  }

  // component内的click方法埋点
  comMethodTracker() {
    const self = this
    return function(page, component, methodName, args = {}) {
      let eventNames = args.currentTarget && args.currentTarget.dataset || {}
      eventNames = flatten(eventNames && eventNames.eventOpts || [])

      const tracks = self.findActivePageTracks('comMethod')
      const data = this.data
      const { dataset } = args.currentTarget || {}
      tracks.forEach((track) => {
        // if (track.method === methodName) {
        if (eventNames.includes(track.method) && args.type !== '__l') {
          track.dataset = dataset
          track.args = args.detail && args.detail.__args__ || [] // 方法本身的参数
          track.eventId = track.eventId || EVENT_ID_ELEMENT_CLICK
          report(track, data)
        }
      })
    }
  }

  // 获取当前页面的埋点配置（method/element/comMethod）
  findActivePageTracks(type) {
    try {
      const { route } = getActivePage()
      const pageTrackConfig = this.tracks[route] || {}
      let tracks = {}
      if (type === 'method') {
        tracks = pageTrackConfig.methodTracks || []
      } else if (type === 'element') {
        tracks = pageTrackConfig.elementTracks || []
      } else if (type === 'comMethod') {
        tracks = pageTrackConfig.comMethodTracks || []
      }
      return tracks
    } catch (e) {
      return {}
    }
  }

  // page内的click方法埋点
  // methodTracker() {
  //   return (page, component, methodName, args = {}) => {
  //     let eventNames = args.currentTarget && args.currentTarget.dataset || {}
  //     eventNames = flatten(eventNames && eventNames.eventOpts || [])
  //
  //     const tracks = this.findActivePageTracks('method')
  //     const { data } = getActivePage()
  //     const { dataset } = args.currentTarget || {}
  //     tracks.forEach((track) => {
  //       // if (track.method === methodName) {
  //       if (eventNames.includes(track.method)) {
  //         track.dataset = dataset
  //         report(track, data)
  //       }
  //     })
  //   }
  // }
}

export default Tracker
