<template>
	<view class="card">
		<view class="cardceng" style="height: 100%;">
			<view class="" style="padding-top: 20rpx; box-sizing: border-box;">
				<view class="card1 oh">
					<view class="myKp">
						<image :src="`${ASSETSURL}img/myKpian.png`"></image>
					</view>
					<view class="card11 le">
						<!-- <image :src="`${ASSETSURL}card/card1.png`"></image> -->
						<!-- <text>x{{compositionCount}}</text> -->
						<view class="imgImg">
							<image class="img" :src="`${ASSETSURL}img/X.png`"></image>
							<image class="img" :src="`${ASSETSURL}img/${compositionCount[0]}.png`"></image>
							<image class="img" style="margin-left: -6rpx;"
								:src="`${ASSETSURL}img/${compositionCount[1]}.png`">
							</image>
							<image class="img" v-if="compositionCount[2]" style="margin-left: -12rpx;"
								:src="`${ASSETSURL}img/${compositionCount[2]}.png`"></image>
						</view>
					</view>
					<view class="card12 ri" @click="pai_h">
						<image :src="`${ASSETSURL}card/card2.png`"></image>
					</view>
				</view>
				<view class="card2 oh">
					<view class="card23 ri" @click="xyz" :style="{'opacity' : current == 0 ? '0.5' : ''}">
						<image :src="`${ASSETSURL}card/card3.png`"></image>
					</view>
					<view class="card22 le">
						<!-- <view class="add221" v-show="!list[current].id">
							<view class="add2211"></view>
						</view> -->
						<u-swiper radius="16" bgColor="transparent" imgMode="aspectFit" :autoplay='false'
							:current='current' keyName="img" :list="list" height="337" style="width: 100%;"
							@change="swiper">
						</u-swiper>
					</view>
					<view class="card21 le" @click="syz" :style="{'opacity' : current == 3 ? '0.5' : ''}">
						<image :src="`${ASSETSURL}card/card4.png`"></image>
					</view>
				</view>
				<view class="card3">
					<view class="card31 tc"
						v-if="list[0].num == 0 && list[1].num == 0 && list[2].num == 0 && list[3].num == 0"
						@click="compound1_sq">
						<image :src="`${ASSETSURL}card/card51.png`"></image>
					</view>
					<view class="card31 tc"
						v-else-if="list[0].num > 0 && list[1].num > 0 && list[2].num > 0 && list[3].num > 0"
						@click="compound">
						<image :src="`${ASSETSURL}card/card61.png`"></image>
					</view>
					<view v-else>
						<view class="card31 tc" @click="compound1_sq">
							<image :src="`${ASSETSURL}card/card5.png`"></image>
						</view>

						<view class="card32">
							(卡片数量不足，无法合成)
						</view>
					</view>
				</view>
			</view>
			<view class="card4">
				<view class="card4ceng oh">
					<!-- <u-scroll-list indicatorActiveColor="#ffb300" indicator='false'> -->
					<view class="card41 le" v-for="(item,index) in list" :key="index"
						@click="dq_src_sq(index,item.num)">
						<view class="card411">
							<image :src="`${ASSETSURL}card/card6.png`"></image>
							<text>{{item.num}}</text>
						</view>
						<view class="card412">
							<image :src="item.img"></image>
						</view>
						<view class="card413">
							<!-- <view class="mceng"></view> -->
							<image :src="`${ASSETSURL}card/card8${index}.png`"></image>
						</view>
					</view>
					<!-- </u-scroll-list> -->
				</view>
			</view>
		</view>
		<u-popup :show="show" mode="center" @close="show = false" :overlayOpacity='0.8'>
			<!-- 我的奖品 -->
			<view class="compound_ceng" v-show="compound1 == 1">
				<view class="compound1">
					<view class="compound11 tc jpTu">
						<image :src="`${ASSETSURL}card/compound1.png`"></image>
					</view>
					<view class="compound12 oh jpTuBtn">
						<view class="compound121 le" @click="show = false">
							<image :src="`${ASSETSURL}card/compound2.png`"></image>
						</view>
						<view class="compound122 le">
							<image :src="`${ASSETSURL}card/compound3.png`"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 赠送卡片 -->
			<view class="compound_ceng" v-show="compound1 == 3">
				<view class="compound1">
					<view class="compound11 tc">
						<!-- <image :src="list3[dq_src]" style="width: 450rpx;height: 674rpx;"></image> -->
						<view class="bgGx" v-if="bgGxShow">
							<sequenceEffect ref="bgGx" :sequenceList="bgGx2"></sequenceEffect>
						</view>
						<!-- 卡片翻转动画 -->
						<view class="compound11ffect" style="width: 474rpx;height: 702rpx; z-index: 11;"
							v-show="dq_src == '2'">
							<card-flip ref="showfect2" :option="starList"></card-flip>
						</view>
						<view class="compound11ffect" style="width: 474rpx;height: 702rpx; z-index: 11;"
							v-show="dq_src == '0'">

							<card-flip ref="showfect0" :option="starList2"></card-flip>
						</view>
						<view class="compound11ffect" style="width: 474rpx;height: 702rpx; z-index: 11;"
							v-show="dq_src == '1'">
							<card-flip ref="showfect1" :option="starList3"></card-flip>
						</view>
						<view class="compound11ffect" style="width: 474rpx;height: 702rpx; z-index: 11;"
							v-show="dq_src == '3'">
							<card-flip ref="showfect3" :option="starList4"></card-flip>
						</view>
					</view>
					<view class="compound12 oh">
						<view class="compound121 le" @click="show = false">
							<image :src="`${ASSETSURL}img/myZxx.png`"></image>
						</view>
						<view class="compound122 le" @click="zegnka">
							<button type="primary" open-type="share" class="btn">
								<image :src="`${ASSETSURL}card/compound31.png`"></image>
							</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 合成奖励提示 -->
			<view class="compound_ceng" v-show="compound1 == 0">
				<view class="compound1">
					<view class="compound13 tc">
						<image :src="`${ASSETSURL}card/compound4.png`" mode="widthFix"></image>
					</view>
					<view class="compound14">
						恭喜你获得集卡奖励，集卡套数排行榜前3名即可获得最高奖励——<text>宝藏金条项链</text>，快去集卡合成冲榜吧！
					</view>
					<!-- <view class="compound15" @click="show = false,htxb_myCard()">
						<image :src="`${ASSETSURL}card/compound5.png`" mode="widthFix"></image>
					</view> -->

				</view>
			</view>
			<!-- 卡片不足 -->
			<view class="compound_ceng" v-show="compound1 == 2">
				<view class="compound1">
					<view class="compound16">
						<image :src="`${ASSETSURL}card/compound6.png`" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</u-popup>
		<view class="bgGxBgGxShowFect" v-show="bgGxShowFect">
			<sequenceEffect ref="bgGx" :sequenceList="bgGx2"></sequenceEffect>
		</view>
	</view>
