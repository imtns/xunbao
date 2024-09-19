import tool from '@/pages-game/xunbao/js/tool'
import store from '@/store/index.js'
// 定义一个函数来获取分享信息
function getShareInfo() {
	// 确保store已经加载
	if (store && store.state) {
		const shareCode = store.state.shareCode
		const shareCode1 = store.state.shareCode1
		const shareCode2 = store.state.shareCode2
		console.log(store.state,'分享中转',shareCode,shareCode1);
		if (shareCode) {
			return {
				title: `参与活动`,
				path: `pages/pages-list/Share_friends/Share_friends?shareCode=${shareCode}`,
				imageUrl: 'https://img.vrupup.com/web/cdn/szq/other/share_01.jpg'
			}
		}
		if (shareCode1) {
			return {
				title: `分享卡片`,
				path: `pages/pages-list/Share_friends/Share_friends?shareCode1=${shareCode1}`,
				imageUrl: 'https://img.vrupup.com/web/cdn/szq/other/share_01.jpg'
			}
		}
		if (shareCode2) {
			return {
				title: `分享视频`,
				path: `pages/pages-list/Share_friends/Share_friends?shareCode1=${shareCode2}`,
				imageUrl: 'https://img.vrupup.com/web/cdn/szq/other/share_01.jpg'
			}
		}
	} else {
		console.error('Store is not initialized yet.')
		return {
			title: '默认全局分享标题1112233', // 默认标题，没有shareCode
			path: 'pages/pages-list/Share_friends/Share_friends',
			imageUrl: 'https://img.vrupup.com/web/cdn/szq/other/share_01.jpg'
		}
	}
}
// 导出 getShareInfo 函数
export {
	getShareInfo
}

// 暴露一个函数来获取配置信息，而不是直接在模块级别访问store
export function getConfig() {
	return {
		SHAREINFO: getShareInfo()
	}
}

export default {
	//当前开发环境
	DEV_ENV: 0, //0为测试环境，1为正式环境
	//核弹系统码
	CONFIGURE: 'tJ4GXH2P2luArDVm0u9',
	//接口请求url
	REQUESTURL: function() {
		return ['https://user-test.imeik.com/iclub', ''][this.DEV_ENV]
	},
	//线上cdn资源url
	ASSETSURL: 'https://cdn.vrupup.com/s/116/',
	//背景音乐配置
	BGMCONFIG: {
		open: false, //是否开启背景音乐
		musicSrc: 'https://game.flyh5.cn/resources/game/wechat/szq/gaoxiao/music.mp3' //背景音乐mp3文件地址
	},
	//每次打开小程序是否自动更新头像昵称
	UPDATEUSERINFO: false,
	//每次打开小程序是否自动检查更新最新版本
	APPLYUPDATE: true
	//默认配置全局分享
	// SHAREINFO: {
	// 	title: `默认全局分享标题111${this.shareCode}2233`,
	// 	path: "/pages-game/xunbao/index?shareCode=" + this.shareCode,
	// 	imageUrl: "https://img.vrupup.com/web/cdn/szq/other/share_01.jpg"
	// },
}