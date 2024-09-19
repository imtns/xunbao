/** 请求地址授权，获取地址信息 */
export default {
  /**
   *
   * @param {*} openSetting 拒绝授权后是否弹出再次获取弹窗
   * @returns 百度地理位置信息
   */
  authorization(openSetting = true, isResolve) {
    const locationFlag = wx.getStorageSync('locationFlag')
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.userLocation',
        success: () => {
          console.log('获取授权成功')
          uni.showLoading({
            title: '定位中...'
          })
          wx.getLocation({
            success: async (res) => {
              console.log('获取当前初始位置成功', res)
              uni.hideLoading()
              try {
                const location = wx.getStorageSync('location')
                if (location) {
                  if (Object.prototype.toString.call(location) === '[object String]') {
                    resolve(JSON.parse(location))
                  } else {
                    resolve(location)
                  }
                } else {
                  const info = await this.loadCity(res)
                  wx.setStorageSync('location', JSON.stringify(info))
                  isResolve?.(info) || resolve(info)
                }
              } catch (e) {
                reject()
              }
            },
            fail: (err) => {
              console.log('获取当前初始位置失败', err)
              uni.hideLoading()
              reject()
            }
          })
        },
        fail: (err) => {
          console.log('获取授权失败', err)
          wx.setStorageSync('locationFlag', 1)
          if (openSetting && +locationFlag === 1) {
            this.handleOpenSetting(resolve)
          } else {
            reject()
          }
        }
      })
    })
  },
  loadCity({ longitude, latitude }) {
    const ak = 'KHlEdI8gQK1EOVwRmTlmnbx96tc4r2uA'
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&coordtype=wgs84ll&location=${latitude},${longitude}`,
        header: {
          'Content-Type': 'application/json'
        },
        success(res) {
          console.log(res) // 打印信息，可以参考下图
          resolve(res)
        },
        fail: (e) => {
          console.log(e)
          reject()
          console.error('定位当前位置失败')
        }
      })
    })
  },
  // 用户授权定位
  handleOpenSetting(callback) {
    uni.showModal({
      title: '温馨提示',
      content: '获取权限失败，需要获取您的地理位置才能为您提供更好的服务！是否授权获取地理位置？',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation']) {
                // 用户同意授权
                console.log('用户同意授权')
                this.authorization(false, callback)
              } else {
                callback()
              }
            }
          })
        } else {
          callback()
        }
      }
    })
  }
}
