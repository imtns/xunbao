<template>
	<view class="Share">
		<view class="effect" style="width: 100vw; height: 100vh; position: absolute; left: 0; top: 0">
			<sequenceEffect ref="showfect" :sequenceList="starList" @loadOk="loadOk"></sequenceEffect>
		</view>
		<view style="position: relative; z-index: 33">
			<!-- <view class="award1" @click="getHome">
				<image src="https://cdn.vrupup.com/s/116/ad_18.png"></image>
				<!-- <u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar> --
			</view> -->

			<view v-if="Share_type == 0" style="text-align: center;">
				<view class="Share4 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share4.png`"></image>
				</view>
			</view>

			<view v-if="Share_type == 1" style="text-align: center;">
				<view class="Share1 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share1.png`"></image>
				</view>
				<view class="Share1_1">感谢你的帮助！为你送上一张卡片/奖 励，收集卡片合成大奖，还有丰富的奖 励随机掉落，和我一起加入爱美客扫码 寻宝活动吧！</view>
				<view class="Share2 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share2.png`"></image>
				</view>
				<view class="Share3 tc" @click="getHome">
					<image mode="widthFix" :src="`${ASSETSURL}Share3.png`"></image>
				</view>
			</view>

			<view v-if="Share_type == 2" style="margin-top: 65rpx;text-align: center;">
				<view class="Share1 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share1.png`"></image>
				</view>
				<view class="Share1_1">送你一张<text>{{ type }}</text>，赶快点击<text>收下</text>集齐 4张卡片就可以获得宝藏唱片音响1份还有 更多隐藏奖励等你挖掘！
				</view>
				<view class="Share2 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share2.png`"></image>
				</view>
				<view class="Share2_1 tc">
					<u-count-down :time="30 * 60 * 60 * 1000" format="HH:mm:ss" autoStart millisecond
						@change="onChange">
						<view class="time">
							<view class="time__custom">
								<text
									class="time__custom__item">{{ timeData.hours > 10 ? timeData.hours : '0' + timeData.hours }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.minutes }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text class="time__custom__item">{{ timeData.seconds }}</text>
							</view>
						</view>
					</u-count-down>
				</view>
				<view class="Share3 tc" @click="Share3">
					<image mode="widthFix" :src="`${ASSETSURL}Share5.png`"></image>
				</view>
			</view>
			<view v-if="Share_type == 3" style="text-align: center;">
				<view class="Share5 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share6.png`"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	import {
		mapState
	} from 'vuex'
	import sequenceEffect from '@/pages-game/xunbao/components/sequenceEffect/sequenceEffect.vue'
	export default {
		components: {
			...mapState(['isLogin', 'userInfo']),
			sequenceEffect
		},
		data() {
			return {
				Share_type: 2, //0 卡片被收下 1 参与活动  2 收下 3 你不是新用户无法助力
				timeData: {},
				shareCode: null,
				type: null,
				operateCode: null, //卡片 operateCode
				starList: {
					url: `https://cdn.vrupup.com/s/116/fxhy/1.png`,
					num: 15,
					initIndex: 1,
					speed: 68,
					loop: true,
					autoplay: true
				}
			}
		},
		onLoad(ope) {
			console.log(ope, '--------opeopeopeope-----')
			if (!this.isLogin) {
				reportClickEvent({
					activityName: '好友分享页跳转登录',
					actionRank: 0,
					activityId: 'game_xunbao_share_click_login',
					activityContent: {}
				})
				return tool.jump_nav('/pages-sub/login/index')
			}
			console.log(ope)
			if (ope.shareCode) {
				this.shareCode = ope.shareCode
				// tool.alert(ope.shareCode + '我是分享过来的code')
				this.getJoinActivity(ope.shareCode)
			}
			if (ope.shareCode1) {
				console.log(222)
				this.operateCode = ope.shareCode1
				this.shareCode = ope.shareCode
				this.htxb_cardDetail(ope.shareCode1)
			}
		},
		methods: {
			loadOk() {
				this.$refs.showfect.play()
			},
			// 查询卡详情
			htxb_cardDetail(e) {
				api.htxb_cardDetail({
					operateCode: e
				}).then((res) => {
					console.log(res, '-------------')
					if ((res.code == 200)) {
						this.Share_type = 2
						if (res.data.cardType == 'qs_card') {
							this.type = '全身宝藏卡'
						} else if (res.data.cardType == 'yy_card') {
							this.type = '营养宝藏卡'
						} else if (res.data.cardType == 'xjb_card') {
							this.type = '性价比宝藏卡'
						} else if (res.data.cardType == 'bd_card') {
							this.type = '百搭宝藏卡'
						}
						console.log(this.type, res.data)
					} else if (res.code == 10005) {
						this.Share_type = 0
					} else if (res.code == 10009) {
						this.Share_type = 2
						tool.alert('分享链接已失效')
					}
				})
			},
			// 收卡
			Share3() {
				api.htxb_acceptCard({
					operateCode: this.operateCode
				}).then((res) => {
					console.log(res, '-------------')
					tool.alert(res.message)
					if ((res.code = 200)) {
						reportClickEvent({
							activityName: '用户通过分享活动任务获得卡片奖励的数量',
							actionRank: 0,
							activityId: 'game_xunbao_share_click_success',
							activityContent: {}
						})
						tool.alert('收卡成功')
						setTimeout(() => {
							tool.jump_red('/pages-game/xunbao/index')
						}, 1000)
					}
				}).catch((err) => {
					console.log(err, '-------------')
					tool.alert(err.message)
				})
			},
			//跳转首页
			getHome() {
				reportClickEvent({
					activityName: '参与活动',
					actionRank: 0,
					activityId: 'game_xunbao_share_click_getHome',
					activityContent: {}
				})
				tool.jump_red('/pages-game/xunbao/index')
			},
			//核销分享code
			getJoinActivity(code) {
				console.log(code, '-----分享code分享code分享code分享code-')
				api.joinActivity({
					shareCode: code
				}).then((res) => {
					console.log(res, '-----核销分享-')
					if ((res.code = 200)) {
						// tool.alert(res.message)
						let include = res.message.includes('不是新用户')
						if (include) {
							this.Share_type = 3
							reportClickEvent({
								activityName: '好友主力失败',
								actionRank: 0,
								activityId: 'game_xunbao_share_click_error',
								activityContent: {
									shareCode: code
								}
							})
						} else {
							this.Share_type = 1
							reportClickEvent({
								activityName: '好友主力成功',
								actionRank: 0,
								activityId: 'game_xunbao_share_click_success',
								activityContent: {
									shareCode: code
								}
							})
						}
					}
				}).catch((err) => {
					if (err.code == 10002) {
						console.log(err, '-----errerrerrerr-')
						this.Share_type = 3
					}
				})
			},
			onChange(e) {
				this.timeData = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	.effect {
		::v-deep .currency {
			image {
				top: 50% !important;
			}
		}
	}

	.Share {
		// background: url("https://cdn.vrupup.com/s/116/Share_bj.png") no-repeat #fea500;
		// background-size: 100% 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;

		.award1 {
			position: relative;
			box-sizing: border-box;

			image {
				height: 52rpx;
				width: 52rpx;
				position: absolute;
				top: 10rpx;
				left: 36rpx;
			}
		}

		.Share1 {
			padding-top: 50rpx;

			image {
				width: 541rpx;
				height: 177rpx;
			}
		}

		.Share1_1 {
			font-family: Alibaba PuHuiTi;
			font-weight: 500;
			font-size: 25rpx;
			color: #000000;
			line-height: 33rpx;
			position: absolute;
			width: 500rpx;
			left: 136rpx;
			top: 90rpx;

			text {
				color: #fea500;
			}
		}

		.Share2 {
			margin: 138rpx 0 212rpx 0;

			image {
				width: 372rpx;
				height: 553rpx;
			}
		}

		.Share2_1 {
			position: absolute;
			left: 50%;
			bottom: 250rpx;
			transform: translateX(-50%);
		}

		.Share3 {
			image {
				width: 283rpx;
				height: 85rpx;
			}
		}

		.Share4 {
			padding-top: 522rpx;

			image {
				width: 538rpx;
				height: 303rpx;
			}
		}

		.Share5 {
			padding-top: 522rpx;
			text-align: center;

			image {
				width: 377rpx;
				height: 377rpx;
			}
		}
	}
</style>
<style lang="scss">
	.time {
		@include flex;
		align-items: center;

		&__custom {
			margin-top: 8rpx;
			width: 45rpx;
			height: 46rpx;
			background-color: none;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #ffe3a0;
			border-radius: 7rpx;
			border: 2rpx solid #000000;

			&__item {
				color: #fff;
				text-align: center;

				font-family: Alibaba PuHuiTi;
				font-weight: 500;
				font-size: 26rpx;
				color: #000000;
				line-height: 29rpx;
			}
		}

		&__doc {
			color: #000000;
			padding: 0px 8rpx;
		}

		&__item {
			color: #606266;
			font-size: 30rpx;
			margin-right: 8rpx;
		}
	}
</style>