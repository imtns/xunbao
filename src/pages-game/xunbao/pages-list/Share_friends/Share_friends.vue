<template>
	<view class="Share" v-show="isFect && Share_type >= 0">
		<view class="effect" style="width: 100vw; height: 100vh; position: absolute; left: 0; top: 0">
			<sequenceEffect ref="showfect" :sequenceList="starList" @loadOk="loadOk"></sequenceEffect>
			<view class="Share6 Share3 tc" v-if="Share_type == 1" @click="$u.throttle(getHome, 2000)">
				<image mode="widthFix" :src="`${ASSETSURL}shouXKP.png`"></image>
			</view>
			<view class="Share6 Share3 tc" v-if="Share_type >= 0 &&  Share_type != 2 && Share_type != 1"
				@click="$u.throttle(getHome, 2000)">
				<image mode="widthFix" :src="`${ASSETSURL}Share3.png`"></image>
			</view>
		</view>
		<view style="position: relative; z-index: 33">
			<view v-if="Share_type == 0" style="text-align: center;margin-top: -110rpx;">
				<view class="Share4 tc">
					<image mode="" :src="`${ASSETSURL}Share4.png`"></image>
				</view>
			</view>

			<view v-if="Share_type == 1" style="text-align: center">
				<view class="Share1 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share1.png`"></image>
				</view>
				<view class="Share1_1">感谢你的帮助!为你送<text>{{ type }}</text>，收集卡片合成大奖，还有丰富的笑励随机掉落，和我一起加入爱美客扫码寻宝活动吧!</view>
				<view class="Share2 tc" v-if="type == '全身宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/qs.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '营养宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/yy.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '性价比宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/xjb.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '百搭宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/bd1.png`"></image>
				</view>
			</view>

			<view v-if="Share_type == 2" style="margin-top: 65rpx; text-align: center">
				<view class="Share1 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share1.png`"></image>
				</view>
				<view class="Share1_1">送你一张<text>{{ type }}</text>，赶快点击<text>收下</text>集齐4张卡片就可以获得宝藏唱片音响1份还有更多隐藏奖励等你挖掘！
				</view>
				<view class="Share2 tc" v-if="type == '全身宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/qs.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '营养宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/yy.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '性价比宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/xjb.png`"></image>
				</view>
				<view class="Share2 tc" v-if="type == '百搭宝藏卡'">
					<image mode="widthFix" :src="`${ASSETSURL}img/bd1.png`"></image>
				</view>
				<view class="Share2_1 tc">
					<u-count-down :time="rateDate.leftTime" format="HH:mm:ss" autoStart millisecond @change="onChange">
						<view class="time">
							<view class="time__custom">
								<text
									class="time__custom__item">{{ timeData.hours >= 10 ? timeData.hours : '0' + timeData.hours }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text
									class="time__custom__item">{{ timeData.minutes >= 10 ? timeData.minutes : '0' + timeData.minutes }}</text>
							</view>
							<text class="time__doc">:</text>
							<view class="time__custom">
								<text
									class="time__custom__item">{{ timeData.seconds >= 10 ? timeData.seconds : '0' + timeData.seconds }}</text>
							</view>
						</view>
					</u-count-down>
				</view>
				<view class="Share3 tc" @click="$u.throttle(Share3, 2000)">
					<image mode="widthFix" :src="`${ASSETSURL}Share5.png`"></image>
				</view>
			</view>
			<view v-if="Share_type == 3" style="text-align: center">
				<view class="Share5 tc">
					<image mode="widthFix" :src="`${ASSETSURL}Share6.png`"></image>
				</view>
			</view>
			<view v-if="Share_type == 4" style="text-align: center;margin-top: -110rpx;">
				<view class="Share4 tc">
					<image mode="" :src="`${ASSETSURL}/img/kPSX.png`"></image>
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
				isFect: false, //加载
				Share_type: -1, //0 卡片被收下 1 参与活动  2 收下 3 你不是新用户无法助力 4 卡片失效
				timeData: {},
				shareCode: null,
				type: null,
				operateCode: null, //卡片 operateCode
				rateDate: {}, // 查询卡详情
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
			console.log(ope, '--------分享页面onLoadonLoadonLoadpeopeopeope-----')
			if (ope) {
				tool.storage('opeDate', ope)
			}
			// this.$nextTick(() => {
			// 	setTimeout(() => {
			// 		this.getUserInfo()
			// 		if (!this.isLogin) {
			// 			reportClickEvent({
			// 				activityName: '好友分享页跳转登录',
			// 				actionRank: 0,
			// 				activityId: 'game_xunbao_share_click_login',
			// 				activityContent: {}
			// 			})
			// 			return tool.jump_nav('/pages-sub/login/index')
			// 		}
			// 		console.log(ope)
			// 		if (ope.shareCode) {
			// 			this.shareCode = ope.shareCode
			// 			// tool.alert(ope.shareCode + '我是分享过来的code')
			// 			this.getJoinActivity(ope.shareCode)
			// 		}
			// 		if (ope.shareCode1) {
			// 			console.log(222)
			// 			this.operateCode = ope.shareCode1
			// 			this.shareCode = ope.shareCode
			// 			this.htxb_cardDetail(ope.shareCode1)
			// 		}
			// 	}, 500)
			// })
		},
		onShow() {
			let ope = tool.storage('opeDate')
			console.log(ope, '--------分享页面onShowonShowonShowopeopeopeope-----')
			if (ope) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.getUserInfo()
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
							this.operateCode = ope.shareCode1
							this.shareCode = ope.shareCode
							this.htxb_cardDetail(ope.shareCode1)
						}
						tool.storage('#opeDate')
					}, 500)
				})
			}
		},
		methods: {
			//查询用户信息
			getUserInfo() {
				api.getUserInfo().then((res) => {
					console.log(res, '-------查询用户信息-------')
					if (res.code === 200) {
						if (res.data.newUserFlag == 1) {
							this.Share_type = 3
						}
					}
				}).catch((err) => {
					console.log(err, '------errerrerr-------')
				})
			},
			loadOk() {
				console.log('加载完成')
				this.$refs.showfect.play()
				this.isFect = true
			},
			// 查询卡详情
			htxb_cardDetail(e) {
				api.htxb_cardDetail({
					operateCode: e
				}).then((res) => {
					console.log(res, '-------查询卡详情查询卡详情------')
					// 检查API调用是否成功
					if (res.code === 200) {
						this.Share_type = 2
						this.rateDate = res.data
						switch (res.data.cardType) {
							case 'qs_card':
								this.type = '全身宝藏卡';
								break;
							case 'yy_card':
								this.type = '营养宝藏卡';
								break;
							case 'xjb_card':
								this.type = '性价比宝藏卡';
								break;
							case 'bd_card':
								this.type = '百搭宝藏卡';
								break;
							default:
								// 处理未知卡类型
								this.type = '未知类型';
								break;
						}
						console.log(this.type, res.data)
					}
				}).catch((err) => {
					console.log(err, '------errerrerr------errerr-')
					if (err.code == 10005) {
						this.Share_type = 0
						console.log(this.Share_type, '-------10005--查询卡详情查询卡详情------')
					} else if (err.code == 10009) {
						this.Share_type = 4
						// tool.alert('分享链接已失效')
					}
				})
			},
			// 收卡
			Share3() {
				tool.loading('收卡中')
				api.htxb_acceptCard({
						operateCode: this.operateCode
					})
					.then((res) => {
						console.log(res, '-------------')
						tool.alert(res.message)
						if ((res.code == 200)) {
							reportClickEvent({
								activityName: '收卡的次数',
								actionRank: 0,
								activityId: 'game_xunbao_share_click_success',
								activityContent: {
									name:this.type
								}
							})
							tool.alert('收卡成功')
							tool.loading_h()
							setTimeout(() => {
								tool.jump_red('/pages-game/xunbao/index')
							}, 1000)
						}
					})
					.catch((err) => {
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
					})
					.then((res) => {
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
								switch (res.data.card.cardType) {
									case 'qs_card':
										this.type = '全身宝藏卡';
										break;
									case 'yy_card':
										this.type = '营养宝藏卡';
										break;
									case 'xjb_card':
										this.type = '性价比宝藏卡';
										break;
									case 'bd_card':
										this.type = '百搭宝藏卡';
										break;
									default:
										// 处理未知卡类型
										this.type = '未知类型';
										break;
								}
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
					})
					.catch((err) => {
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
				width: 400rpx;
				height: 500rpx;
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

	.Share6 {
		position: absolute;
		left: 50%;
		bottom: 200rpx;
		z-index: 999;
		transform: translateX(-50%);
	}
</style>