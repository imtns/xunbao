// 配置专属域名
import { getQueryParam, ls, lsGet, lsDel } from '@/utils/util'
import { getUniqID, sortObjectKeys } from '@/utils/tools'
import { getCurrentAppVersion } from '@/utils/index'
import { SM4Util } from '@/utils/sm4'
import store from '@/store/store'
import { GONGGAO_DICT } from '../dict'
const { baseNewUrl, baseIclubUrl } = require('./env')
module.exports = {
  request2: function ({ url, method = 'POST', data = {}, isJson = true, noToast = true, encrypt = false, auth = true }) {
    const json = isJson ? 'application/json' : 'application/x-www-form-urlencoded'
    // iclub的请求走另外的接口域名
    const base = url.includes('/iclub/') ? baseIclubUrl : baseNewUrl
    const fullUrl = url.includes('http') ? url : `${base}${url}`
    let token = lsGet('token')
    // #ifdef H5
    if (getQueryParam('token')) {
      token = getQueryParam('token')
      ls('token', token)
    }
    // #endif

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      // 不需要登录就可以调用的接口白名单
      const whiteList = [
        'iclub/api/operate/queryOperate',
        'iclub/api/authenticity/queryAuthenticity',
        'qxcollege/api/dictionary/tree',
        'qxcollege/api/buryPoint/click',
        'iclub/api/content/info',
        'iclub/api/operate/queryOperate',
        'iclub/api/home/listhomeContent',
        'iclub/api/product/list',
        'iclub/api/product/info',
        'qxcollege/api/fileUpload/findAliToken',
        'iclub/api/user/loginForMiniProgram',
        'passport/api/sso/openid',
        'passport/api/user/uploadUserInfo',
        '/iclub/api/content/listProductContent',
        '/iclub/api/goods/list',
        '/iclub/api/content/info2',
        '/iclub/openApi/test/testSM4',
        '/iclub/openApi/activity/queryUnloginChallengeMatchActInfo',
        '/iclub/api/activity/ehi/getEhiGameInfo'
      ]
      if (!token && !whiteList.find((i) => url.includes(i)) && auth) {
        resolve({ data: {} })
        return
      }
      // 把小程序版本号拼接到query里传给接口
      const _version = getCurrentAppVersion()
      // 请求头带上渠道code
      const channel = (getApp() && getApp().globalData && getApp().globalData.userSource) || ''
      const encryptKey = lsGet('encryptKey')
      const encryptIV = lsGet('encryptIV')
      const SecurityVersion = lsGet('encryptVersion')
      // 请求头带上渠道code
      uni.request({
        url: fullUrl + (fullUrl.includes('?') ? '&' : '?') + '_version=' + _version,
        method,
        data: sortObjectKeys(data),
        // data,
        header: {
          'Content-type': json,
          Authorization: token,
          channel: channel,
          app: 'IClub',
          Ticket: lsGet('ticket'),
          SecurityVerify: new SM4Util().encryptCustom_CBC(
            JSON.stringify({
              uniqueFlag: getUniqID(),
              callTime: Date.now(),
              paramter: sortObjectKeys(data)
            }),
            encryptIV,
            encryptKey
          ),
          SecurityVersion
        },

        success(res) {
          console.warn('-----request-----')
          if (res.data.code === 10000) {
            const pages = getCurrentPages().reverse()
            const pageUrl = pages[0] && pages[0].route
            uni.$emit(`captcha-${pageUrl}`, data.methodName)
            reject(new Error('captcha'))
            return
          }
          if (res.data.code === 200) {
            lsDel('ticket')
            resolve(res.data)
          } else if (res.data.code in GONGGAO_DICT) {
            const message = GONGGAO_DICT[res.data.code]
            store.commit('setSystemUpdate', message)
          } else if (res.data.code === 300) {
            // token 错误、过期
            // uni.cToast('登录状态失效\r\n请重新登录')
            uni.$emit('toast', '登录状态失效\r\n请重新登录')
            uni.clearLogin() // 清除token
            store.commit('setIsLogin', false)
            // 刷新当前页面，重新登录
            // setTimeout(() => {
            //   refreshCurrentPage()
            // }, 2000)
            reject(res.data)
          } else {
            const msg = (res.data && res.data.message) || '接口问题，请检查'
            // 有些业务自己处理错误信息，不需要这里toast
            if (!noToast) {
              uni.cToast(msg)
            }
            reject(res.data)
          }
        },
        fail() {
          uni.cToast('请求失败，请检查网络')
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('请求失败，请检查网络')
        }
      })
    })
  }
}
