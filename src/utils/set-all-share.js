import {
	getConfig
} from '@/pages-game/xunbao/api/project.config.js'
export default () => {
	wx.onAppRoute(e => {
		let page = getCurrentPages()[getCurrentPages().length - 1]
		if (page && !page.data.isUseShare) {
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