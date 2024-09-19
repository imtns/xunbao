<template>
	<view class="advertising">
		<view class="advertisingceng">
			<!-- <view class="award1" @click="fhui">
				<image :src="`${ASSETSURL}ad_18.png`"></image>
				<u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar>
			</view> -->
			<view class="advertising1 oh" :class="'isUs' + dq_claas_i">
				<view class="advertising10 le">
					<u-line-progress :showText="false" :percentage="percentage" activeColor="#fea500" :height="15"></u-line-progress>
				</view>
				<view class="advertising11 le">
					<image :src="`${ASSETSURL}advertising2.png`"></image>
				</view>
			</view>
			<view class="advertising2">
				<view class="advertising21">
					<!-- @play="add" -->
					<video :src="video" :autoplay="true" :muted="false"></video>
				</view>
				<view class="advertising22" v-show="time == 0"> 完成 </view>
				<view class="advertising22" v-show="time > 0"> {{ time }}s </view>
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
						<view class="advertising421 le" @click="close">
							<image :src="`${ASSETSURL}advertising6.png`"></image>
						</view>
					</view>
				</view>

				<view class="advertising4" v-show="type == 1">
					<view class="advertising43">
						<view class="advertising431">
							<image :src="dropPrize.prizeImage" @click="close"></image>
							<!-- <image :src="`${ASSETSURL}advertising7.png`" @click="close"></image> -->
						</view>
						<view class="advertising432">
							<button type="primary" open-type="share" style="background: none; border: none; border-radius: 0; line-height: 0">
								<image :src="`${ASSETSURL}advertising8.png`" @click="cs_fx"></image>
							</button>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
import api from '@/pages-game/xunbao/api/api'
import tool from '@/pages-game/xunbao/js/tool'
import { reportClickEvent, reportExposeEvent } from '@/utils/report/report'
export default {
	data() {
		return {
			isUseShare: true,
			time: 15,
			type: 2, //0提示  1最后一步
			show: false,
			video: null,
			percentage: 1,
			triggerCode: uni.getStorageSync('triggerCode'),

			// dropPrize: uni.getStorageSync('dropPrize'), //jiangli 信息
			dropPrize: {
				prizeName: '方法收纳盒的师傅',
				prizeImage: 'https://cdn.vrupup.com/s/116/advertising7.png'
			},
			dsq: null,
			jiangp_list: [
				{
					prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp1.png',
					prizeName: '收纳盒'
				},
				{
					prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp2.png',
					prizeName: '钥匙扣'
				},
				{
					prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp3.png',
					prizeName: '光板'
				},
				{
					prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp4.png',
					prizeName: '贴纸'
				}
			], //奖品合计
			dq_prizeImage: null, //当前奖品图片
			dq_claas_i: 1, //当前奖品索引
			shareCode2: null, //看完视频的code
			isUseShare: true
		}
	},
	onShareAppMessage() {
		this.shareWithFriends()
		console.log('分享标题分享标题分享标题')
		reportClickEvent({ activityName: '用户完成分享任务的次数', actionRank: 0, activityId: 'game_xunbao_video_click_share', activityContent: {} })
		return {
			title: '分享标题',
			path: '/pages-game/xunbao/pages-list/advertising/advertising',
			success: function (res) {
				// 转发成功
				console.log('转发成功')
			},
			fail: function (res) {
				// 转发失败
				console.log('转发失败')
			}
		}
	},
	onLoad() {
		this.add()
		this.queryVideo()
		wx.showShareMenu({
			menus: ['shareAppMessage', 'shareTimeline'] //'shareAppMessage'打开分享好友功能 | 'shareTimeline'打开分享到朋友圈功能
		})
	},

	//分享朋友圈
	onShareTimeline(res) {
		return {
			title: '分享到朋友圈', //分享的标题
			imageUrl: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp1.png', //展示的图片，这里是本地路径的写法，也可以写http或https开头的图片路径
			query: 'from=shareTimeline' //页面打开的传参
		}
	},
	onShow() {
		this.dropPrize.prizeName = '方法贴纸的师傅'
		for (var i = 0; i < this.jiangp_list.length; i++) {
			if (this.dropPrize.prizeName.includes(this.jiangp_list[i].prizeName)) {
				this.dq_prizeImage = this.jiangp_list[i].prizeImage
				console.log(i, this.jiangp_list[i].prizeName)
				this.dq_claas_i = i
			}
		}
	},
	onUnload() {
		clearInterval(this.dsq)
	},
	methods: {
		cs_fx() {
			console.log('uni-app_pyq分享')
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneTimeline',
				type: 0,
				href: 'http://uniapp.dcloud.io/',
				title: 'uni-app分享',
				summary: '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！',
				imageUrl: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni@2x.png',
				success: function (res) {
					console.log('success:' + JSON.stringify(res))
				},
				fail: function (err) {
					console.log('fail:' + JSON.stringify(err))
				}
			})
		},
		// 分享朋友圈
		shareWithFriends() {
			console.log('分享朋友圈0', this.time)
			if (this.time > 1) return
			console.log('分享朋友圈1', this.time)
			api.shareWithFriends({
				watchVideoCode: this.shareCode2
			})
				.then((res) => {
					console.log(res.data)
				})
				.catch((err) => {})
		},
		close1() {
			tool.jump_back()
		},
		fhui() {
			if (this.time > 0) {
				this.show = true
				this.type = 0
			} else {
				clearInterval(this.dsq)
				tool.jump_back()
			}
		},
		watchVideo() {
			api.watchVideo({
				triggerCode: this.triggerCode
			})
				.then((res) => {
					console.log(res.data, '’167')
					this.show = true
					this.type = 1
					// tool.alert(res.message)
					this.shareCode2 = res.data.watchVideoCode
					store.commit('storeShareCode2', res.data.watchVideoCode)
				})
				.catch((err) => {})
		},
		//cx分享视频
		queryVideo() {
			api.queryVideo()
				.then((res) => {
					console.log(res.data)
					this.video = res.data
					// this.add()
				})
				.catch((err) => {})
		},
		open() {
			// console.log('open');
		},
		close() {
			this.show = false
			// console.log('close');
		},
		add() {
			this.dsq = setInterval(() => {
				this.time--
				this.percentage = this.percentage + 6.6
				if (this.time <= 0) {
					reportClickEvent({ activityName: '完成视频观看', actionRank: 0, activityId: 'game_xunbao_video_click_look', activityContent: {} })
					clearInterval(this.dsq)
					this.watchVideo()
				}
			}, 1000)
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
				height: 60rpx;
				width: 312rpx;
				position: absolute;
				right: 92px;
				top: 70rpx;
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
			margin-top: 44rpx;
			position: relative;
			z-index: 999;
			border-radius: 20rpx;

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
					image {
						width: 750rpx;
						height: 1036rpx;
					}
				}

				.advertising432 {
					position: absolute;
					top: 750rpx;
					right: 113rpx;

					image {
						width: 316rpx;
						height: 85rpx;
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
