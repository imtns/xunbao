// import api from './api'
import apiConfig from './api.config'
// import config from '../../config'
// import auth from './authorization'
import tool from '@@/pages-game/xunbao/js/tool'
import store from '@/store'
//登录
const login = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      success: (res) => {
        resolve(res)
      }
    })
  })
}
// const login = (get_session_key = 0) => {
//   // updateUserInfo()
//   return new Promise((resolve, reject) => {
//     tool.loading("")
//     wxLogin().then(res => {
//       return res
//     }).then(res => {
//       return apiConfig.getOpenid({ js_code: res.code })
//     }).then(res => {
//       tool.loading_h()
//       if (get_session_key == 1) resolve({ session_key: res.data.data.session_key })
//       let userInfo = tool.storage('userInfo') || {}
//       console.log("[res]", res)
//       Object.assign(userInfo, res.data.data.user_info)
//       store.commit("setUserInfo", userInfo)
//       tool.storage("userInfo", userInfo)
//       resolve(res.data.data)
//     }).catch(err => {
//       tool.loading_h()
//       reject(err)
//     })
//   })
// }
//新版获取用户信息
const getUserProfile = () => {
  return new Promise((resolve) => {
    uni.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('【新版获取用户信息】', res)
        authorize(res, this).then((r) => {
          if (r) resolve({ code: 0, userInfo: res })
          // this.triggerEvent("getUserInfoCallback", { status: true })
        })
        tool.loading_h()
      },
      fail: (err) => {
        resolve({ code: 1, msg: err })
      }
    })
  })
}
//授权
const authorize = (e) => {
  return new Promise((resolve, reject) => {
    tool.loading('授权中')
    const _userInfo = e.userInfo || e.detail.userInfo
    if (_userInfo) {
      submitUserInfo(_userInfo).then((res) => {
        let userInfo = tool.storage('userInfo') || {}
        // Object.assign(userInfo, res.data.data.user_info)
        Object.assign(userInfo, res.data.data)
        store.commit('setUserInfo', userInfo)
        tool.storage('userInfo', userInfo)
        tool.loading_h()
        resolve(true)
      })
    } else {
      tool.loading_h()
      resolve(false)
    }
  })
}
//更新头像昵称
// const updateUserInfo = () => {
//   auth.isSettingScope('scope.userInfo').then(res => {
//     console.log("是否授权", res)
//     if (res.status === 1) {
//       wx.getUserInfo({
//         success: res => {
//           submitUserInfo(res.userInfo).then(res => {
//             tool.alert("更新头像昵称成功")
//             // getApp().globalData.isUpdateUserInfo = true
//             let userInfo = tool.storage('userInfo') || {}
//             Object.assign(userInfo, res.data.data.user_info)
//             store.commit("setUserInfo", userInfo)
//             tool.storage("userInfo", userInfo)
//             tool.loading_h()
//           })
//         }
//       })
//     }
//   })
// }
//提交用户头像昵称
const submitUserInfo = (userInfo) => {
  console.log('提交用户头像昵称')
  return new Promise((resolve, reject) => {
    apiConfig
      .uploadUserInfo({
        openid: tool.storage('userInfo').openid,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl
      })
      .then((res) => {
        console.log('【提交用户头像昵称成功了】', res)
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
// module.exports = { login, authorize, getUserProfile }
export { login, authorize, getUserProfile }
