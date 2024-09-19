import config from './project.config'
import { login } from './auth.js'
import tool from '@@/pages-game/xunbao/js/tool'
import store from '@/store/index'
// import { promiseFinally } from '../promise-finally.js'
// promiseFinally();//promise的finally配置
/**
 * 接口请求封装
 * @param { Object } data 传参
 * @param { String } url 请求地址
 * @param { String } method 请求方式[默认为POST]
 * @param { Boolean } isOpenid 是否默认带上唯一标识[默认为false]
 * @param { Number } contentType content-type类型，0为application/x-www-form-urlencoded，1为application/json[默认为0]
 * @returns 请求结果
 */
const myRequest = (data = {}, url, method = 'POST', isOpenid = false, contentType = 0, isToken = true) => {
  let header = { 'content-type': ['application/x-www-form-urlencoded', 'application/json', 'text/html; charset=UTF-8', 'none'][contentType] }
  // if (isToken) header.token = store.state.userInfo.token
  header.Authorization =
    'eyJhbGciOiJIUzUxMiJ9.eyJleHRlbmQiOiIxMjMzMDY3NTlkOTI3ZmRlZWM4Y2Y5YzViNjNiMzc2NTcyNGQyOGZlZjlkNTc5MGU0OTIwMDgwNWFlYmJhMTY3IiwiYWNjZXNzRXhwaXJlVGltZSI6MTcyNjc5NTE5MjAyOSwic3ViIjoiMTg1MTA5Mjk3MjAiLCJhdWQiOiJhcGkiLCJhY2NvdW50Q29kZSI6IjE2NjEyMzQ1OTMzNzk3MzM1MDUiLCJjcmVhdGVkIjoxNzI2NjIyMzkyMDI5LCJyZWZyZXNoU3RhcnRUaW1lIjoxNzI2NzA4NzkyMDI5fQ.vnVyPPCatFqr71s9Otj4zNSlmJH9vGoXZF2Wef-HfqOTV07gwcmgg9ueHH2MYjjAkrrq2FwhdrTizqT4u8Z9oQ'
  // let header = { 'content-type': ['application/x-www-form-urlencoded', 'application/json', 'text/html; charset=UTF-8'][contentType]}
  !(url.indexOf('http:') != -1 || url.indexOf('https:') != -1) && (url = `${config.REQUESTURL()}${url}`)
  isOpenid && Object.assign(data, { openid: store.state.userInfo.openid || uni.getStorageSync('userInfo').openid })
  return new Promise((resolve, reject) => {
    requestPromise(url, data, method, header)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const requestPromise = (url, data, method, header) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      data,
      method,
      header,
      success: (res) => {
        console.log('【原始封装请求返回】', res)
        if (res.statusCode !== 200) {
          tool.showModal('', `系统繁忙请稍后再试: ${res.statusCode}`, false)
          reject(res)
        } else {
          if (res.data.code == -1) {
            myLogin().then(() => {
              header.token = store.state.userInfo.token
              resolve(requestPromise(url, data, method, header))
            })
          } else {
            if (res.data.code === 1 || res.data.code === 200 || !res.data.status || (res.data.data && res.data.data.status == 200)) {
              resolve(res.data)
            } else {
              tool.alert(res.data.msg)
              reject(res)
            }
          }
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
const myLogin = (get_session_key = 0) => {
  // updateUserInfo()
  return new Promise((resolve, reject) => {
    tool.loading('')
    login()
      .then((res) => {
        return res
      })
      .then((res) => {
        // return apiConfig.getOpenid({ jsCode: res.code })
        return myRequest({ jsCode: res.code }, 'api/oauth_login', 'post', false, 0)
      })
      .then((res) => {
        tool.loading_h()
        if (get_session_key == 1) resolve({ session_key: res.data.session_key })
        let userInfo = uni.getStorageSync('userInfo') || {}
        Object.assign(userInfo, res.data.user_info)
        userInfo.token = res.data.token
        store.commit('setUserInfo', userInfo)
        // getApp().store.setState({ userInfo })
        uni.setStorageSync('userInfo', userInfo)
        resolve(res.data)
      })
      .catch((err) => {
        tool.loading_h()
        reject(err)
      })
  })
}
module.exports = {
  myRequest
}
