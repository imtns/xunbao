import { getActivePage, getPrevPage, formatTime } from './helper'
import { getCurrentAppVersion, getCurrentAppId } from '@/utils/index'
import { apiBuryPointClick } from '@/http/common'
import { lsGet } from '@/utils/util'
import { EVENT_ID_ELEMENT_EXPOSE, EVENT_ID_ELEMENT_CLICK, EVENT_ID_PV } from '@/mixin/config'

/**
 * 解析数组类型dataKey
 * 例如list[$INDEX],返回{key:list, index: $INDEX}
 * 例如list[4],返回{key:list, index: 4}
 * @param {*} key
 * @param {*} index
 */
const resolveArrayDataKey = (key, index) => {
  const leftBracketIndex = key.indexOf('[')
  const rightBracketIndex = key.indexOf(']')
  const result = {}
  if (leftBracketIndex > -1) {
    let arrIndex = key.substring(leftBracketIndex + 1, rightBracketIndex)
    const arrKey = key.substring(0, leftBracketIndex)
    if (arrIndex === '$INDEX') {
      arrIndex = index
    }
    result.key = arrKey
    result.index = parseInt(arrIndex, 10)
  }
  return result
}

/**
 * 链式查找属性
 */
const loopProperty = (obj, keys) => {
  if (!keys || !keys.length) {
    return obj
  }

  let key = ''
  while (keys.length > 0) {
    key = keys.splice(0, 1)
    obj = obj[key] || ''
  }

  return obj
}

/**
 * 获取全局数据
 *  key 目前支持$APP.* $DATASET.* $INDEX
 *  dataset 点击节点dataset
 *  index 点击节点索引
 */
const getGlobalData = (key, dataset) => {
  let result = ''
  // 获取globalData，对应App.vue里面的globalData
  if (key.indexOf('$APP.') > -1) {
    const App = getApp().globalData
    const appKey = key.split('$APP.')[1]
    result = App[appKey]
  } else if (key.indexOf('$DATASET.') > -1) {
    // 获取点击节点的dataset，需要在节点上加上 data-xxx="xxx"
    const setKey = key.split('$DATASET.')[1]
    result = loopProperty(dataset, setKey.split('.'))
  } else if (key.indexOf('$INDEX') > -1) {
    result = dataset.index
  }
  return result
}

// 获取页面数据
const getPageData = (key, dataset = {}, pageData) => {
  const { index } = dataset
  const keys = key.split('.')
  let result = pageData
  if (keys.length > -1) {
    keys.forEach((name) => {
      const res = resolveArrayDataKey(name, index)
      if (res.key) {
        result = result[res.key][res.index]
      } else {
        result = result[name]
      }
    })
  } else {
    result = pageData[key]
  }
  return result
}

// pv上报参数
// pageContent // 页面内容
// referrerScreen // 前向页的筛选状态

// 模块曝光、点击上报参数
// activityName // 按钮名称
// actionRank // 按钮顺序
// activityId // 按钮id
// activityContent // 具体内容
// actionContentScreen // 按钮的筛选状态

/**
 * 获取公共上报参数
 *  visitId: 每次打开小程序的标识，随机数 + 时间戳
 *  eventType: 上报类型，1pv、2点击、3曝光
 *  scene: 小程序场景值，是扫码、分享链接还是其他渠道进入的小程序
 *  userId: 用户id
 *  doctorLevel: 用户医生等级
 *  pageUrl: 当前页面路由
 *  referrerUrl: 上一页路由
 *  imei: 设备id
 *  wechatEdition: 微信版本
 *  platform: 设备平台(iOS、Android、XX) + 系统版本
 *  version: 小程序版本
 *  phoneModelId: 手机型号
 *  manufacturer: 手机厂商
 *  networkType: 网络类型
 *
 *  startTime: 页面开始访问时间 - 仅限pv上报
 *  endTime: 页面结束访问时间 - 仅限pv上报
 *
 *  actionTime: 点击时间 - 模块曝光、点击上报
 */
const getCommonParams = (track) => {
  const gd = getApp().globalData || {}
  const user = gd.userInfo || {}

  const cur = getActivePage() || {} // 当前路由
  const scene = uni.getLaunchOptionsSync().scene // 场景值
  const si = uni.getSystemInfoSync() // 系统信息

  const eventId = track.eventId || '' // 事件id
  const eventType = { page_expose: 1, element_click: 2, element_expose: 3 }[eventId]
  const referrerUrl = (getPrevPage() && getPrevPage().route) || '' // 前一页路由

  return {
    visitId: gd.visitId,
    appid: getCurrentAppId(), // 小程序appId
    openId: lsGet('openId') || '', // 用户openid
    unionid: lsGet('unionId') || '', // 用户unionid
    platSource: 9, // 爱+小程序
    eventType,
    scene,
    userId: user.objectCode,
    doctorLevel: user.doctorLevel,
    // 如果track有显式传入pageUrl和referrerUrl，则优先选用（比如elementTracker方式的埋点）
    pageUrl: track.pageUrl || cur.route,
    referrerUrl: typeof track.referrerUrl !== 'undefined' ? track.referrerUrl : referrerUrl,
    imei: si.deviceId,
    wechatEdition: si.hostVersion,
    platform: si.osName + ' ' + si.osVersion,
    version: getCurrentAppVersion(),
    phoneModelId: si.deviceModel,
    manufacturer: si.deviceBrand,
    networkType: gd.networkType
  }
}

