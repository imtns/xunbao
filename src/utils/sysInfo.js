export function sysInfo() {
  const res = wx.getSystemInfoSync()
  const result = {
    ...res,
    bottomSafeHeight: 0,
    isIphoneX: false,
    isMi: false,
    isIphone: false,
    isIpad: false,
    isIOS: false,
    isHeightPhone: false
  }
  const modelmes = result.model
  const system = result.system
  // 判断设备型号
  if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1) {
    result.isIphoneX = true
  }
  if (modelmes.search('MI') != -1) {
    result.isMi = true
  }
  if (modelmes.search('iPhone') != -1) {
    result.isIphone = true
  }
  if (modelmes.search('iPad') > -1) {
    result.isIpad = true
  }
  let screenWidth = result.screenWidth
  let screenHeight = result.screenHeight
  // 宽高比自适应
  screenWidth = Math.min(screenWidth, screenHeight)
  screenHeight = Math.max(screenWidth, screenHeight)
  const ipadDiff = Math.abs(screenHeight / screenWidth - 1.33333)
  if (ipadDiff < 0.01) {
    result.isIpad = true
  }
  if (result.isIphone || system.indexOf('iOS') > -1) {
    result.isIOS = true
  }
  const myCanvasWidth = (640 / 375) * result.screenWidth
  const myCanvasHeight = (1000 / 667) * result.screenHeight
  const scale = myCanvasWidth / myCanvasHeight
  if (scale < 0.64) {
    result.isHeightPhone = true
  }
  result.navHeight = result.statusBarHeight + 46
  result.pageWidth = result.windowWidth
  result.pageHeight = result.windowHeight - result.navHeight
  if (!result.isIOS) {
    result.bottomSafeHeight = 0
  }
  const capsuleInfo = wx.getMenuButtonBoundingClientRect()
  // 胶囊热区 = 胶囊和状态栏之间的留白 * 2 (保持胶囊和状态栏上下留白一致) * 2(设计上为了更好看) + 胶囊高度
  const navbarHeight = (capsuleInfo.top - result.statusBarHeight) * 4 + capsuleInfo.height
  // 写入胶囊数据
  result.capsuleInfo = capsuleInfo
  // 安全区域
  const safeArea = result.safeArea
  // 可视区域高度 - 适配横竖屏场景
  screenHeight = Math.max(result.screenHeight, result.screenWidth)
  const height = Math.max(safeArea.height, safeArea.width)
  // 状态栏高度
  const statusBarHeight = result.statusBarHeight
  // 获取底部安全区域高度（全面屏手机）
  if (safeArea && height && screenHeight) {
    result.bottomSafeHeight = screenHeight - height - statusBarHeight
    if (result.bottomSafeHeight < 0) {
      result.bottomSafeHeight = 0
    }
  }
  // 设置header高度
  result.headerHeight = statusBarHeight + navbarHeight
  // 导航栏高度
  result.navbarHeight = navbarHeight
  return result
}
