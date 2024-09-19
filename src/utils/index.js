// 获取当前小程序版本号(只线上能获取，开发版和预览版获取不到该参数)
export function getCurrentAppVersion() {
  const accountInfo = uni.getAccountInfoSync()

  return accountInfo.miniProgram.version || ''
}

// 获取当前小程序appId
export function getCurrentAppId() {
  const accountInfo = uni.getAccountInfoSync()

  return accountInfo.miniProgram.appId
}

// 裁剪图片 5:4 - 分享给好友
export function cropShareImage(url) {
  if (!url) {
    return ''
  }

  if (!url.includes('udstatic.imeik.com')) {
    return url
  }

  // 加上阿里云oss图片裁剪参数(先resize缩放成高200，然后crop裁剪成宽250高200 - 5:4的图片)
  return `${url}${url.includes('?') ? '&' : '?'}x-oss-process=image/resize,m_fixed,h_200,image/crop,g_center,w_250,h_200`
}

// 分享出去的链接，默认带上用户的objectCode
export function addUserIdWhenShare(link) {
  const user = getApp().globalData.userInfo || {}

  if (user && user.objectCode && !link.includes('inviteCode=')) {
    link += `${link.includes('?') ? '&' : '?'}inviteCode=${user.objectCode}`
  }

  return link
}

// 页面参数对象转成字符串
export function pageOptionsToQuery(options = {}) {
  const arr = []

  for (const key in options) {
    arr.push(`${key}=${options[key]}`)
  }

  return arr.join('&')
}

// 合并object
export function mergeObject(a, b) {
  const c = { ...a }
  for (const key in b) {
    if (typeof b[key] === 'object') {
      c[key] = { ...c[key], ...b[key] }
    } else {
      c[key] = b[key]
    }
  }

  return c
}

// 返回上一页方法,如果有上一页放回上一页,没有上一页返回首页
export function navigateBack() {
  const routers = getCurrentPages().map((i) => i.route)
  if (routers.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/home/index'
    })
  }
}

// base64的图片转成本地临时文件
export function base6ImageToTempPath(data, opt) {
  /* code是指图片base64格式数据 */
  const fs = wx.getFileSystemManager()
  // 随机定义路径名称
  const times = new Date().getTime()
  const codeImg = wx.env.USER_DATA_PATH + '/' + times + '.png'

  // 将base64图片写入
  fs.writeFile({
    filePath: codeImg,
    data: data,
    encoding: 'base64',
    success: (res) => {
      // 写入成功了的话，新的图片路径就能用了
      console.log(codeImg)
      opt.succ && opt.succ(codeImg, res)
      // 使用saveImageToPhotosAlbum（）方法保存
      // uni.saveImageToPhotosAlbum()
    }
  })
}
