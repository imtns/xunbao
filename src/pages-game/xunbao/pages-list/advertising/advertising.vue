<template>
	<view class="advertising">
		<view class="advertisingceng">
			<!-- <view class="award1" @click="fhui">
				<image :src="`${ASSETSURL}ad_18.png`"></image>
				<u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar>
			</view> -->
			<u-navbar @leftClick="fhui" class="custom-navbar" title="观看视频" fixed safeAreaInsetTop bgColor="#FFF"
				height="88rpx" placeholder></u-navbar>
			<view class="advertising1 oh" :class="'isUs' + dq_claas_i">
				<view class="advertising10 le">
					<u-line-progress :round="false" :showText="false" :percentage="percentage" inactiveColor="#CECECE"
						activeColor="#FA7700" :height="15"></u-line-progress>
					<view :style="{ left: percentage + '%' }" class="pro-circle"></view>
				</view>
				<view class="advertising11 le">
					<image :src="`${ASSETSURL}advertising2.png`"></image>
				</view>
			</view>
			<view class="advertising2">
				<view class="advertising21">
					<video id="myVideo" :src="video" :enable-progress-gesture="false" :controls="false" :autoplay="true"
						:muted="false" @pause="pause" @ended="ended" @timeupdate="timeupdate"></video>
				</view>
				<view class="advertising22" v-show="time <= 0"> 完成 </view>
				<view class="advertising22" v-show="time > 0">{{ time }}s </view>
			</view>
			<view class="advertising3 tc">
				<image :src="`${ASSETSURL}advertising3.png`"></image>
			</view>

			<u-popup :show="show" mode="center" @close="close" @open="open">
				<view class="advertising4" v-show="type == 0">
					<view class="advertising41">
						<image :src="`${ASSETSURL}advertising4.png`"></image>
					</view>
					<view class="advertising42 oh">
						<view class="advertising421 le" @click="close1">
							<image :src="`${ASSETSURL}advertising5.png`"></image>
						</view>
						<view class="advertising421 le" @click="show = false,videoContext.play()">
							<image :src="`${ASSETSURL}advertising6.png`"></image>
						</view>
					</view>
				</view>

				<view class="advertising4" v-show="type == 1">
					<view class="advertising43">
						<view class="advertising431" style="margin-top: 100rpx">
							<!-- <image :src="`${ASSETSURL}img/zhiYing.png`"
								style="position: absolute;top: 200rpx;right: 120rpx;width: 445rpx; height: 379rpx;"></image> -->
							<image :src="`${ASSETSURL}img/fx${dq_claas_i + 1}.png`"></image>
							<!-- <image :src="`${ASSETSURL}advertising7.png`" @click="close"></image> -->
							<view class="advertising432" @click="openPyqPupup">
								<!-- <button type="primary" open-type="share" style="background: none; border: none; border-radius: 0; line-height: 0"> -->
								<image :src="`${ASSETSURL}advertising8.png`"></image>
								<!-- </button> -->
							</view>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 朋友圈弹窗 -->
			<u-popup :show="showPyq" mode="center">
				<view class="pyq-pop pof haze" @click="openPyqPupup">
					<image :src="`${ASSETSURL}img/zhiYing.png`"
						style="position: absolute; top: 200rpx; right: 120rpx; width: 480rpx" mode="widthFix"></image>
				</view>
			</u-popup>
		</view>
		<view style="margin-top: -100rpx">
			<shareAndDrop v-if="shareAndDropShow" :addressDate="addressDate" :show="shareAndDropShow"
				@close="shareAndDropShow = false" @selectAddress="selectAddress" @saveAddressInfo2="saveAddressInfo2" />
		</view>
		<!-- 获取奖品弹窗 -->
		<u-popup :show="showPrizeTips" mode="center" overlayOpacity="0.7">
			<prizeTips :showPrizeType="showPrizeType" @closePrizePup="closePrizePup" @jumpNext="jumpNext"></prizeTips>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/pages-game/xunbao/api/api';
	import tool from '@/pages-game/xunbao/js/tool';
	import util from '@/pages-game/xunbao/js/util';
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	import shareAndDrop from '@/pages-game/xunbao/components/shareAndDrop/shareAndDrop.vue'
	import prizeTips from '@/pages-game/xunbao/components/prize-tips/prize-tips.vue'
	import store from '../../../../store/index.js'
	export default {
		components: {
			shareAndDrop,
			prizeTips
		},
		watch: {
			time(newValue, oldValue) {
				if (this.unpDate) {
					if (newValue <= 0) {
						console.log('watch监听到15秒了')
						this.watchVideo2()
						this.unpDate = false
					}
				}
			}
		},
		data() {
			return {
				videoContext: null, //视频dom
				videoDuration: -1, //视频总时长
				showPrizeTips: false, //奖品弹窗
				showPrizeType: 0, //当前中奖图片索引//1-4
				showPyq: false, //朋友圈弹窗
				shareAndDropShow: false, //显示隐藏收货地址
				addressDate: {}, //地址数据
				isUseShare: true,
				maxTime: -1, //视频最大时间
				time: '--',
				type: 2, //0提示  1最后一步
				show: false,
				video: null,
				// percentage: 1,
				triggerCode: tool.storage('triggerCode'),
				// dropPrize: uni.getStorageSync('dropPrize'), //jiangli 信息
				// dropPrize: {
				// 	prizeName: '方法收纳盒的师傅',
				// 	prizeImage: 'https://cdn.vrupup.com/s/116/advertising7.png'
				// },
				dsq: null,
				jiangp_list: [{
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp1.png',
						prizeName: '收纳盒',
					},
					{
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp2.png',
						prizeName: '钥匙扣',
					},
					{
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp3.png',
						prizeName: '光板',
					},
					{
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp4.png',
						prizeName: '贴纸',
					},
				], //奖品合计
				dq_prizeImage: null, //当前奖品图片
				dq_claas_i: null, //当前奖品索引
				shareCode2: null, //看完视频的code
				isUseShare: true,
				sharepro: 0, //分享进度
				shareDate: null, //分享后的奖品数据
				addressDate: {}, //地址详情
				addressId: null, //获取地址
				unpDate: true, //15后只触发一次
				_currentTime: -1, //视频播放当前秒（整数）
				_currentTime2: -1 //视频播放当前秒（小数）
			}
		},
		onShareAppMessage() {
			this.shareWithFriends()
			console.log('分享标题分享标题分享标题');
			return {
				title: '嗨体喊你一起探索真皮层宝藏啦！', //分享的标题
				path: `pages-game/xunbao/index`,
				imageUrl: 'https://cdn.vrupup.com/s/116/img/fxTup.png', //展示的图片，这里是本地路径的写法，也可以写http或https开头的图片路径
				query: 'id=1154', //页面打开的传参
				success: function(res) {
					// 转发成功
					console.log("转发成功");
				},
				fail: function(res) {
					// 转发失败
					console.log("转发失败");
				}
			}
		},
		onLoad(ope) {
			if (ope.id) {
				util.determineTheSceneJump(ope.id, 1154, '/pages-game/xunbao/index')
			}
			// this.play()
			this.queryVideo()
			wx.showShareMenu({
				menus: ['shareAppMessage',
					'shareTimeline'
				], //'shareAppMessage'打开分享好友功能 | 'shareTimeline'打开分享到朋友圈功能
			});
		},
		//分享朋友圈
		onShareTimeline(res) {
			this.shareWithFriends()
			return {
				title: '嗨体喊你一起探索真皮层宝藏啦！', //分享的标题
				imageUrl: 'https://cdn.vrupup.com/s/116/img/fxTup.png', //展示的图片，这里是本地路径的写法，也可以写http或https开头的图片路径
				query: 'id=1154', //页面打开的传参
			}
		},
		onShow() {
			if (tool.storage('completeVideoPrize')) {
				setTimeout(() => {
					tool.storage('#completeVideoPrize')
					tool.jump_back()
				}, 0)
			}
			// setInterval(() => {
			// 	console.log("当前秒", this._currentTime, this._currentTime2)
			// }, 2000)
			let dropPrize = tool.storage('dropPrize')
			console.log(dropPrize, 'dropPrizedropPrizedropPrizedropPrize')
			for (var i = 0; i < this.jiangp_list.length; i++) {
				if (dropPrize.prizeName.includes(this.jiangp_list[i].prizeName)) {
					this.dq_prizeImage = this.jiangp_list[i].prizeImage
					console.log(i, this.jiangp_list[i].prizeName);
					this.dq_claas_i = i
					this.showPrizeType = i + 1
				}
			}
			//获取地址
			console.log("tool.storage('addressId')", tool.storage('addressId'))
			if (tool.storage('addressId')) {
				this.addressId = tool.storage('addressId')
				console.log("this.addressId", this.addressId)
				this.getAddressId(this.addressId)
			}
			// this.getAddressId("1783425478279778305")
			// if (this.shareDate) {
			// 	console.log(this.shareDate, '-----111111-----');
			// 	this.sharepro = 100
			// 	// this.priceImgList.includes(this.shareDate.dropPrize.prizeName)
			// 	let _prizeName = this.priceImgList.filter(item => item.prizeName = this.shareDate.dropPrize.prizeName)
			// 	console.log("_prizeName", _prizeName)
			// 	console.log("_prizeName.prizeImage", _prizeName.prizeImage)
			// 	this.shareAndDropShow = true
			// 	this.show = false
			// }
		},
		onUnload() {
			clearInterval(this.dsq)
			this.videoContext = null
		},
		computed: {
			//当前进度
			percentage() {
				let _time = (15 - this.time) * 50 / 15
				return (_time >= 50 ? 50 : _time) + this.sharepro
			},
			priceImgList() {
				return [{
					prizeName: '宝藏嗨嗨打光板',
					prizeImage: `${this.ASSETSURL}img/daGuanBan.png`
				}, {
					prizeName: '宝藏嗨嗨挂件',
					prizeImage: `${this.ASSETSURL}img/kaiKai.png`
				}, {
					prizeName: '宝藏嗨嗨收纳盒',
					prizeImage: `${this.ASSETSURL}img/shouLaHe.png`
				}, {
					prizeName: '宝藏嗨嗨贴纸',
					prizeImage: `${this.ASSETSURL}img/tieZhi.png`
				}, {
					prizeName: '宝藏嗨嗨钥匙扣',
					prizeImage: `${this.ASSETSURL}img/yaoShiKo.png`
				}, {
					prizeName: '宝藏金条项链',
					prizeImage: `${this.ASSETSURL}img/zuiGao.png`
				}, {
					prizeName: '宝藏唱片音响',
					prizeImage: `${this.ASSETSURL}img/changPianJi.png`
				}]
			}
		},
		methods: {
			//奖品弹窗回调——我再想一想
			closePrizePup() {
				// this.showPrizeTips = false
				tool.jump_back()
			},
			//奖品弹窗回调——跳转去留资
			jumpNext() {
				console.log("跳转去留资跳转去留资跳转去留资跳转去留资")
				tool.storage('completeVideoPrize', 1)
				this.showPrizeTips = false
				tool.jump_nav('/pages-game/xunbao/pages-list/award/award')
			},
			//获取地址详情
			getAddressId(e) {
				console.log("获取地址详情", e)
				api.getAddressDetail(e).then(res => {
					if (res.code == 200) {
						console.log(res, '----获取地址详情----');
						if (this.addressDate != '{}') this.addressDate = res.data
						uni.removeStorageSync("addressId")
					} else {
						tool.alert(res.message)
					}
				})
			},
			//选择地址
			selectAddress() {
				tool.jump_nav('/pages/mine/address/list')
			},
			//保存地址信息
			saveAddressInfo2() {
				console.log('----保存地址信息----');
				if (this.addressDate && !this.addressDate.objectCode) return tool.alert('请选择地址')
				let data = {
					methodName: 'saveAddressInfo2',
					goodsCode: this.shareCode2, //商品编码
					receiveAddressCode: this.addressDate.objectCode
				}
				api.saveAddressInfo(data).then(res => {
					console.log(res, '===保存地址信息=======');
					if (res.code == 200) {
						tool.alert('提交成功')
						// reportClickEvent({
						// 	activityName: '完成留资',
						// 	actionRank: 0,
						// 	activityId: 'game_xunbao_prize_click_leave',
						// 	activityContent: {}
						// })
						this.show = false
						tool.jump_back()
					}
				})
			},
			//打开朋友圈弹窗
			openPyqPupup() {
				console.log("打开朋友圈弹窗")
				this.showPyq = !this.showPyq
			},

			//视频暂停
			pause() {
				// clearInterval(this.dsq)
			},
			cs_fx() {
				console.log('uni-app_pyq分享');
				uni.share({
					provider: "weixin",
					scene: "WXSceneTimeline",
					type: 0,
					href: "http://uniapp.dcloud.io/",
					title: "uni-app分享",
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					imageUrl: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			// 分享朋友圈
			shareWithFriends() {
				let that = this
				if (that.time > 1) return
				api.shareWithFriends({
						watchVideoCode: that.shareCode2
					})
					.then((res) => {
						console.log("分享朋友圈", res.data);
						that.shareDate = res.data
						that.sharepro = 100
						// this.shareAndDropShow = true
						// this.showPyq = false
						that.showPyq = false
						that.show = false
						// that.showPrizeTips = true
						setTimeout(() => {
							console.log("延迟弹出奖品弹窗2", that.showPyq, that.show)
							that.showPrizeTips = true
						}, 200)
					})
					.catch((err) => {

					});
			},
			close1() {
				tool.jump_back()
			},
			fhui() {
				if (this.time > 0) {
					this.$nextTick(() => {
						this.videoContext = uni.createVideoContext('myVideo')
						this.videoContext.pause(); // 暂停视频
					})
					this.show = true
					this.type = 0
				} else {
					clearInterval(this.dsq)
					tool.jump_back()
				}
			},
			//获取分享码
			watchVideo2() {
				let code = tool.storage('triggerCode')
				console.log('看完视频后获取分享码codecode', code);
				api.watchVideo({
						triggerCode: code
					})
					.then((res) => {
						console.log('获取分享码（视频后弹窗）-成功', res.data);
						this.show = true
						this.type = 1
						// tool.alert(res.message)
						this.shareCode2 = res.data.watchVideoCode
						store.commit('storeShareCode2', res.data.watchVideoCode);
					})
					.catch((err) => {
						console.log('获取分享码（视频后弹窗）-失败', err);
					});
			},
			//cx分享视频
			queryVideo() {
				api.queryVideo()
					.then((res) => {
						console.log(res.data);
						this.video = res.data
						// this.play()
					})
					.catch((err) => {

					});
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show = false
				tool.jump_back()
				// console.log('close');
			},
			//视频播放中
			timeupdate(e) {
				let _currentTime = Math.floor(e.detail.currentTime),
					_currentTime2 = e.detail.currentTime
				this.videoDuration = e.detail.duration
				if (this.maxTime == -1) {
					this.maxTime = this.videoDuration >= 15 ? 15 : Math.floor(this.videoDuration)
				}
				console.log("视频播放中2", this.videoDuration, this.maxTime, _currentTime2, (this.videoDuration < 15 &&
					_currentTime2 >= this.videoDuration), (this.videoDuration >= 15 && _currentTime2 >= this
					.maxTime), this.unpDate)
				this._currentTime = _currentTime
				this._currentTime2 = _currentTime2
				this.time = this.maxTime - _currentTime
				let _difference = Math.abs(util.accSub(_currentTime2, this.maxTime))
				console.log('_difference', _difference)
				// this.percentage = (15 - this.time) * 50 / 15
				// if (this.videoDuration >= 15 && _difference <= 0.3 && this.unpDate) {
				// 	this.watchVideo2()
				// 	this.unpDate = false
				// }
			},
			//视频播放完成
			ended() {
				// if (this.videoDuration < 15) {
				// 	this.watchVideo2()
				// 	this.unpDate = false
				// }
				this.time = 0
				// this.watchVideo2()
			},
			//视频播放
			play() {
				// let that = this
				// this.dsq = setInterval(() => {
				// 	this.time--
				// 	console.log(this.time, 'this.timethis.time')
				// 	// this.percentage = (15 - this.time) * 50 / 15
				// 	if (this.time == 0) {
				// 		console.log('播放结束');
				// 		that.watchVideo2()
				// 	}
				// 	if (this.time < -1) {
				// 		clearInterval(this.dsq)
				// 	}
				// }, 1000)
			}
		}
	}
</script>
<style>
	@import '@/pages-game/xunbao/css/base.css';
</style>
<style lang="scss" scoped>
	.advertising {
		background: #fea500;
		background-size: 100% 100%;
		height: 100vh;
		position: relative;
		overflow-x: hidden;

		.advertisingceng {
			.award1 {
				position: relative;

				image {
					height: 52rpx;
					width: 52rpx;
					position: absolute;
					top: 86rpx;
					left: 36rpx;
				}
			}

			.advertising1 {
				background: url('https://cdn.vrupup.com/s/116/advertising_1.png') no-repeat #fea500;
				background-size: 675rpx 161rpx;
				position: relative;
				top: 50rpx;
				height: 200rpx;
				left: 43rpx;

				.advertising10 {
					width: 312rpx;
					position: absolute;
					right: 88px;
					top: 70rpx;

					::v-deep .u-line-progress {
						border: 2rpx solid #000;
					}

					.pro-circle {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						background: #fa7700;
						border: 2rpx solid #000;
						position: absolute;
						top: 50%;
						transform: translateX(-40%) translateY(-50%);
					}
				}

				.advertising11 {
					position: absolute;
					right: 37px;
					top: 15rpx;
				}

				image {
					width: 143rpx;
					height: 138rpx;
				}
			}

			.isUs0 {
				background: url('https://cdn.vrupup.com/s/116/advertising_1.png') no-repeat #fea500;
				background-size: 675rpx 161rpx;
			}

			.isUs1 {
				background: url('https://cdn.vrupup.com/s/116/advertising_2.png') no-repeat #fea500;
				background-size: 675rpx 161rpx;
			}

			.isUs2 {
				background: url('https://cdn.vrupup.com/s/116/advertising_3.png') no-repeat #fea500;
				background-size: 675rpx 161rpx;
			}

			.isUs3 {
				background: url('https://cdn.vrupup.com/s/116/advertising_4.png') no-repeat #fea500;
				background-size: 675rpx 161rpx;
			}

			.advertising2 {
				height: 963rpx;
				width: 660rpx;
				background-color: #393939;
				margin: 0 auto;
				margin-top: 20rpx;
				position: relative;
				z-index: 999;
				border-radius: 20rpx;
				overflow: hidden;

				.advertising22 {
					position: absolute;
					width: 60rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 70rpx;
					right: 10px;
					background: #fff;
					text-align: center;
					font-size: 28rpx;
					font-weight: bold;
					top: 22rpx;
				}
			}

			.advertising3 {
				margin-top: 20rpx;
				height: 200rpx;

				image {
					width: 669rpx;
					height: 200rpx;
				}
			}

			.advertising4 {
				// position: relative;
				// height: 100vh;
				// width: 100vw;
				// top: -95.8vh;
				// background: rgba(0, 0, 0, 0.7);
				// z-index: 9999;

				.advertising41 {
					image {
						width: 623rpx;
						height: 624rpx;
					}
				}

				.advertising42 {
					margin-top: 78rpx;

					.advertising421 {
						margin-right: 42rpx;

						image {
							width: 274rpx;
							height: 95rpx;
						}
					}

					.advertising422 {
						image {
							width: 274rpx;
							height: 95rpx;
						}
					}
				}

				.advertising43 {
					position: relative;

					.advertising431 {
						position: relative;

						image {
							width: 600rpx;
							height: 600rpx;
						}

						.advertising432 {
							position: absolute;
							bottom: 30rpx;
							right: 50rpx;

							image {
								width: 316rpx;
								height: 85rpx;
							}
						}
					}
				}
			}
		}
	}

	video {
		height: 963rpx;
		width: 660rpx;
	}
</style>
<style>
	.advertising .u-popup__content {
		background: none !important;
	}
</style>