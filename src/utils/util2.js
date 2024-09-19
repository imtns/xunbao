const logitems = []
let systemInfoChecked = false

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const log = (msg, level) => {
  const time = formatTime(new Date())
  logitems.push(`${time}: ${msg}`)
  if (level === 'error') {
    console.error(`${time}: ${msg}`)
  } else {
    console.log(`${time}: ${msg}`)
  }
}

const checkSystemInfo = (app) => {
  if (!systemInfoChecked) {
    systemInfoChecked = true
    wx.getSystemInfo({
      success: function(res) {
        log(`${JSON.stringify(res)}`)
        const sdkVersion = res.SDKVersion
        const versionItems = sdkVersion.split('.')
        const majorVersion = parseInt(versionItems[0])
        const minorVersion = parseInt(versionItems[1])

        app.globalData.systemInfo = res

        if (majorVersion <= 1 && minorVersion < 7) {
          wx.showModal({
            title: '版本过低',
            content: '微信版本过低，部分功能可能无法工作',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  }
}

module.exports = {
  formatTime: formatTime,
  checkSystemInfo: checkSystemInfo,
  log: log
}
