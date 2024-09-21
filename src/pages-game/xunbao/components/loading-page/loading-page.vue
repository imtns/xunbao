<template>
	<view class="body pof" :class="{'isOk': isOk}">
		<!-- <view class="flex-cen"> -->
		<view class="loading-box flex-cen-col-ali">
			<image class="loading-img" :src="ASSETSURL + 'song_loading_01.png'" @load="pageProgressStart"></image>
			<view class="pro por">
				<view class="pro-box" :style="{'width': pro + '%'}"></view>
			</view>
			<view class="pro-num">{{pro}}%</view>
		</view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		props: {
			//页面是否加完成
			pageLoadingOk: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isOk: false, //是否加载完毕
				isShow: true, //
				pro: 0, //当前进度值
				speed: 150, //进度条更新速率
			}
		},
		created() {},
		methods: {
			//图标加载完成
			pageProgressStart() {
				this.pageProgress(() => {
					this.isOk = true
					setTimeout(() => {
						this.isShow = false
						this.$emit("loadingOk")
					}, 500)
				})
			},
			//进度条计算
			pageProgress(callback) {
				setTimeout(() => {
					if (this.pageLoadingOk) {
						this.speed = 30
						if (this.pro >= 100) {
							this.speed = 9999
							callback()
						}
					} else if (this.pro == 99) {
						this.speed = 500
					} else if (this.pro == 95) {
						this.speed += 6000
					} else if (this.pro == 90) {
						this.speed += 1200
					} else if (this.pro == 75) {
						this.speed += 500
					} else if (this.pro == 50) {
						this.speed += 150
					}
					if (!this.pageLoadingOk || (this.pageLoadingOk && (this.pro == 99 || this.speed == 30))) {
						if ((!this.pageLoadingOk && this.pro < 99) || (this.pageLoadingOk && (this.pro == 99 || this.speed ==
								30))) this.pro++
						this.pageProgress(callback)
					}
				}, this.speed)
			}
		}
	}
</script>

<style scoped lang="scss">
	.body {
		background: #FEBD01;
		z-index: 9999;
		transition: all .5s;

		&.isOk {
			top: 102%;
		}

		.loading-box {
			width: 100%;
			height: 100%;

			.loading-img {
				width: 212rpx;
				height: 183rpx;
				margin-top: -15vh;
			}

			.pro {
				width: 474rpx;
				height: 36rpx;
				margin-top: 8rpx;
				border: 2rpx solid #000;
				border-radius: 40rpx;
				overflow: hidden;
				.pro-box {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					border-right: 2rpx solid #000;
					border-radius: 36rpx;
					background: #FA7700;
				}
			}

			.pro-num {
				margin-top: 28rpx;
				font-size: 34rpx;
				font-weight: bold;
			}
		}
	}
</style>