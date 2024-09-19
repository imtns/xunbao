<template>
	<view>
		<u-popup :show="showRecord" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" @close="close" :overlayOpacity="0.8" :closeOnClickOverlay="closeOnClickOverlay">
			<view class="tanctow flex-cen-col">
				<image class="ad_14" @click="close" :src="`${ASSETSURL}ad_14.png`"></image>
				<view class="por" style="margin-left: -40rpx">
					<u-image :src="`${ASSETSURL}tan2_1.png`" width="610rpx" height="568rpx"></u-image>
					<view class="adText" :style="{ color: code == 10007 ? '#000' : '' }">
						{{ code == 10007 ? '识别失败，再来一次' : adText }}
					</view>
					<view class="adText" style="margin-top: 108rpx">{{ sayData }}</view>
				</view>
				<view class="" :style="{ opacity: endRecordShow ? '1' : '0' }">
					<u-image :src="`${ASSETSURL}tan2_2.png`" @touchstart.stop="startRecord" @touchend.stop="endRecord" width="233rpx" height="233rpx"></u-image>
				</view>
				<!-- 	<view class="" v-else>
						123
					</view> -->
			</view>
		</u-popup>
		<dy-prize :show="showPrize" :item="prizeDetail" v-if="code != 10007" @close="showPrize = false" @getZlyq="showPrize = false"></dy-prize>
	</view>
</template>

