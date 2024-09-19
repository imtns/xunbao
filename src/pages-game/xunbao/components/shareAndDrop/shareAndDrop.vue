<template>
	<view>
		<u-popup :show="show" mode="center" @close="close" @open="open" @click="show = false">
			<view class="award_tanc">
				<view class="award_tanceng">
					<view class="adddd">
						<view class="award_tanc1 oh">
							<view class="le">填写倒计时
							</view>
							<view class="le">{{timeDiff}}</view>
						</view>
						<view class="award_tanc2 oh">
							<view class="award_tanc21 le">
								收货人
							</view>
							<view class="award_tanc22 le">
								<input disabled v-model="addressDate.provinceName" />
							</view>
						</view>
						<view class="award_tanc2 oh">
							<view class="award_tanc21 le">
								手机号
							</view>
							<view class="award_tanc22 le">
								<input disabled v-model="addressDate.phone" />
							</view>
						</view>
						<view class="award_tanc2 oh">
							<view class="award_tanc21 le">
								所在地
							</view>
							<view class="award_tanc22 le">
								<input disabled v-model="addressDate.fullname" />
							</view>
						</view>
						<view class="award_tanc2 oh">
							<view class="award_tanc21 le">
								详细地址
							</view>
							<view class="award_tanc22 le">
								<input disabled v-model="addressDate.detailAddress" />
							</view>
						</view>
						<view class="award_tanc3 oh">
							<view class="award_tanc31 le" @click="selectAddress">
								<image :src="`${ASSETSURL}award_tanc2.png`"></image>
							</view>
							<view class="award_tanc32 le" @click="saveAddressInfo">
								<image :src="`${ASSETSURL}award_tanc3.png`"></image>
							</view>

						</view>
						<view class="award_tanc4">
							请仔细填写收货地址信息 确保奖励能够准确无误地送达您的手中 地址一经提交，不支持修改
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			//显示隐藏弹窗
			show: {
				type: Boolean,
				default: false
			},
			//地址详情
			addressDate: {
				type: Object,
				default: () => {
					return {}
				}
			},
			// 倒计时
			timeDiff: {
				type: String,
				default: ''
			}
		},
		methods: {
			// 关闭
			close() {
				this.$emit('close')
			},
			open() {

			},
			// 选择地址
			selectAddress() {
				this.$emit('selectAddress')
			},
			//提交地址
			saveAddressInfo() {
				this.$emit('saveAddressInfo2')
			}
		},
	}
</script>

<style lang="scss">
	.award_tanc {
		height: 1111rpx;
		width: 750rpx;
		margin-top: -27%;

		.award_tanceng {
			background: url("https://cdn.vrupup.com/s/116/award_tanc1.png") no-repeat;
			background-size: 750rpx 1111rpx;
			height: 1111rpx;
			position: relative;

			.adddd {
				position: absolute;
				top: 508rpx;
				left: 183rpx;
			}

			.award_tanc1 {
				font-family: Alibaba PuHuiTi;
				font-size: 21rpx;
				color: #262626;
				display: flex;
				align-items: center;
				margin-left: 30rpx;
			}

			.award_tanc2 {
				width: 359rpx;
				height: 64rpx;
				background: #FFCD57;
				border-radius: 28rpx;
				border: 2px solid #000000;
				margin-top: 20rpx;

				.award_tanc21 {
					line-height: 54rpx;
					font-size: 28rpx;
					padding-left: 20rpx;
					margin-top: 4rpx;
				}

				.award_tanc22 {
					width: 180rpx;
					margin-top: 10rpx;
					font-size: 30rpx;
					margin-left: 20rpx;
				}
			}

			.award_tanc3 {
				margin-left: -50rpx;
				margin-top: 41rpx;

				.award_tanc31 {
					margin-right: 35rpx;

					image {
						width: 223rpx;
						height: 68rpx;
					}
				}

				.award_tanc32 {
					image {
						width: 223rpx;
						height: 68rpx;
					}
				}
			}

			.award_tanc4 {
				font-family: Alibaba PuHuiTi;
				font-weight: 400;
				font-size: 21rpx;
				color: #262626;
				line-height: 29rpx;
				width: 430rpx;
				margin-top: 17rpx;
			}
		}

	}
</style>