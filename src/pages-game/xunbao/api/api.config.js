// import { api } from './request.js'
// import { WXCONFIG_URL, PROJECT_CONFIG, PROJECT_CONFIG_CODE, GET_USER_INFO_URL } from 'api/project.config'
// /**
//  下面为项目接口请求
//  * return api(url, data, type, true, 1 )参数说明：
//  * @param { String } url 请求地址
//  * @param { Object } data 请求的参数
//  * @param { String } type 请求类型（post/get）
//  * @param { Boolean } 地址类型（false：半地址，true：全地址）
//  * @param { Boolean } 是否在接口请求成功但不是正常状态码时给一个系统弹窗提示
//  * @param { Boolean } 是否在请求参数中自动带上唯一标识参数
//  */
// //获取微信jssdk注册配置信息
// // const getWxConfig = (data, url = `${WXCONFIG_URL[PROJECT_CONFIG.wx_jssdk_field]}&url=${encodeURIComponent(window.location.href)}`, type = 'get') => { return api(url, data, type, true, 0) }
// // //核弹系统配置
// // const getProjectConfig = (data, url = `https://game.flyh5.cn/game/wx7c3ed56f7f792d84/data_system/api.php?a=web&code=${PROJECT_CONFIG_CODE}`, type = 'post') => { return api(url, data, type, true, 0) }
// // //获取用户信息
// // const getUserInfos = (data, url = GET_USER_INFO_URL, type = 'post') => { return api(url, data, type, true, 0) }
import { PROJECT_CONFIG, PROJECT_CONFIG_CODE, WXCONFIG_URL } from './project.h5.config'
import { myRequest } from './request'
import config from './project.config'
/**
* 接口请求封装
* @param { Object } data 传参
* @param { String } url 请求地址
* @param { String } method 请求方式[默认为POST]
* @param { Boolean } isOpenid 是否默认带上唯一标识[默认为false]
* @param { Number } contentType content-type类型，0为application/x-www-form-urlencoded，1为application/json[默认为0]
* @returns 请求结果
*/
//#ifdef H5
  export default {
    //核弹系统配置
    // configure: (data, url = `https://game.flyh5.cn/game/wx7c3ed56f7f792d84/data_system/api.php?a=web&code=${PROJECT_CONFIG_CODE}`) => { return myRequest(data, url, 'GET', true, 1, false) },
	configure: (data, url = `https://game.flyh5.cn/game/wx7c3ed56f7f792d84/data_system/api.php?a=web&code=${PROJECT_CONFIG_CODE}`) => { return myRequest(data, url, 'GET', false, 0, false) },
    //获取微信jssdk注册配置信息
    getWxConfig: (data, url = `${WXCONFIG_URL[PROJECT_CONFIG.wx_jssdk_field]}&url=${encodeURIComponent(window.location.href)}`) => { return myRequest(data, url, 'GET', false, 0, false) },
    //上传头像昵称
    uploadUserInfo: (data, url = 'api/oauth/perfect_info') => { return myRequest(data, url, 'post') },
    //手机号解密
    getPhoneNumber: (data, url = 'api/oauth/de_mobile') => { return myRequest(data, url, 'post') }
  }
// #endif
//#ifdef MP-WEIXIN
	export default {
	  //核弹系统配置
	  configure: (data, url = `https://game.flyh5.cn/game/wx7c3ed56f7f792d84/data_system/api.php?a=web&code=${config.CONFIGURE}`) => { return myRequest(data, url, 'GET', true, true) },
	  //获取openid
	  getOpenid: (data, url = 'api/oauth_login') => { return myRequest(data, url, 'post', false) },
	  //上传头像昵称
	  uploadUserInfo: (data, url = 'api/perfect_info') => { return myRequest(data, url, 'post') },
	  //手机号解密
	  getPhoneNumber: (data, url = 'api/de_mobile') => { return myRequest(data, url, 'post', false) },
		//获取OSS临时凭证
		getOssOptions: (data, url = 'https://game.vrupup.com/sanguo/wujinwen/applet/test/public/index.php/api/oss_upload') => { return myRequest({ type: 2 }, url, 'post') }
	}
// #endif
