/**
 * 防止多次点击的函数
 * @param {Function} fn 需要执行的函数
 * @param {Number} gapTime 时间间隔，默认值为500ms
 */
function clickPrevent(fn, gapTime = 1000) {
  let lastTime = null // 上一次点击的时间

  return function () {
    const nowTime = +new Date() // 当前时间

    if (nowTime - lastTime > gapTime || !lastTime) {
      fn.apply(this, arguments)
      lastTime = nowTime
    }
  }
}

// 导出防止多次点击的函数
export default clickPrevent
