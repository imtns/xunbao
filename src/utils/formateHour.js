
/**
 * 将秒数转换成小时
 */

export function formateHour(value) {
  if (value && value !== null) {
    let secondTime = parseInt(value)// 秒
    let minuteTime = 0// 分
    let hourTime = 0// 小时
    if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
      // 获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      // 获取秒数，秒数取余，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      // 如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        // 获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        // 获取小时后取余的分，获取分钟除以60取余的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    // let result = '' + parseInt(secondTime) + '秒'
    //
    // if (minuteTime > 0) {
    //   result = '' + parseInt(minuteTime) + '分' + result
    // }
    // if (hourTime > 0) {
    //   result = '' + parseInt(hourTime) + '小时' + result
    // }
    if (secondTime > 0) {
      minuteTime++
    }
    let result = '' + parseInt(minuteTime) + '分钟'

    if (hourTime > 0) {
      result = '' + parseInt(hourTime) + '小时' + result
    }

    return result
  } else {
    return '0分钟'
  }
}
