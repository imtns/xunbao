<template>
	<view class="codes">
		<x-loading v-if="isSend" text="正在识别..." background="white" />
		<view class="codesceng">
			<view class="award1">
				<!-- <image :src="`${ASSETSURL}ad_18.png`"></image> -->
				<!-- <u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar> -->
				<!-- <image src='https://cdn.vrupup.com/s/116/ad_2.png' style="position: fixed;bottom: 0;width: 100vw;z-index: 9999;" class="addd12" mode="widthFix"></image> -->
				<view class="camera">
					<camera v-if="isShowCamera" device-position="back" flash="off" binderror="error" frame-size="small">
						<image v-if="type == 0" class="cover-image" :src="`${ASSETSURL}ar.png`"></image>
					</camera>
				</view>
			</view>

			<view class="codes1" v-if="codes_type == 0">
				<view class="codes11 tc">
					<image mode="widthFix" :src="`${ASSETSURL}codes2.png`"></image>
				</view>
				<view class="codes12 tc" @click="clear">
					<image mode="widthFix" :src="`${ASSETSURL}codes3.png`"></image>
				</view>
			</view>
		</view>
		<view class="mengc" v-show="mengc == 1" @click="youx_zdao_xyb">
			<view class="youx_zdao1">
				<view class="youx_zdao11" @click="userCompleteNotice">
					<image :src="`${ASSETSURL}image/ad_load2.png`"></image>
				</view>
				<view class="youx_zdao12">
					<image :src="`${ASSETSURL}image/ad_load1.png`"></image>
					<view class="youx_zdao121">请对准扫描的“嗨体“点击“确认”拍照扫描,完成任务获得卡片或奖励!</view>
				</view>
			</view>
		</view>
		<dy-prize ref="dyPrize2" :show="showPrize" :showPrize="showPrize" :item="prizeDetail" v-if="code != 10007"
			@close="showPrize = false" @getZlyq="showPrize = false"></dy-prize>
		<view class="takePhoto flex-cen">
			<image class="btn scale-wave" :src="`${ASSETSURL}image/song_btn_01.png`"
				@click="$u.throttle(takePhoto, 3000)"></image>
		</view>
	</view>
</template>
<style>
	@import '@/pages-game/xunbao/css/base.css';
