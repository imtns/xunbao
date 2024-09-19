import { isHttpLink } from './validate'
const { env } = require('@/http/env')

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const getQueryParam = (key) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 格式化数字
const numberFormat = (value) => {
  const param = {}
  const k = 10000
  const sizes = ['', '万', '亿', '万亿']
  let i
  if (value < k) {
    param.value = value
    param.unit = ''
  } else {
    i = Math.floor(Math.log(value) / Math.log(k))
    param.value = (value / Math.pow(k, i)).toFixed(0)
    param.unit = sizes[i]
  }
  return param.value + param.unit
}

// 格式化时间
// 这都n年了iOS依然不认识2020-12-12，需要转换为2020/12/12
const getDate = (time) => {
  if (time instanceof Date) {
    return time
  }
  switch (typeof time) {
    case 'string': {
      // 2020-12-12T12:12:12.000Z、2020-12-12T12:12:12.000
      if (time.indexOf('T') > -1) {
        return new Date(time)
      }
      return new Date(time.replace(/-/g, '/'))
    }
    default:
      return new Date(time)
  }
}
const pad = (str, length = 2) => {
  str += ''
  while (str.length < length) {
    str = '0' + str
  }
  return str.slice(-length)
}
const parser = {
  yyyy: (dateObj) => {
    return pad(dateObj.year, 4)
  },
  yy: (dateObj) => {
    return pad(dateObj.year)
  },
  MM: (dateObj) => {
    return pad(dateObj.month)
  },
  M: (dateObj) => {
    return dateObj.month
  },
  dd: (dateObj) => {
    return pad(dateObj.day)
  },
  d: (dateObj) => {
    return dateObj.day
  },
  hh: (dateObj) => {
    return pad(dateObj.hour)
  },
  h: (dateObj) => {
    return dateObj.hour
  },
  mm: (dateObj) => {
    return pad(dateObj.minute)
  },
  m: (dateObj) => {
    return dateObj.minute
  },
  ss: (dateObj) => {
    return pad(dateObj.second)
  },
  s: (dateObj) => {
    return dateObj.second
  },
  SSS: (dateObj) => {
    return pad(dateObj.millisecond, 3)
  },
  S: (dateObj) => {
    return dateObj.millisecond
  }
}
const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date && date !== 0) {
    return ''
  }
  date = getDate(date)
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds()
  }
  const tokenRegExp = /yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s|SSS|SS|S/
  let flag = true
  let result = format
  while (flag) {
    flag = false
    result = result.replace(tokenRegExp, function (matched) {
      flag = true
      return parser[matched](dateObj)
    })
  }
  return result
}
function getAppIdFromUrl(url) {
  const appidMatch = url.match(/appid=([^&]*)/)
  return appidMatch ? appidMatch[1] : null
}

const pageJump = (url) => {
  console.log('url', url)

  if (url.includes('appid')) {
    const pathMatch = url.match(/(.*)&appid=/)
    const path = pathMatch ? pathMatch[1].replace(/^\//, '') : null // 去掉前面的斜杠
    const appId = getAppIdFromUrl(url)

    if (path && appId) {
      console.log({ path, appId })

      uni.navigateToMiniProgram({
        appId,
        path,
        success: (res) => {
          console.log('跳转结果', res)
        }
      })
    }
    return
  }
  // webview跳转外网地址带上token
  if (isHttpLink(url)) {
    url += (url.indexOf('?') > -1 ? '&' : '?') + '&token=' + lsGet('iclubUserToken3')
    url = '/pages/webview/webView?url=' + encodeURIComponent(url)
  }
  uni.navigateTo({
    url
  })
}

// 回退到指定页面，如果没有，则回退到上一页
const backToPage = (url) => {
  const routers = getCurrentPages()
    .map((i) => i.route)
    .reverse()
  const index = routers.indexOf(url)

  uni.navigateBack({
    delta: Math.max(index, 1)
  })
}

// 刷新当前页面
const refreshCurrentPage = () => {
  const pages = getCurrentPages().reverse()
  const url = pages[0] && pages[0].$page.fullPath
  console.log('刷新当前页面')
  function reloadPage() {
    console.log('页面列表', getCurrentPages())
    const pages = getCurrentPages().slice(0, -1)
    const currentPage = pages[pages.length - 1]
    console.log('刷新当前页面', currentPage)
    currentPage.onLoad(currentPage.options)
  }
  if (!url) return
  if (url.includes('login')) {
    wx.navigateBack({
      success: function () {
        reloadPage()
      }
    })
  } else {
    reloadPage()
    // uni.redirectTo({ url })
  }
}

// 判断是否登录
const isLogin = () => {
  return !!lsGet('iclubUserToken3')
}

// 获取微信二维码进来的参数
const getScene = (scene) => {
  // 当重新获取用户信息第一次进的时候,得到的%3D会变成%253D, 这里兼容一下
  const newScene = scene.replace('%253D', '%3D')
  const str = decodeURIComponent(newScene).replace('?', '')
  const strArr = str.split('&').filter((item) => item)
  const result = {}
  strArr.map((item) => {
    const key = item.split('=')
    result[key[0]] = key[1]
    return item
  })
  return result
}

/**
 * storage存储 - 可以区分环境
 */
const ls = (key, value, opt = {}) => {
  // common 是否区分不同环境，默认false
  const diffEnv = !opt.common
  uni.setStorageSync(diffEnv ? `${env}_${key}` : key, value)
}

/**
 * storage获取 - 可以区分环境
 */
const lsGet = (key, opt = {}) => {
  // common 是否区分不同环境，默认false
  const diffEnv = !opt.common
  return uni.getStorageSync(diffEnv ? `${env}_${key}` : key)
}

/**
 * storage清除 - 可以区分环境
 */
const lsDel = (key, opt = {}) => {
  // common 是否区分不同环境，默认false
  const diffEnv = !opt.common
  return uni.removeStorageSync(diffEnv ? `${env}_${key}` : key)
}

module.exports = {
  ls,
  lsGet,
  lsDel,
  isLogin,
  getScene,
  pageJump,
  backToPage,
  refreshCurrentPage,
  formatTime,
  formatDate,
  numberFormat,
  getQueryParam
}