// 返回数据集
const dataReader = (params) => {
  const { dataset, pageData, query } = params
  const pk = typeof params.key === 'object' ? JSON.stringify(params.key) : params.key
  const key = (typeof pk === 'undefined' ? '' : pk).toString() // 都格式化成字符串

  try {
    let result = ''
    // 获取query里的参数，例如from
    if (key.indexOf('$QUERY.') === 0) {
      result = query[key.replace('$QUERY.', '')] || ''
    } else if (key.indexOf('$PAGE.') === 0) {
      // 获取页面里data里的字段
      result = getPageData(key.replace('$PAGE.', ''), dataset, pageData)
    } else if (key.indexOf('$') === 0) {
      // 获取全局数据（包括globalData、节点的dataset、下标 - 需要在节点上显式指定data-index="xxx"）
      result = getGlobalData(key, dataset)
    } else {
      // 常量
      result = key
    }

    return result
  } catch (e) {
    console.log(e)
    return ''
  }
}

// 小程序上报参数格式化 - 小程序上报，参数命名不支持驼峰，所以都转成小写
const transferWxReportParam = (param = {}) => {
  const keys = Object.keys(param)
  const res = {}

  keys.forEach((key) => {
    res[key.toLowerCase()] = param[key]
  })

  return res
}

// 点击上报
export const reportClickEvent = (data) => {
  report({ eventId: EVENT_ID_ELEMENT_CLICK, dataKeys: data })
}

// 曝光
export const reportExposeEvent = (data) => {
  report({ eventId: EVENT_ID_ELEMENT_EXPOSE, dataKeys: data })
}

// 上报数据 - 用于上报暂存的队列
export const reportBury = (params) => {
  apiBuryPointClick(params)
}

// 上报方法
const report = (track, pageData) => {
  const { element, method } = track
  const eventId = track.eventId || '' // 事件id
  const cur = getActivePage() || {} // 当前路由
  const query = cur.options || {} // query
  pageData = pageData || cur.data // page data

  const params = getCommonParams(track)
  // 模块曝光 和 点击上报时，加上参数 actionTime
  if ([EVENT_ID_ELEMENT_EXPOSE, EVENT_ID_ELEMENT_CLICK].includes(track.eventId)) {
    params.actionTime = formatTime()
  }

  const logger = []
  const args = track.args || [] // 方法本身带的参数
  const funs = track.dataFunctions || {}
  const keys = Object.keys(track.dataKeys || {})
  const vals = Object.values(track.dataKeys || {})

  vals.forEach((val, index) => {
    // 特殊处理pv的开始时间和结束时间
    if (keys[index] === '_reportTime') {
      if (val === 'hide') {
        // 加结束时间 - 仅限页面pv上报
        params.endTime = formatTime()
        params._isLeaveExpose = true
      } else {
        // 加开始时间 - 仅限页面pv上报
        params.startTime = formatTime()
      }
    } else {
      const fun = funs[keys[index]] || dataReader // 支持自定义格式化方法
      const res = fun({ key: val, dataset: track.dataset, pageData, query, args }) // 上报字段
      params[keys[index]] = typeof res === 'object' ? JSON.stringify(res) : res // 都格式化成字符串
    }

    logger.push({ eventId, referer: params.referrerUrl, query, element, method, key: keys[index] })
  })

  console?.table?.(logger)
  if (eventId === EVENT_ID_PV) {
    console.log('pageSession', params.pageSession)
  }

  // 离开页面的上报，不上报到小程序后台，因为它本身就有
  if (!params._isLeaveExpose) {
    wx.reportEvent(eventId, transferWxReportParam(params))
  }
  delete params._isLeaveExpose // 删除标志位

  // 阻止上报逻辑
  const data = { dataset: track.dataset, pageData, query, args }
  if (track.stopReport === true || (typeof track.stopReport === 'function' && track.stopReport(data))) {
    return
  }

  // 判断是否有获取到 unionid 和 openid - 没有的话就暂缓上报
  //   if (!params.unionid || !params.openId) {
  //     uni.$emit('stageBuryPointClick', params)
  //   } else {
  apiBuryPointClick(params)
  //   }
}

export default report