<script>
import { Base64 } from '@/pages-game/xunbao/components/js/base64js.js'
import '@/pages-game/xunbao/components/js/enc-base64-min'
import CryptoJS from '@/pages-game/xunbao/components/js/hmac-sha256.js'
import api from '@/pages-game/xunbao/api/api.js'
import tool from '@/pages-game/xunbao/js/tool.js'
// 鉴权码：从讯飞开放平台申请appid，并添加（流式接口）获取接口密钥APIKey 和 APISecret
const APPID = '08c1a943'
const API_SECRET = 'NmQ5YmY0Nzg4MmU0YTQzNGU0NmM5OWMy'
const API_KEY = '5cbaed332e3e5b1dbbb8959e4d59b879'
// 获取录音
const recorderManager = uni.getRecorderManager()
export default {
	name: 'dy-record',
	props: {
		showRecord: {
			type: Boolean,
			default: false
		},
		closeOnClickOverlay: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		this.queryAd()
		// 链接 WebSocket
		// this.connectWebSocket();
		//自动播放语音
		// this.playVoice();
	},
	data() {
		return {
			showPrize: false,
			prizeDetail: false,
			webSocket: '',
			// 打开设置 授权录音功能
			recordShow: false,
			voicePath: '',
			adText: '', //广告词
			audioData: [],
			tempFilePath: '',
			formData: {
				voiceUrl: '',
				voiceText: '',
				operateRecordCode: '',
				adCode: ''
			},
			code: '10007',
			sayData: '识别结果',
			endRecordShow: true, //是否录音
			isScopeShow: true, //	是否授权录音
			myConnectSocket: null //WebSocket
		}
	},
	watch: {
		// endRecordShow(a, b) {
		// 	if (a) {
		// 		this.endRecordShow = true
		// 	} else {
		// 		this.endRecordShow = false
		// 	}
		// }
	},
	onShow() {},
	methods: {
		//查询是否授权
		getSetting() {
			console.log('查询授权')
			tool.getSetting('scope.record').then((res) => {
				if (!res.status) {
					this.isScopeShow = false
					if (res.data.authSetting['scope.record'] === false) {
						uni.showModal({
							title: '授权录音',
							content: '需要您的授权才能使用录音功能',
							success: (res) => {
								if (res.confirm) {
									uni.openSetting({
										success: (res) => {
											if (res.authSetting['scope.record'] === true) {
												this.isScopeShow = true
											} else {
												this.isScopeShow = false
											}
										}
									})
								} else if (res.cancel) {
									this.isScopeShow = false
								}
							}
						})
					}
				} else if (res.status == 1) {
					this.isScopeShow = true
				}
			})
		},
		//音频配置
		recorderManager_pz() {
			let self = this
			recorderManager.onStop(function (res) {
				if (!self.isScopeShow) {
					return self.getSetting()
				}
				self.voicePath = res.tempFilePath
				var tempFilePath = res.tempFilePath //音频文件地址

				// #ifdef MP-WEIXIN
				const fs = uni.getFileSystemManager()
				fs.readFile({
					//读取文件并转为ArrayBuffer
					filePath: tempFilePath,
					success(res) {
						console.log('读取文件:' + res.data)
						self.audioData = Array.from(new Uint8Array(res.data))
						self.webSocketSend()
					}
				})
				// #endif
			})
			recorderManager.onFrameRecorded(function (res) {
				console.log('recorder onFrameRecorded', res)
			})
		},
		// 获取广告词
		async queryAd() {
			let { code, data, message } = await api.queryAd()
			this.getSetting()
			this.endRecordShow = true
			if (code != 200) return tool.alert(message)
			this.adText = data.ad
			this.code = code
			this.formData.adCode = data.adCode
			this.sayData = '识别结果'
		},
		close() {
			this.$emit('close')
		},
		// 长按录制
		startRecord() {
			this.getSetting()
			if (!this.endRecordShow) return
			this.sayData = '录音中'
			this.recorderManager_pz()
			if (!this.myConnectSocket) this.connectWebSocket()
			api.preVoiceRecognition().then(({ data }) => {
				this.formData.operateRecordCode = data.operateRecordCode
			})
			console.log('开始录音')
			// 显示 loading 提示框
			// uni.showLoading({
			// 	title: '录制中'
			// });
			/*
				开发语言	任意，只要可以向讯飞云服务发起Websocket请求的均可
				音频属性	采样率16k、位长16bit、单声道
				音频格式	pcm、wav、mp3（需更改aue的值为lame）、speex-wb;7
				音频大小	音频数据发送会话时长不能超过5分钟
				语言种类	中文、英文
				#
				*/
			// recorderManager.start();
			recorderManager.start({
				duration: 30000, // 600000（10 分钟）,默认值 60000（1 分钟）
				numberOfChannels: 1, // 录音通道数，有效值 1/2
				format: 'pcm', // 音频格式
				sampleRate: 16000 // 采样率
			})
		},
		// 松开停止
		endRecord() {
			console.log('录音结束', this.isScopeShow)
			if (this.isScopeShow) {
				this.endRecordShow = false
			}
			// 隐藏 loading 提示框
			// uni.hideLoading();
			this.sayData = '识别中'
			recorderManager.stop()
		},
		// 生成握手参数
		getWebSocketUrl() {
			return new Promise((resolve, reject) => {
				// 请求地址根据语种不同变化
				var url = 'wss://iat-api.xfyun.cn/v2/iat'
				var host = 'iat-api.xfyun.cn'
				var apiKey = API_KEY
				var apiSecret = API_SECRET
				var date = new Date().toGMTString()
				var algorithm = 'hmac-sha256'
				var headers = 'host date request-line'
				var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
				var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
				var signature = CryptoJS.enc.Base64.stringify(signatureSha)
				var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
				var authorization = Base64.btoa(authorizationOrigin)
				url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
				resolve(url)
			})
		},
		// 连接websocket
		connectWebSocket() {
			let that = this
			return this.getWebSocketUrl().then((url) => {
				that.myConnectSocket = uni.connectSocket({
					url: encodeURI(url)
				})
				uni.onSocketOpen(function (res) {
					console.log('WebSocket连接已打开！')
				})
				uni.onSocketError(function (res) {
					console.log('WebSocket连接打开失败，请检查！')
				})
				uni.onSocketMessage(function (res) {
					console.log('收到服务器内容：' + res.data)
					that.result(res.data)
				})
			})
		},
		// 对处理后的音频数据进行base64编码
		toBase64(buffer) {
			var binary = ''
			var bytes = new Uint8Array(buffer)
			var len = bytes.byteLength
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i])
			}
			return Base64.btoa(binary)
		},
		// 向webSocket发送数据
		webSocketSend() {
			// if (this.webSocket.readyState !== 1) {
			// 	return;
			// }
			let audioData = this.audioData.splice(0, 1280)
			var params = {
				common: {
					app_id: APPID
				},
				business: {
					language: 'zh_cn', //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
					domain: 'iat',
					accent: 'mandarin', //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
					vad_eos: 3000,
					dwa: 'wpgs' //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
				},
				data: {
					status: 0,
					format: 'audio/L16;rate=16000',
					encoding: 'raw',
					audio: this.toBase64(audioData)
				}
			}
			console.log('------初始化头部数据--流式分片发送数据到讯飞平台------')
			uni.sendSocketMessage({
				data: JSON.stringify(params)
			})
			// this.webSocket.send(JSON.stringify(params))
			this.handlerInterval = setInterval(() => {
				console.log('------具体内容数据--流式分片发送数据到讯飞平台------')
				// uni.showLoading({
				// 	title: '识别中'
				// })
				this.sayData = '识别中'
				// 最后一帧
				if (this.audioData.length === 0) {
					// if (this.status === 'end') {
					uni.sendSocketMessage({
						data: JSON.stringify({
							data: {
								status: 2,
								format: 'audio/L16;rate=16000',
								encoding: 'raw',
								audio: ''
							}
						})
					})
					this.audioData = []
					clearInterval(this.handlerInterval)
					// }
					return false
				}
				audioData = this.audioData.splice(0, 1280)
				// 中间帧
				uni.sendSocketMessage({
					data: JSON.stringify({
						data: {
							status: 1,
							format: 'audio/L16;rate=16000',
							encoding: 'raw',
							audio: this.toBase64(audioData)
						}
					})
				})
			}, 40)
		},
		result(resultData) {
			let that = this
			// 识别结束
			let jsonData = JSON.parse(resultData)
			if (jsonData.data && jsonData.data.result) {
				let data = jsonData.data.result
				let str = ''
				let resultStr = ''
				let ws = data.ws
				for (let i = 0; i < ws.length; i++) {
					str = str + ws[i].cw[0].w
				}
				// 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
				// 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
				if (data.pgs) {
					if (data.pgs === 'apd') {
						// 将resultTextTemp同步给resultText
						// this.setResultText({
						// 	resultText: this.resultTextTemp
						// });
						this.setResultText(this.resultTextTemp)
					}
					// 将结果存储在resultTextTemp中
					this.setResultText(str)
				} else {
					this.setResultText(str)
				}
			}
			if (jsonData.code === 0 && jsonData.data.status === 2) {
				uni.onSocketClose(function (res) {
					console.log('WebSocket 已关闭！')
					// uni.hideLoading();
					// tool.alert('识别失败')
					// that.queryAd()
					that.sayData = '识别失败'
					that.adText = '识别失败，再来一次'
				})
			}
			if (jsonData.code !== 0) {
				uni.onSocketClose(function (res) {
					console.log('WebSocket 已关闭！')
				})
				console.log(`${jsonData.code}:${jsonData.message}`)
			}
		},
		setResultText(result) {
			let that = this
			// console.log('最终结果' + result);
			uni.showToast({
				title: '讯飞返回结果成功',
				icon: 'none'
			})
			uni.hideLoading()
			that.formData.voiceText = result
			that.sayData = that.formData.voiceText
			tool.uploadFiles([that.voicePath], 'https://java.vrupup.com/identify/link/uploadFile')
				.then((res) => {
					that.formData.voiceUrl = res[0]
					console.log(that.formData, '参数提交')
					api.voiceRecognition({
						...that.formData
					}).then(({ code, data, message }) => {
						// someClickEvent() 全局埋点
						if (code == 10007 || code == 1002) {
							that.code = 10007
							// tool.alert(message)
							// this.queryAd()
							that.sayData = '识别失败'
							that.adText = '识别失败，再来一次'
							return
						}
						if (code == 500) return tool.alert(message)

						if (data.prizeType == 'kapian') {
							// that.showRecord = false
							that.close()
						} else if (data.prizeType == 'jiangli') {
							// that.showRecord = false
							that.close()
							that.queryAd()
							tool.jump_nav('/pages-game/xunbao/pages-list/advertising/advertising')
							return
						} else {
						}
						// that.prizeDetail = data;
						// setTimeout(() => {
						// 	that.showPrize = true;
						// }, 200)
						console.log('出弹窗')
						that.$emit('detailCloce', data)
						uni.closeSocket()
						that.myConnectSocket = null
					})
				})
				.catch((err) => {
					console.log('文件路径转换失败', err)
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.ad_14 {
	width: 60rpx;
	height: 60rpx;
	position: absolute;
	right: 0rpx;
	top: -60rpx;
}

.adText {
	width: 450rpx;
	text-align: center;
	font-weight: bold;
	font-size: 32rpx;
	color: #ffffff;
	position: absolute;
	left: 114rpx;
	top: 174rpx;
}
</style>
