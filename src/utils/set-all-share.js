import {
	getConfig
} from '@/pages-game/xunbao/api/project.config.js'
export default () => {
	wx.onAppRoute(e => {
		let page = getCurrentPages()[getCurrentPages().length - 1]
		console.log("page", page, page.route, page.route.includes('xunbao/'))
		if (page.route.includes('xunbao/') && page && !page.data.isUseShare) {
			page.onShareAppMessage = e => {
				const config = getConfig();
				console.log(config, '---configconfigconfig----');
				return config.SHAREINFO
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