</style>
<script>
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	import upng from './upng/UPNG'
	import dyPrize from '@/pages-game/xunbao/components/dy-prize.vue'
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	export default {
		components: {
			dyPrize
		},
		data() {
			return {
				context: null, //相机上下文
				isShowCamera: true, //展示相机
				codes_type: 2, //0 1 2是否扫到内容 提示
				isSend: false,
				src: '',
				operateRecordCode: '',
				prizeDetail: {},
				showPrize: false,
				mengc: 0 //蒙层01
			}
		},
		// 嗨体
		onLoad(e) {
			console.log(e.id)
			if (e.id) {
				this.mengc = 1
				return
			}
		},
		onShow() {
			this.getSetting().then(() => {
				this.isShowCamera = true
				this.contextCamera = wx.createCameraContext()
			})
		},
		methods: {
			//查询是否授权
			getSetting() {
				return new Promise((resolve, reject) => {
					console.log('查询授权')
					let that = this
					tool.getSetting('scope.camera').then((res) => {
						console.log(res, '相机授权')
						if (res.status === 0) {
							this.isShowCamera = false
							uni.authorize({
								scope: 'scope.camera',
								success() {
									resolve()
								},
								fail() {
									tool.showModal("访问相机授权", "您拒绝了访问相机授权，点击确认按钮后开启授权").then(
										res => {
											if (res) {
												uni.openSetting({
													success: (res) => {
														if (res.authSetting[
																'scope.camera'] ===
															true) {
															resolve()
														}
													}
												})
											}
										})
								}
							})
						} else if (res.status == 1) {
							resolve()
						}
					})
				})
			},
			youx_zdao_xyb() {
				console.log(11)
				tool.jump_back()
			},
			// 用户完成新手引导
			userCompleteNotice() {
				this.youx_zdao = false
				api.userCompleteNotice()
					.then((res) => {
						uni.showToast({
							title: '完成新手引导',
							icon: 'none'
						})
						uni.setStorageSync('todaySignStatus', 1)
						tool.jump_rel('/pages-game/xunbao/index')
					})
					.catch((err) => {})
			},
			clear() {
				this.codes_type = 2
			},
			takePhoto() {
				api.preArScan({
					methodName: 'takePhoto'
				}).then(({
					data,
					code,
					message
				}) => {
					console.log('返回preArScanpreArScanpreArScan', '++++++++++------------', data)
					if (code == 500) {
						tool.alert(message)
						return
					}
					this.operateRecordCode = data.operateRecordCode
					console.log("🚀 ~ takePhoto ~ operateRecordCode:", this.operateRecordCode)
					reportClickEvent({
						activityName: '允许授权摄像头',
						actionRank: 0,
						activityId: 'game_xunbao_AR_click_auth',
						activityContent: {}
					})
					this.startScan()
				})
			},
			startScan() {
				if (this.isSend) return tool.alert('太快了~')
				this.isSend = true
				if (!this.contextCamera) this.contextCamera = wx.createCameraContext()
				let that = this
				this.contextCamera.takePhoto({
					quality: 'high',
					success: function(res) {
						// tool.loading();
						reportClickEvent({
							activityName: '点击AR拍照',
							actionRank: 0,
							activityId: 'game_xunbao_AR_click_photo',
							activityContent: {}
						})
						tool.uploadFiles([res.tempImagePath],
							'https://java.vrupup.com/identify/link/uploadFile').then((res) => {
							api.arScan({
									operateRecordCode: that.operateRecordCode,
									imgUrl: res[0]
								})
								.then((res1) => {
									console.log('返回arScanarScanarScanarScan', res1,
										'++++++++++------------')
									if (res1.code == 500) {
										tool.alert(res1.message)
										return
									}
									that.isSend = false
									reportClickEvent({
										activityName: 'AR识别接口',
										actionRank: 0,
										activityId: 'game_xunbao_AR_click_tell',
										activityContent: {
											operateRecordCode: that.operateRecordCode,
											imgUrl: res[0]
										}
									})
									reportClickEvent({
										activityName: 'AR扫描成功',
										actionRank: 0,
										activityId: 'game_xunbao_AR_click_success',
										activityContent: {
											operateRecordCode: that.operateRecordCode,
											imgUrl: res[0]
										}
									})
									console.log(111)
									that.prizeDetail = res1.data
									if (res1.data.triggerCode) {
										console.log(res1.data.triggerCode, 'AR扫码存入存入存入triggerCode')
										tool.storage('triggerCode', res1.data.triggerCode)
										tool.storage('dropPrize', res1.data.dropPrize)
									}
									that.showPrize = true
									that.$nextTick(() => {
										if (res1.data.prizeType == 'kapian') {
											that.$refs.dyPrize2.play2()
										}
									})
									if (res1.data.prizeType != 'kong') {
										reportClickEvent({
											activityName: 'AR获得奖品',
											actionRank: 0,
											activityId: 'game_xunbao_AR_click_prize',
											activityContent: res1.data
										})
									}
								})
								.catch((err) => {
									tool.loading_h();
									console.log(err, '‘err173')
									that.isSend = false
									that.codes_type = 0
									console.log(err, err.code == 500,
										'--------errerrerrerrs---------')
									if (err.code == 10010) {
										tool.jump_back()
									}
								})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.takePhoto {
		position: absolute;
		top: 1222rpx;
		left: 0;
		width: 100%;
		z-index: 1;

		.btn {
			width: 283rpx;
			height: 85rpx;
		}
	}

	.youx_zdao1 {
		position: absolute;
		top: 0;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.7);
		width: 100vw;
		height: 100vh;

		.youx_zdao11 {
			position: absolute;
			right: 36rpx;
			top: 33rpx;
			height: 100rpx;
			line-height: 100rpx;
			width: 100rpx;
			text-align: center;

			image {
				width: 84rpx;
				height: 31rpx;
			}
		}

		.youx_zdao12 {
			position: absolute;
			right: 48rpx;
			bottom: 191rpx;

			.youx_zdao121 {
				position: absolute;
				width: 500rpx;
				left: 72rpx;
				top: 226rpx;
				font-family: Alibaba PuHuiTi;
				font-weight: 500;
				font-size: 25rpx;
				color: #0a0909;
				line-height: 40rpx;

				text {
					color: #fc7800;
				}
			}

			image {
				width: 651rpx;
				height: 358rpx;
			}
		}
	}

	.camera {
		position: absolute;
		top: 214rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 652rpx;
		height: 742rpx;
	}

	.camera .cover-image {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	/* background: linear-gradient(135deg,#027c60,#ff903a); */
	.page-body {
		padding-top: 100rpx;
		height: 100%;
		box-sizing: border-box;
	}

	.deviceSwitch {
		margin: 30rpx 0;
		border: 1px solid #333;
		padding: 15rpx;
	}

	camera {
		width: 652rpxs;
		height: 742rpx;
	}

	.codes {
		background: url('https://cdn.vrupup.com/s/116/image/song_bg_01.png') no-repeat;
		background-size: 100%;
		height: 100vh;
		background-color: #f2da72;
		position: relative;

		.codesceng {
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

			.codes1 {
				position: absolute;
				top: 0;
				background: rgba(0, 0, 0, 0.7);
				width: 100vw;
				height: 100vh;
				z-index: 10;

				.codes11 {
					padding-top: 420rpx;
					margin-bottom: 165rpx;

					image {
						width: 436rpx;
						height: 378rpx;
					}
				}

				.codes12 {
					image {
						width: 283rpx;
						height: 85rpx;
					}
				}

				.codes13 {
					padding-top: 420rpx;

					image {
						width: 615rpx;
						height: 384rpx;
					}
				}
			}
		}
	}
</style>