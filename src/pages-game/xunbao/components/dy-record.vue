<template>
	<view>
		<u-popup :show="showRecord" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" @close="close"
			:overlayOpacity="0.8" :closeOnClickOverlay="closeOnClickOverlay">
			<view class="tanctow flex-cen-col">
				<image class="ad_14" @click="close" :src="`${ASSETSURL}ad_14.png`"></image>
				<view class="por" style="margin-left: -40rpx; margin-bottom: 30rpx">
					<u-image :src="`${ASSETSURL}tan2_1s.png`" width="610rpx" height="568rpx"></u-image>
					<view class="adText" :style="{ color: code == 10007 ? '#000' : '' }">
						{{ code == 10007 ? '识别失败，再来一次' : adText }}
					</view>
					<view class="adText" :class="!endRecordShow ? 'scale-wave' : ''"
						style="margin-top: 108rpx; font-size: 28rpx;font-weight: 400;"
						:style="{ color: code == 10007 ? '#000' : '' }">{{ sayData }} </view>
				</view>
				<view class="voice fade-show">
					<sequenceEffect ref="voice" :sequenceList="voiceList"></sequenceEffect>
				</view>
				<u-image :src="`${ASSETSURL}back.png`" v-if="task.now >= task.max" @click="close" width="273rpx"
					height="94rpx"></u-image>
				<u-image :src="`${ASSETSURL}again.png`" v-else-if="code == 10007" @click="again" width="273rpx"
					height="94rpx"></u-image>
				<block v-else>
					<image :src="`${ASSETSURL}img/head.png`" mode="widthFix" class="head"></image>
					<view class="record-btn por" @touchstart="startRecord" @touchend="endRecord">
						<view class="mike fade-show">
							<sequenceEffect ref="mike" :sequenceList="mikeList"></sequenceEffect>
						</view>
						<image class="btn-img" :src="`${ASSETSURL}tan2_2.png`"></image>
						<!-- <u-image class="btn-img" :src="`${ASSETSURL}tan2_2.png`"  width="234rpx" height="234rpx"></u-image> -->
						<!-- <u-image class="btn-img" width="100%" height="100%" :src="`${ASSETSURL}tan2_2.png`"></u-image> -->
					</view>
				</block>

				<!-- 	<view class="" v-else>
						123
					</view> -->
				<u-popup :show="noPrize" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" @close="
						noPrize = false
						close()
					">
					<view class="por">
						<u-image :src="ASSETSURL + 'noPrize.png'" width="540rpx" height="674rpx"></u-image>
						<view class="close" @click="
								noPrize = false
								close()
							">
							<u-icon :name="ASSETSURL + 'close.png'" color="#fff" size="60rpx"></u-icon>
						</view>
					</view>
				</u-popup>
			</view>
		</u-popup>

		<dy-prize :show="showPrize" :showPrize="showPrize" :item="prizeDetail" v-if="code != 10007"
			@close="showPrize = false" @getZlyq="showPrize = false"></dy-prize>
	</view>
</template>
<style>
	@import '@/pages-game/xunbao/css/base.css';
	@import '@/pages-game/xunbao/css/code-fun.css';
