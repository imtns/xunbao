import {
  getConfig
} from '@/pages-game/xunbao/api/project.config.js'
import { addUserIdWhenShare } from '@/utils/index'

export default () => {
  wx.onAppRoute(e => {
    const page = getCurrentPages()[getCurrentPages().length - 1]
    if (page.route.includes('xunbao/') && page && !page.data.isUseShare) {
      page.onShareAppMessage = e => {
        const config = getConfig()
        console.log('configconfigconfig', config)

        const shareInfo = config.SHAREINFO
        shareInfo.path = addUserIdWhenShare(shareInfo.path)

        return shareInfo
      }
    }
  })
}

// import config from '../../api/project.config.js'
// export default () => {
//   wx.onAppRoute(e => {
//     let page = getCurrentPages()[getCurrentPages().length - 1]
//     if (page && !page.data.isUseShare) {
//       page.onShareAppMessage = e => {
//         return config.SHAREINFO
//       }
//     }
//   })
// }
