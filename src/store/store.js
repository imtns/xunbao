import Vue from 'vue'
import Vuex from 'vuex'
import { userRegister, userInfo } from '@/http/wx'
import { ls, lsGet } from '@/utils/util'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    commonConfig: {},
    isLogin: !!lsGet('token'),
    captchaFlag: false,
    userInfo: lsGet('userInfo') || {},
    commentList: [],
    isTodayCheckIn: false, // 今日签到状态
    defaultAvatar: '',
    balance: 0, // 用户活力值
    willExpiredBalance: 0, // 即将过期活力值
    dictionaryTree: {}, // 数据字典
    iclubDictoryTree: {}, // 数据字典
    signTask: {}, // 签到任务
    isSpecialEventRunning: false, // 是否有活动在进行中
    fuliFlag: false, // 判断用户是否拥有过福利金
    systemUpdate: false, // 系统升级弹窗
    // 分享code
    shareCode: '',
    // 赠卡code
    shareCode1: ''
  },
  getters: {
    isLogin(state) {
      return state.isLogin
    },
    loginWithUserPhone(state) {
      return state.commonConfig.loginWithUserPhone
    },
    sms4(state) {
      return {
        key: (state.iclubDictoryTree.options || []).find((item) => item.name === 'sms_key')?.sign || '',
        iv: (state.iclubDictoryTree.options || []).find((item) => item.name === 'sms_iv')?.sign || ''
      }
    },
    eventInfo(state) {
      return {
        startTime: (state.iclubDictoryTree.options || []).find((item) => item.name === 'activityStartTime')?.sign || '',
        endTime: (state.iclubDictoryTree.options || []).find((item) => item.name === 'activityEndTime')?.sign || ''
      }
    }
  },
  mutations: {
    setDictionaryTree(state, payload) {
      console.log('setDictionaryTree', payload)
      state.dictionaryTree = payload
      state.iclubDictoryTree = payload.miniappIClubAccessControlPro
    },
    setFuliFlag(state, payload) {
      state.fuliFlag = payload
    },
    setIsLogin(state, payload) {
      console.warn('setIsLogin::::', payload)
      state.isLogin = payload
    },
    setCommentList(state, payload) {
      state.commentList = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    setBalance(state, payload) {
      state.balance = payload.integralBalance
      state.willExpiredBalance = payload.willExpiredIntegral
    },

    setTodayCheckIn(state, payload) {
      state.isTodayCheckIn = payload
    },
    setSignTask(state, payload) {
      state.signTask = payload
    },
    setDefaultAvatar(state) {
      const defaultAvatars = [
        'https://udstatic.imeik.com/pcUploads/1705285352902/1.png',
        'https://udstatic.imeik.com/pcUploads/1705285380205/2.png',
        'https://udstatic.imeik.com/pcUploads/1705285409154/3.png'
      ]
      const randomNumber = Math.floor(Math.random() * defaultAvatars.length)
      state.defaultAvatar = defaultAvatars[randomNumber]
    },
    setConfig(state, payload) {
      console.warn('load-config::::::::', payload)
      state.commonConfig = payload
      if (payload.systemUpdate) {
        // state.systemUpdate = true
        state.systemUpdate = payload.systemUpdate
      }
    },
    setIsSpecialEventRunning(state, payload) {
      state.isSpecialEventRunning = payload
    },
    setCaptchaFlag(state, value) {
      state.captchaFlag = value
    },
    setSystemUpdate(state, value) {
      state.systemUpdate = value
    },
    // 设置分享码
    storeShareCode(state, params) {
      state.shareCode = params
    },
    // 设置分享码
    storeShareCode1(state, params) {
      state.shareCode1 = params
    }
  },

  actions: {
    async getUserInfo({ commit, dispatch, state }) {
      const data = {
        inviteCode: getApp?.()?.globalData?.inviteCode || '',
        inviteSource: getApp?.()?.globalData.inviteSource || '',
        shareLinkTime: getApp?.()?.globalData.shareLinkTime || ''
      }
      //   await userRegister(data)
      return new Promise((resolve) => {
        userInfo()
          .then((res) => {
            commit('setIsLogin', true)
            commit('setUserInfo', res)
            ls('userInfo', res)

            resolve(res)
          })
          .catch(() => {
            commit('setIsLogin', false)
            commit('setUserInfo', {})
            resolve('')
          })
      })
    }
  }
})

export default store
