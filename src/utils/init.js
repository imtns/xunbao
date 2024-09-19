import { lsGet, lsDel } from './util'
import store from '@/store/store'

// 是否登录
uni.hasLogin = () => {
  return !!lsGet('iclubUserToken3')
}

// 清除登录信息
uni.clearLogin = () => {
  lsDel('iclubUserToken3')
  lsDel('userInfo')
  lsDel('userHasUploadInfo')
  lsDel('encryptKey')
  lsDel('encryptIV')
  lsDel('encryptVersion')
  store.commit('setIsLogin', false)
}

// toast
uni.cToast = (option = {}) => {
  const title = typeof option === 'string' ? option : option.title || ''

  if (title) {
    setTimeout(() => {
      uni.showToast({
        title: title,
        mask: option.mask || false,
        icon: option.icon || 'none',
        duration: option.duration || 3000
      })
    }, 500)
  }
}
