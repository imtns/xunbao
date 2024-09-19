<template>
	<view class="codes">
		<view class="codesceng">
			<view class="award1" @click="fhui">
				<!-- <image :src="`${ASSETSURL}ad_18.png`"></image> -->
				<!-- <u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar> -->
				<!-- <image :src='base64' style="position: fixed;bottom: 0;width: 100vw;z-index: 9999;" class="addd12" mode="widthFix"></image> -->
				<!-- <image src='https://cdn.vrupup.com/s/116/ad_2.png' style="position: fixed;bottom: 0;width: 100vw;z-index: 9999;" class="addd12" mode="widthFix"></image> -->
				<view class="camera">
					<camera device-position="back" flash="off" binderror="error" frame-size="small">
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
					<view class="youx_zdao121">扫描任意“嗨体”文字，就能完成任务获取卡片或奖励!</view>
				</view>
			</view>
		</view>
		<dy-prize :show="showPrize" :item="prizeDetail" v-if="code != 10007" @close="showPrize = false,arInit()"
			@getZlyq="showPrize = false,arInit()"></dy-prize>
	</view>
</template>

<script>
	import api from '@/pages-game/xunbao/api/api';
	import tool from '@/pages-game/xunbao/js/tool';
	import upng from './upng/UPNG';
	import dyPrize from "@/pages-game/xunbao/components/dy-prize.vue"
	export default {
		components: {
			dyPrize,
		},
		data() {
			return {
				codes_type: 2, //0 1 2是否扫到内容 提示
				isSend: true,
				src: '',
				operateRecordCode: '',
				imgw: '0px',
				prizeDetail: {},
				showPrize: false,
				imgh: '0px',
				base64: 'https://cdn.vrupup.com/s/116/ad_2.png',
				mengc: 0, //蒙层01
				listener: null,
			};
		},
		onUnload() {
			this.stopCameraListener();
		},
		// 嗨体
		onLoad(e) {
			console.log(e.id);
			if (e.id) {
				this.mengc = 1
				return
			}
			tool.loading('AR始化中');
			this.arInit();

		},
		methods: {
			youx_zdao_xyb() {
				console.log(11);
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
						uni.setStorageSync('todaySignStatus', 1);
						tool.jump_swi("/pages/index/index")
					})
					.catch((err) => {

					});
			},
			clear() {
				this.codes_type = 2;
				this.isSend = true;
				this.arInit();
			},
			base64ToImg(base64) {
				const time = new Date().getTime();
				const imgPath = wx.env.USER_DATA_PATH + '/poster' + time + 'img' + '.png';
				//如果图片字符串不含要清空的前缀,可以不执行下行代码.
				const imageData = base64.replace(/^data:image\/\w+;base64,/, '');
				const fs = wx.getFileSystemManager();
				fs.writeFileSync(imgPath, imageData, 'base64');
				fs.close();

				return imgPath;
			},
			//ar
			arInit() {
				console.log('【监听开始】');
				const context = wx.createCameraContext();
				let index = 0;
				api.preArScan().then(({
					data
				}) => {
					this.operateRecordCode = data.operateRecordCode;
				});
				//监听摄像头
				// tool.alert('智能相机已准备');
				tool.loading_h()
				this.listener = context.onCameraFrame((frame) => {
					index++;
					if (index % 20 == 0 && this.isSend) {
						this.isSend = false;
						let imgUrl = '';
						let pngData = upng.encode([frame.data], frame.width, frame.height, 0);
						let base64 = wx.arrayBufferToBase64(pngData);
						this.base64 = `data:image/png;base64,${base64}`
						//调取AI图片识别接口 
						console.log('请求', this.base64ToImg(base64), this.base64.slice(1, 20));
						let that = this;
						tool.uploadFiles([this.base64ToImg(base64)],
							'https://java.vrupup.com/identify/link/uploadFile').then((res) => {
							console.log('返回', that.operateRecordCode, res);
							// someClickEvent()  全局埋点
							api.arScan({
								operateRecordCode: that.operateRecordCode,
								imgUrl: res[0]
							}).then((res1) => {
								console.log('【识别返回】', res1);
								if (res1.code == 500 || res1.code == 10006) {
									that.codes_type = 0;
								}
								if (res1.code != 200) {} else {
									console.log(111);
									// someClickEvent()  全局埋点
									that.prizeDetail = res1.data;
									that.showPrize = true;
									if (res1.data.prizeType == 'kapian'){
										// someClickEvent()  全局埋点
									}
								}
								that.stopCameraListener();
							}).catch((err) => {
								that.stopCameraListener();
								console.log(err, '‘err173');
								that.codes_type = 0;
							});
						});
					}
				});
				this.listener.start();
			},
			stopCameraListener() {
				if (this.listener) {
					this.listener.stop();
					this.isSend = true;
					console.log('【监听停止】');
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
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
				color: #0A0909;
				line-height: 40rpx;

				text {
					color: #FC7800;
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
		top: 262rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 566rpx;
		height: 645rpx;
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
		width: 566rpx;
		height: 645rpx;
	}

	.codes {
		background: url('https://cdn.vrupup.com/s/116/codes1.png') no-repeat;
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