</template>

<script>
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	import store from '@/store';
	import cardFlip from '@/pages-game/xunbao/components/card-flip/card-flip.vue';
	import sequenceEffect from '@/pages-game/xunbao/components/sequenceEffect/sequenceEffect';
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	export default {
		components: {
			cardFlip,
			sequenceEffect
		},
		data() {
			return {
				bgGxShowFect: false, //展示合成弹窗效果
				resetShow: true, //强制刷新变量
				bgGxShow: false,
				show: false,
				current: 0, //当前轮播图下标
				compound1: 3, //中奖0123
				myCard: null,
				compositionCount: 0, //数量
				dq_src: null, //当前赠送卡片
				list: [{
						id: 1,
						type: 'qs_card', //qs_card 全身宝藏卡 yy_card 营养宝藏卡 xjb_card 性价比宝藏卡 bd_card 百搭宝藏卡
						hqu: 0, // 0未获得 1获得
						name: '全身宝藏卡',
						img: 'https://cdn.vrupup.com/s/116/img/qs1.png',
						img1: 'https://cdn.vrupup.com/s/116/ka_1.png',
						img2: 'https://cdn.vrupup.com/s/116/img/qs1.png',
						num: 0,
					},
					{
						id: 2,
						type: 'yy_card',
						hqu: 0,
						name: '营养宝藏卡',
						img: 'https://cdn.vrupup.com/s/116/img/yy1.png',
						img1: 'https://cdn.vrupup.com/s/116/ka_2.png',
						img2: 'https://cdn.vrupup.com/s/116/img/yy1.png',
						num: 0,
					},
					{
						id: 3,
						type: 'bd_card',
						hqu: 0,
						name: '百搭宝藏卡',
						img1: 'https://cdn.vrupup.com/s/116/ka_4.png',
						img: 'https://cdn.vrupup.com/s/116/img/bd2.png',
						img2: 'https://cdn.vrupup.com/s/116/img/bd2.png',
						num: 0,
					},
					{
						id: 4,
						type: 'xjb_card',
						hqu: 0,
						name: '性价比宝藏卡',
						img: 'https://cdn.vrupup.com/s/116/img/xjb1.png',
						img1: 'https://cdn.vrupup.com/s/116/ka_3.png',
						img2: 'https://cdn.vrupup.com/s/116/img/xjb1.png',
						num: 0,
					}

				],
				list3s: [
					['https://cdn.vrupup.com/s/116/ka_1.png', 'https://cdn.vrupup.com/s/116/img/qs1.png'],
					['https://cdn.vrupup.com/s/116/ka_2.png', 'https://cdn.vrupup.com/s/116/img/yy1.png'],
					['https://cdn.vrupup.com/s/116/ka_4.png', 'https://cdn.vrupup.com/s/116/img/bd2.png'],
					['https://cdn.vrupup.com/s/116/ka_3.png', 'https://cdn.vrupup.com/s/116/img/xjb1.png'],
				],
				list3: [
					'https://cdn.vrupup.com/s/116/ka_1.png',
					'https://cdn.vrupup.com/s/116/ka_2.png',
					'https://cdn.vrupup.com/s/116/ka_4.png',
					'https://cdn.vrupup.com/s/116/ka_3.png',
				],
				starList: {
					imgList: ['https://img.vrupup.com/s/116/img/zpc1.png',
						'https://img.vrupup.com/s/116/img/bd1.png'
					], //正反图片
					speed: 1, //翻转速率，单位：s
					borderRadius: 20, //卡牌圆角，单位：rpx
					direction: 1 //翻转方向，1：正翻，2：反翻
				},
				starList2: {
					imgList: ['https://img.vrupup.com/s/116/img/zpc1.png',
						'https://img.vrupup.com/s/116/img/qs.png'
					], //正反图片
					speed: 1, //翻转速率，单位：s
					borderRadius: 20, //卡牌圆角，单位：rpx
					direction: 1 //翻转方向，1：正翻，2：反翻
				},
				starList3: {
					imgList: ['https://img.vrupup.com/s/116/img/zpc1.png',
						'https://img.vrupup.com/s/116/img/yy.png'
					], //正反图片
					speed: 1, //翻转速率，单位：s
					borderRadius: 20, //卡牌圆角，单位：rpx
					direction: 1 //翻转方向，1：正翻，2：反翻
				},
				starList4: {
					imgList: ['https://img.vrupup.com/s/116/img/zpc1.png',
						'https://img.vrupup.com/s/116/img/xjb.png'
					], //正反图片
					speed: 1, //翻转速率，单位：s
					borderRadius: 20, //卡牌圆角，单位：rpx
					direction: 1 //翻转方向，1：正翻，2：反翻
				},
				bgGx2: {
					url: `https://cdn.vrupup.com/s/116/bgGx/1.png`,
					num: 60,
					initIndex: 1,
					speed: 68,
					loop: true,
					autoplay: true,
				},
				_kpTypeIndex: null,
				bgGx2: {
					url: `https://cdn.vrupup.com/s/116/heCen/1.png`,
					num: 46,
					initIndex: 1,
					speed: 68,
					loop: false,
					autoplay: false
				},
			}
		},
		onShow() {
			this.htxb_myCard()
			// this.htxb_cardDetail()
		},
		watch: {
			show(a, b) {
				if (!a) {
					this.resetKpType()
				}
			}
		},
		methods: {
			getbgGx() {
				console.log('序列完成getbgGx');
				this.$refs.bgGx.play()
			},
			//播放
			play2() {
				this.bgGxShow = true
				let _kpType = ['', 'bd_card', 'qs_card', 'yy_card', 'xjb_card']
				this._kpTypeIndex = parseInt(this.dq_src)
				setTimeout(() => {
					this.$refs[`showfect${this.dq_src}`].play()
				}, 300)
			},
			//重置翻牌
			resetKpType() {
				if (this.$refs[`showfect${this._kpTypeIndex}`]) {
					this.$refs[`showfect${this._kpTypeIndex}`].reset()
				}
			},
			// 赠卡
			zegnka() {
				// somePageViewEvent() 全局埋点 
				reportClickEvent({
					activityName: '卡片赠送',
					actionRank: 0,
					activityId: 'game_xunbao_card_click_give',
					activityContent: {
						name: this.list[this.dq_src].name
					}
				})
				api.htxb_giveCard({
					cardType: this.list[this.dq_src].type
				}).then((res) => {
					store.commit('storeShareCode1', res.data.operateCode)
					this.htxb_myCard()
				})
			},
			// 赠送卡片
			dq_src_sq(e, ee) {
				if (ee == 0) return tool.alert("卡片数量不足")
				console.log(e);
				this.show = true
				this.compound1 = 3
				this.dq_src = e
				this.play2()
			},
			compound1_sq() {
				this.show = true
				this.compound1 = 2
			},
			//合成卡片
			compound() {
				api.mergeCard()
					.then((res) => {
						console.log(res.data, '合成');
						this.bgGxShowFect = true
						if (res.data.first) {
							this.$refs.bgGx.play(46).then(() => {
								this.show = true
								this.compound1 = 1
								this.bgGxShowFect = false
							})
						} else {
							this.$refs.bgGx.play(46).then(() => {
								this.show = true
								this.show = true
								this.compound1 = 0
							})
						}
						this.htxb_myCard()
					})
					.catch((err) => {

					});
			},
			// 卡详情
			htxb_cardDetail() {
				api.htxb_cardDetail()
					.then((res) => {

						console.log(res.data, '卡详情');
					})
					.catch((err) => {});
			},
			// 查询我的卡片
			htxb_myCard() {
				console.log("查询我的卡片3")

				api.htxb_myCard().then((res) => {
						console.log(res.data, '查询我的卡片');
						this.show = false
						this.list.forEach((item, index) => {
							res.data.card.forEach(item1 => {
								if (item.type == item1.cardType) {
									console.log(item1.cardCount, 'item1.cardType')
									item.num = item1.cardCount
									if (item1.cardCount > 0) {
										item.img = item.img1
									} else {
										item.img = item.img2
									}
								}
							})
						})
						console.log(this.list, 'this.listthis.listthis.list2')
						this.compositionCount = res.data.compositionCount.toString().split("")

					})
					.catch((err) => {});
			},
			pai_h() {
				tool.jump_nav("/pages-game/xunbao/pages-list/ranking_list/ranking_list")
			},
			syz() {
				console.log(1);
				if (this.current == 3) {
					// this.current = 0
				} else {
					this.current = this.current + 1
				}
			},
			xyz() {
				console.log(1);
				if (this.current == 0) {
					// this.current = 3
				} else {
					this.current = this.current - 1
				}
			},
			swiper(e) {
				console.log(e.current);
				this.current = e.current
			},
			fhui() {
				this.resetKpType()
				tool.jump_back()
			},
		}
	}
