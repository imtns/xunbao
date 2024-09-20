<template>
	<view class="container1">
		<view class="card"
			:class="{ 'is-flipped': isFlipped && option.direction == 1, 'is-flipped2': isFlipped && option.direction == 2, 'isReset': isReset}"
			:style="{'transition': 'transform '+option.speed+'s', 'borderRadius': option.borderRadius +'rpx'}">
			<view class="card-face card-face-front" :style="{'borderRadius': option.borderRadius +'rpx'}">
				<image :style="{'borderRadius': option.borderRadius +'rpx'}" :src="option.imgList[0]" mode="aspectFill">
				</image>
			</view>
			<view class="card-face"
				:class="{'card-face-back': option.direction == 1, 'card-face-back2': option.direction == 2}"
				:style="{'borderRadius': option.borderRadius +'rpx'}">
				<image :style="{'borderRadius': option.borderRadius +'rpx'}" :src="option.imgList[1]" mode="aspectFill">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFlipped: false, //卡牌状态
				isReset: false //是否在重置卡牌
			};
		},
		props: {
			option: {
				type: Object,
				default: {
					imgList: [], //正反图片
					speed: 1, //翻转速率，单位：s
					borderRadius: 20, //卡牌圆角，单位：rpx
					direction: 1 //翻转方向，1：正翻，2：反翻
				}
			}
		},
		mounted() {
			console.log("option", this.option)
		},
		methods: {
			//翻转卡牌
			play() {
				this.isFlipped = !this.isFlipped;
			},
			//重置卡牌
			reset() {
				this.isReset = true
				setTimeout(() => {
					this.isFlipped = false
					this.isReset = false
				}, 300)
			}
		}
	};
</script>

<style>
	.container1 {
		width: 100%;
		height: 100%;
		perspective: 1000px;
	}

	.card {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 1s;
	}

	.card.isReset {
		transition: transform 0s !important;
	}

	.card-face {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: 40rpx !important;
	}

	.card-face image {
		width: 100%;
		height: 100%;
		border-radius: 40rpx !important;
	}

	.card-face-front {
		background-color: #fefefe;
	}

	.card-face-back {
		background-color: #f1f1f1;
		transform: rotateY(-180deg);
	}

	.card-face-back2 {
		background-color: #f1f1f1;
		transform: rotateY(180deg);
	}

	.is-flipped {
		transform: rotateY(-180deg);
	}

	.is-flipped2 {
		transform: rotateY(180deg);
	}
</style>