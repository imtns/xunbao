<template>
	<view>
		<view class="compound_ceng">
			<view class="compound1">
				<view class="compound11 tc jpTu">
					<image :src="`${ASSETSURL}card/compound1.png`" v-if="showPrizeType == 0"></image>
					<image :src="`${ASSETSURL}card/compound_1.png`" v-if="showPrizeType == 1"></image>
					<image :src="`${ASSETSURL}card/compound_2.png`" v-if="showPrizeType == 2"></image>
					<image :src="`${ASSETSURL}card/compound_3.png`" v-if="showPrizeType == 3"></image>
					<image :src="`${ASSETSURL}card/compound_4.png`" v-if="showPrizeType == 4"></image>
					<image :src="`${ASSETSURL}card/compound_5.png`" v-if="showPrizeType == 5"></image>
					<image :src="`${ASSETSURL}card/compound_6.png`" v-if="showPrizeType == 6"></image>
				</view>
				<view class="compound12 oh jpTuBtn">
					<view class="compound121 le" @click="closePrizePup">
						<image :src="`${ASSETSURL}card/compound2.png`"></image>
					</view>
					<view class="compound122 le" @click="jumpNext">
						<image :src="`${ASSETSURL}card/compound3s.png`"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "prize-tips",
		props: {
			//奖品类型，0为默认图，1-4为惊喜掉落奖品图，5-6为合成奖品图
			showPrizeType: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			};
		},
		methods: {
			//点击我再想想
			closePrizePup() {
				this.$emit("closePrizePup")
			},
			//点击去领取
			jumpNext() {
				this.$emit("jumpNext")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.compound_ceng {
		width: 100vw;

		.compound1 {
			position: relative;
			margin-top: -50rpx;

			.compound11 {
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 450rpx;
				}
			}

			.jpTu {
				image {
					width: 100%;
					height: 837rpx;
				}
			}

			.compound12 {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 50rpx;
				position: relative;
				z-index: 555;

				.compound121 {
					image {
						width: 273rpx;
						height: 94rpx;
					}
				}

				.compound122 {
					margin-left: 20rpx;

					image {
						width: 273rpx;
						height: 94rpx;
					}
				}
			}

			.jpTuBtn {
				bottom: 0%;
				z-index: 66;
			}

			.compound13 {
				image {
					width: 578rpx;
					height: 758rpx;
				}
			}

			.compound14 {
				width: 388rpx;
				height: 181rpx;
				font-family: Alibaba PuHuiTi;
				font-weight: 500;
				font-size: 29rpx;
				color: #000000;
				position: absolute;
				top: 311rpx;
				left: 50%;
				transform: translateX(-50%);
				line-height: 45rpx;

				text {
					color: #FA7700;
				}
			}

			.compound15 {
				text-align: center;
				position: absolute;
				top: 551rpx;
				left: 50%;
				transform: translateX(-50%);

				image {
					width: 273rpx;
					height: 94rpx;
				}
			}

			.compound16 {
				text-align: center;

				image {
					width: 442rpx;
					height: 232rpx;
				}
			}
		}

	}
</style>