/**
 * @description: 防抖函数
 * @param {*} 执行函数 等待时间 是否立即执行
 * @return {*}
 */
export const debounce = function(func, wait, immediate) {
  let timeout, result

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }

  wait = wait || 0

  const debounced = function() {
    const _this = this
    const args = arguments
    // 清空上从定时器
    if (timeout) { clearTimeout(timeout) }

    // 立即执行
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) result = func.apply(_this, args)
    } else {
      timeout = setTimeout(function() {
        func.apply(_this, args)
      }, wait)
    }

    return result
  }

  // 取消防抖函数功能
  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
