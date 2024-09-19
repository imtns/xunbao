const appServer = 'live.houjiyi.com'

if (appServer === '') {
  wx.showToast({
    title: '请在config.js中提供正确的appServer',
    icon: 'none',
    duration: 5000
  })
}

module.exports = appServer
