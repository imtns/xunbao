import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//当前项目环境
		process: process.env.NODE_ENV == 'development',
		//用户信息
		userInfo: {},
		//分享code
		shareCode: '',
		//赠卡code
		shareCode1: '',
		//视频分享
		shareCode2: '',
	},
	mutations: {
		//设置用户信息
		setUserInfo(state, params) {
			state.userInfo = params
		},
		//设置分享码
		storeShareCode(state, params) {
			state.shareCode = params
		},
		//设置赠卡
		storeShareCode1(state, params) {
			state.shareCode1 = params
		},
		//视频分享
		storeShareCode2(state, params) {
			state.shareCode2 = params
		}
	}
})

export default store