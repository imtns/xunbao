/**
 * 获取页面元素信息
 * @param {String} element 元素class或者id
 * @returns {Promise}
 */
export const getBoundingClientRect = function(element) {
  // eslint-disable-next-line promise/param-names
  return new Promise((reslove) => {
    const query = wx.createSelectorQuery()
    query.selectAll(element).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => reslove({ boundingClientRect: res[0], scrollOffset: res[1] }))
  })
}

/**
 * 判断点击是否落在目标元素
 * @param {Object} clickInfo 用户点击坐标
 * @param {Object} boundingClientRect 目标元素信息
 * @param {Object} scrollOffset 页面位置信息
 * @returns {Boolean}
 */
export const isClickTrackArea = function(clickInfo, boundingClientRect, scrollOffset) {
  if (!boundingClientRect) return false
  const { x, y } = clickInfo.detail // 点击的x y坐标
  const { left, right, top, height } = boundingClientRect
  const { scrollTop } = scrollOffset
  if (left < x && x < right && scrollTop + top < y && y < scrollTop + top + height) {
    return true
  }
  return false
}

/**
 * 获取当前页面
 * @returns {Object} 当前页面Page对象
 */
export const getActivePage = function() {
  const curPages = getCurrentPages()
  if (curPages.length) {
    return curPages[curPages.length - 1]
  }
  return {}
}

/**
 * 获取前一页面
 * @returns {Object} 当前页面Page对象
 */
export const getPrevPage = function() {
  const curPages = getCurrentPages()
  if (curPages.length > 1) {
    return curPages[curPages.length - 2]
  }
  return {}
}

// 多维数组平铺
export const flatten = function(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}

// 格式化时间
export const formatTime = function(time = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  let ret
  const opt = {
    'Y+': time.getFullYear().toString(),
    'M+': (time.getMonth() + 1).toString(),
    'D+': time.getDate().toString(),
    'H+': time.getHours().toString(),
    'm+': time.getMinutes().toString(),
    's+': time.getSeconds().toString()
  }

  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(format)
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }

  return format
}

export const _isPromise = function(value) {
  return value && Object.prototype.toString.call(value) === '[object Promise]'
}
