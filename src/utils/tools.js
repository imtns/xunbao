export function getOssSrc(src, width) {
  let format = 'png'
  const parts = src.split('.')
  const fileExtension = parts[parts.length - 1].toLowerCase()

  if (['jpg', 'jpeg'].includes(fileExtension)) {
    format = 'jpg'
  }
  if (uni.$detectWebp) {
    format = 'webp'
  }

  return src + `?x-oss-process=image/resize,m_mfit,w_${width}/format,${format}`
}
export function addParametersToImageSrc(htmlContent, width = 1500) {
  if (!htmlContent) return ''
  const regex = /<img [^>]*src="([^"]+)"[^>]*>/g
  return htmlContent.replace(regex, (match, src) => {
    const newSrc = getOssSrc(src, width)
    return match.replace(src, newSrc)
  })
}
export function detectWebp() {
  let support = false

  try {
    const _wx$getSystemInfoSync = wx.getSystemInfoSync()
    const platform = _wx$getSystemInfoSync.platform
    const system = _wx$getSystemInfoSync.system

    const versionResult = /[0-9.]*$/.exec(system)
    const systemVersion = versionResult ? versionResult[0] : ''
    const iosSystemSupport = platform === 'ios' && !!systemVersion && compareVersion(systemVersion, '14.0') >= 0

    support = platform === 'devtools' || platform === 'android' || iosSystemSupport
  } catch (e) {
    console.log(e)
  }

  return support
}

export function extractText(htmlString) {
  if (!htmlString) return ''
  const regex = /<[^>]*>|<\/[^>]*>/gm
  const texts = htmlString
    .replace(regex, '')
    .trim()
    .split('\n')
    .filter((text) => text.trim())

  return texts
}

export function throttle(func, delay = 200) {
  let prev = Date.now()
  return function () {
    const context = this
    const args = arguments
    const now = Date.now()
    if (now - prev >= delay) {
      func.apply(context, args)
      prev = Date.now()
    }
  }
}

export function formatNumber(num) {
  if (num === undefined) return 0
  if (num >= 10000) {
    return Math.round(num / 1000) / 10 + 'w'
  }
  return num.toString()
}

export function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export function getUniqID() {
  const length = 20
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let uid = ''
  const timestamp = +new Date()

  const tsPart = timestamp.toString(36).slice(-5)
  uid += tsPart

  for (let i = 0; i < length - tsPart.length; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return uid
}
export function objectToKeyValueString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}
export function redirectLogin() {
  console.log('-------redirect login------')
  if (getApp().globalData.logining) return
  getApp().globalData.logining = true
  wx.navigateTo({
    url: '/pages-sub/login/index'
  })
}

export function copyText(data) {
  uni.setClipboardData({
    data,
    success: function (res) {
      uni.hideLoading()

      uni.showToast({
        title: '复制成功',
        icon: 'none'
      })
    }
  })
}

export function getEncryptData() {
  return new Promise((resolve) => {
    const userCryptoManager = wx.getUserCryptoManager()
    userCryptoManager.getLatestUserKey({
      success(data) {
        data.encryptKey = data.encryptKey.slice(0, 16)
        console.log('----小程序加密参数----', data)
        resolve(data)
      }
    })
  })
}

export function sortObjectKeys(obj) {
  const sortedObj = Array.isArray(obj) ? [] : {}

  Object.keys(obj)
    .sort()
    .forEach(function (key) {
      if (obj[key] !== null && typeof obj[key] === 'object') {
        sortedObj[key] = sortObjectKeys(obj[key])
      } else {
        sortedObj[key] = obj[key]
      }
    })

  return sortedObj
}