</script>
<style>
	@import '@/pages-game/xunbao/css/base.css';
</style>
<style scoped lang="scss">
	.bgGxBgGxShowFect {
		width: 100vw;
		height: 100vh;
	}

	.card {
		padding-top: 0rpx;
		background: #fea500;

		height: 100vh;

		.mceng {
			position: absolute;
			// background: #000000;
			width: 144rpx;
			height: 76%;
			top: 30rpx;
			opacity: 0.7;
		}

		.cardceng {
			background: url("https://cdn.vrupup.com/s/116/img/kaPanBj.png") no-repeat;
			background-size: 100% 100%;
			// height: 100vh;

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

			.card1 {
				// padding-top: 262rpx;
				padding-top: 148rpx;
				box-sizing: border-box;
				position: relative;

				.myKp {
					position: absolute;
					top: 30rpx;
					left: 162rpx;

					image {
						width: 426rpx;
						height: 105rpx;
					}
				}

				.card11 {
					background: url(https://cdn.vrupup.com/s/116/card/card1.png) no-repeat;
					background-size: 93% 100%;
					padding: 0 15rpx 0 75rpx;
					box-sizing: border-box;
					height: 62rpx;
					text-align: right;
					line-height: 70rpx;

					.imgImg {

						.img {
							width: 20rpx;
							height: 25rpx;

						}
					}

					image {
						width: 165rpx;
						height: 65rpx;
					}
				}

				.card12 {
					image {
						width: 165rpx;
						height: 65rpx;
					}
				}
			}

			.card2 {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0px 42rpx 20rpx;
				box-sizing: border-box;

				.card21 {

					image {
						width: 60rpx;
						height: 60rpx;
					}
				}

				.card22 {
					width: 451rpx;
					margin: 0 31rpx;
					position: relative;

					image {
						width: 372rpx;
						height: 553rpx;
					}

					.add221 {
						position: relative;
						position: absolute;
						width: 100%;
						height: 100%;
						background: #000;
						// z-index: 999;
						opacity: 0.6;
						border-radius: 18rpx;
						top: 0;
						left: 50%;
						transform: translateX(-50%);
						border-radius: 20rpx
					}
				}

				.card23 {

					image {
						width: 60rpx;
						height: 60rpx;
					}
				}
			}

			.card3 {
				margin-bottom: 420rpx;

				.card32 {
					font-family: Alibaba PuHuiTi;
					font-weight: 500;
					font-size: 17rpx;
					color: #646158;
					line-height: 29rpx;
					text-align: center;
				}

				image {
					width: 283rpx;
					height: 85rpx;
				}
			}

			.card4 {
				background: url("https://cdn.vrupup.com/s/116/card_bj1_1.png") no-repeat;
				background-size: 100% 100%;
				height: 395rpx;
				position: absolute;
				width: 100vw;
				bottom: 0;

				.card4ceng {
					position: absolute;
					bottom: 64rpx;
					left: 67rpx;

					.card41:nth-child(4n) {
						// margin-right: 0rpx;
					}

					.card41 {
						margin-right: 17rpx;
						position: relative;

						.card411 {
							position: relative;
							left: 122rpx;
							top: 26rpx;
							z-index: 999;

							text {
								position: absolute;
								font-family: Alibaba PuHuiTi;
								font-weight: 500;
								font-size: 18rpx;
								color: #080808;
								left: 0;
								top: 1rpx;
								background: #fea500;
								border-radius: 120rpx;
								width: 30rpx;
								height: 30rpx;
								line-height: 30rpx;
								text-align: center;
								z-index: 999;
							}

							image {
								width: 28.5rpx;
								height: 28.5rpx;
							}
						}

						.card412 {
							image {
								width: 144rpx;
								height: 214rpx;
							}
						}

						.card413 {
							margin-top: 8rpx;
							text-align: center;

							image {
								width: 121rpx;
								height: 32rpx;
							}
						}
					}
				}
			}
		}
	}

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

	.btn {
		background: none;
		border: none;
		border-radius: 0;
		line-height: 0;
		border: none;

		&::after {
			display: none;
		}
	}
</style>
<style>
	.u-popup__content {
		background: none;
	}

	.u-popup__content {
		background: none !important;
	}
</style>