</style>
<script>
	import {
		Base64
	} from '@/pages-game/xunbao/components/js/base64js.js'
	import '@/pages-game/xunbao/components/js/enc-base64-min'
	import CryptoJS from '@/pages-game/xunbao/components/js/hmac-sha256.js'
	import sequenceEffect from '@/pages-game/xunbao/components/sequenceEffect/sequenceEffect.vue'
	import api from '@/pages-game/xunbao/api/api.js'
	import tool from '@/pages-game/xunbao/js/tool.js'
	// 鉴权码：从讯飞开放平台申请appid，并添加（流式接口）获取接口密钥APIKey 和 APISecret
	const APPID = '2699dfb4'
	const API_SECRET = 'MjI0ZGUyNDRlMTVkZDg3MzFiZTQ3NDk4'
	const API_KEY = '738258842d2ebad4dcc6fd7df5e58324'
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	// 获取录音
	let recorderManager
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
			},
			task: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		components: {
			sequenceEffect
		},
		mounted() {
			this.queryAd()
			this.getSetting()
			// 链接 WebSocket
			// this.connectWebSocket();
			//自动播放语音
			// this.playVoice();
		},
		data() {
			return {
				voiceList: {
					url: `https://cdn.vrupup.com/s/116/voice2/1.png`,
					num: 30,
					initIndex: 1,
					speed: 68,
					loop: true,
					autoplay: false
				},
				mikeList: {
					url: `https://cdn.vrupup.com/s/116/mike3/1.png`,
					num: 14,
					initIndex: 1,
					speed: 75,
					loop: true,
					autoplay: false
				},
				noPrize: false,
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
				sayData: ' ',
				endRecordShow: true, //是否录音
				myConnectSocket: null, //WebSocket
				isNoreadAuto: true, //录音权限
				startRecord_timeStamp: null, // 按下录音按钮的时间戳
				pressAndHold_minTimes: 200, //按住最小时间才算录音，时间戳
				startRecordNext_setT: null, // 按下录音按钮后，超过1秒后，开始录音
				isTouchEnd: false //已经释放长按
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
			again() {
				this.queryAd()
				this.endRecordShow = true
				this.code = 0
			},
			//查询是否授权
			getSetting() {
				return new Promise((resolve) => {
					console.log('查询授权')
					let that = this
					tool.getSetting('scope.record').then((res) => {
						console.log(res, '录音授权123123')
						if (res.status != 1) {
							this.isNoreadAuto = false
							wx.authorize({
								scope: 'scope.record',
								success() {
									// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
									console.log('wx.authorize9999999')
									this.isNoreadAuto = true
									recorderManager = uni.getRecorderManager()
									reportClickEvent({
										activityName: '允许授权麦克风',
										actionRank: 0,
										activityId: 'game_xunbao_audio_click_auth',
										activityContent: {}
									})
									resolve()
								},
								fail() {
									uni.showModal({
										title: '授权录音',
										content: '需要您的授权才能使用录音功能',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting({
													success: (res) => {
														if (res
															.authSetting[
																'scope.record'
															] === true
														) {
															reportClickEvent
																({
																	activityName: '允许授权麦克风',
																	actionRank: 0,
																	activityId: 'game_xunbao_audio_click_auth',
																	activityContent: {}
																})
															recorderManager
																= uni
																.getRecorderManager()
															resolve()
														}
													}
												})
											}
										}
									})
								}
							})
						} else if (res.status == 1) {
							this.isNoreadAuto = true
							recorderManager = uni.getRecorderManager()
							resolve()
						}
					})
				})
			},
			//音频配置
			recorderManager_pz() {
				let self = this
				recorderManager.onStop(function(res) {
					console.log('录音stop', res)
					self.voicePath = res.tempFilePath
					var tempFilePath = res.tempFilePath //音频文件地址
					console.log('音频文件地址', tempFilePath)
					self.endRecordShow = false
					self.sayData = '语音识别中，请等待......'
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
				recorderManager.onFrameRecorded(function(res) {
					console.log('recorder onFrameRecorded', res)
				})
			},
			// 获取广告词
			async queryAd() {
				let {
					code,
					data,
					message
				} = await api.queryAd()

				this.endRecordShow = true
				if (code != 200) return tool.alert(message)
				this.adText = data.ad
				this.code = code
				this.formData.adCode = data.adCode
				this.sayData = '(读取文字识别获取卡片或奖励)'
			},
			close() {
				this.$emit('close')
			},
			// 长按录制
			startRecord() {
				clearTimeout(this.startRecordNext_setT)
				this.startRecord_timeStamp = Date.now()
				if (!this.endRecordShow) return
				// this.isTouchEnd = false
				this.startRecordNext_setT = setTimeout(() => {
					console.log("{开始录音5}")
					this.startRecordNext()
				}, this.pressAndHold_minTimes)
			},
			startRecordNext() {
				this.getSetting().then(() => {
					reportClickEvent({
						activityName: '录制广告词',
						actionRank: 0,
						activityId: 'game_xunbao_audio_click_record',
						activityContent: {}
					})
					console.log('!this.endRecordShow', !this.endRecordShow)
					console.log('!this.isNoreadAuto', !this.isNoreadAuto)
					if (!this.endRecordShow || !this.isNoreadAuto) return
					this.sayData = '录音中'
					this.$refs.voice.play()
					this.$refs.mike.play()
					this.recorderManager_pz()
					if (!this.myConnectSocket) this.connectWebSocket()
					api.preVoiceRecognition().then(({
						data
					}) => {
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
				})
			},
			// 松开停止
			endRecord() {
				this.$refs.voice.pause()
				this.$refs.mike.pause()
				console.log("短按时间34", Date.now() - this.startRecord_timeStamp)
				if (Date.now() - this.startRecord_timeStamp > this.pressAndHold_minTimes) {
					// this.isTouchEnd = true
					recorderManager.stop()
					// this.recordNext()
				} else {
					clearTimeout(this.startRecordNext_setT)
				}
				// if (!this.isNoreadAuto) return
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
					var authorizationOrigin =
						`api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
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
					uni.onSocketOpen(function(res) {
						console.log('WebSocket连接已打开！')
					})
					uni.onSocketError(function(res) {
						console.log('WebSocket连接打开失败，请检查！')
					})
					uni.onSocketMessage(function(res) {
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
				console.log('------初始化头部数据--流式分片发送数据到讯飞平台2------')
				uni.sendSocketMessage({
					data: JSON.stringify(params)
				})
				// this.webSocket.send(JSON.stringify(params))
				this.handlerInterval = setInterval(() => {
					console.log('------具体内容数据--流式分片发送数据到讯飞平台3------')
					// uni.showLoading({
					// 	title: '识别中'
					// })
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
					uni.onSocketClose(function(res) {
						console.log('WebSocket 已关闭！2')
						that.myConnectSocket = null
						// uni.hideLoading();
						// tool.alert('识别失败')
						// that.queryAd()
						// that.sayData = '识别失败'
						// that.adText = '识别失败，再来一次'
					})
				}
				if (jsonData.code !== 0) {
					uni.onSocketClose(function(res) {
						console.log('WebSocket 已关闭！1')
						that.myConnectSocket = null
					})
					console.log(`${jsonData.code}:${jsonData.message}`)
				}
			},
			setResultText(result) {
				let that = this
				console.log('最终结果' + result);
				// uni.showToast({
				// 	title: '讯飞返回结果成功',
				// 	icon: 'none'
				// })
				uni.hideLoading()
				that.formData.voiceText = result
				that.sayData = ' '
				tool.uploadFiles([that.voicePath], 'https://java.vrupup.com/identify/link/uploadFile')
					.then((res) => {
						that.formData.voiceUrl = res[0]
						console.log(that.formData, '参数提交')
						api.voiceRecognition({
								...that.formData
							})
							.then(({
								code,
								data,
								message
							}) => {
								console.log(data, '---------data参数提交-----')
								if (!data) {
									return tool.alert('data是空的')
								}
								uni.closeSocket()
								this.endRecordShow = true
								reportClickEvent({
									activityName: '语音识别接口',
									actionRank: 0,
									activityId: 'game_xunbao_audio_click_tell',
									activityContent: that.formData
								})

								reportClickEvent({
									activityName: '语音识别成功',
									actionRank: 0,
									activityId: 'game_xunbao_audio_click_success',
									activityContent: that.formData
								})
								if (data.prizeType == 'kapian') {
									console.log('出弹窗')
									that.$emit('detailCloce', data)
								} else if (data.prizeType == 'jiangli') {
									// that.showRecord = false
									console.log(data.triggerCode, '语音语音语音存入存入存入triggerCode')
									console.log(data, '语音语音语音data')
									tool.storage('triggerCode', data.triggerCode)
									tool.storage('dropPrize', data.dropPrize)
									that.queryAd()
									that.$emit('languageSuccess', data)
									// tool.jump_nav('/pages-game/xunbao/pages-list/advertising/advertising')
									return
								} else if (data.prizeType == 'kong') {
									that.$emit('closeKong')
								} else if (data.prizeType != 'kong') {
									that.close()
									reportClickEvent({
										activityName: '语言获得奖品',
										actionRank: 0,
										activityId: 'game_xunbao_audio_click_prize',
										activityContent: data
									})
								}

								// that.prizeDetail = data;
								// setTimeout(() => {
								// 	that.showPrize = true;
								// }, 200)
								// if (data.prizeType != 'kong')
								// else {
								// 	that.noPrize = true
								// }
							})
							.catch((err) => {
								console.log(err, 'errrrrrrrrrrrrrrrrrrrr')
								uni.closeSocket()
								let {
									code,
									message
								} = err
								if (code == 10007 || code == 1002) {
									that.code = 10007
									that.sayData = ''
									that.adText = '识别失败，再来一次'
									return
								}
								if (code == 500) return tool.alert(message)
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
	.head {
		width: 200rpx;
		height: 78rpx;
		margin-bottom: -30rpx;
	}

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
		font-size: 38rpx;
		color: #ffffff;
		position: absolute;
		left: 114rpx;
		top: 174rpx;
	}

	.voice {
		width: 96rpx;
		height: 70rpx;
		position: absolute;
		left: 256rpx;
		top: 356rpx;

		opacity: 0;
	}

	.record-btn {
		width: 314rpx;
		height: 283rpx;
	}

	.btn-img {
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.mike {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: -4px;
		opacity: 0;
		// transform:	tranxlateX(-50%);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
