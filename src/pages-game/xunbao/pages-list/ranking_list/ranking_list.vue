<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" :loading-more-enabled="false"
		:refresher-enabled="false" hide-empty-view>
		<view class="ranking_list">
			<view class="rankingceng">
				<!-- <view class="award1" @click="fhui">
					<image :src="`${ASSETSURL}ad_18.png`"></image>
					<u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar>
				</view> -->
				<view class="ranking">
					<view class="ranking1 oh flex-bet" :class="dataList.length == 0 ? '' : 'shows'" v-if="dataList.length || showRanking">
						<view class="ranking11 le ranking11_wenzi">排名</view>
						<view class="ranking12 le ranking11_wenzi">昵称</view>
						<view class="ranking13 ri ranking11_wenzi">集齐套数</view>
					</view>
					<view class="ranking2 oh" :class="listShow || dataList.length == 0 ? 'listShow' : ''">
						<view class="ranking21 oh" v-for="(item,index) in dataList">
							<view class="ranking211 le " v-if="index == 0 || index == 1 || index == 2">
								<image mode="widthFix" :src="`${ASSETSURL}image/ph_${index+1}.png`"></image>
							</view>
							<view class="ranking211 le tc" v-else-if="index > 9" style="margin-top:36rpx;">
								未上榜
							</view>
							<view class="ranking211 le tc" v-else style="margin-top:36rpx;">
								{{index+1}}
							</view>
							<view class="ranking212 le">
								<image :src="item.headUrl" lazy-load></image>
							</view>
							<view class="ranking213 ell le">{{item.nickName}}</view>
							<view class="ranking214 ri">{{item.compositionCount}}</view>
						</view>
						<view v-if="dataList.length == 0" class="ranking21_1">
							<image mode="widthFix" :src="`${ASSETSURL}wu_zt2.png`" style="width: 325rpx;"></image>
						</view>
					</view>

					<view class="ranking2 ranking2_lo">
						<view class="ranking21 oh">
							<view class="ranking211 le tc" v-if="!dq_list.rank"
								style="width: 100%; padding: 30rpx; box-sizing: border-box; text-align: center;">
								{{'暂未上榜,快去集卡冲榜赢取终极大奖吧!'}}
							</view>
							<view class="ranking211 le tc" v-if="dq_list.rank"
								style="padding: 30rpx; box-sizing: border-box;">
								{{dq_list.rank}}
							</view>
							<view class="ranking212 le" v-if="dq_list.headUrl">
								<image mode="aspectFill" :src="dq_list.headUrl"></image>
							</view>
							<view class="ranking213 ell le" v-if="dq_list.nickName">{{dq_list.nickName}}</view>
							<view class="ranking214 ri" style="margin-right:30rpx;" v-if="dq_list.compositionCount">
								{{dq_list.compositionCount}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</z-paging>
</template>
<style>
	@import '@/pages-game/xunbao/css/base.css';
</style>
<script>
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	export default {
		data() {
			return {
				dq_list: {
					pm: null,
					headUrl: null,
					nickName: null,
					score: null
				},
				dataList: [],
				listShow: false,
				showRanking: false
			}
		},
		onShow() {
			// this.htxb_rankList()
		},
		methods: {
			// 查询排行榜
			htxb_rankList() {

			},
			fhui() {
				tool.jump_back()
			},
			// 获取数据
			queryList(pageNo, pageSize) {
				api.htxb_rankList().then((res) => {
						console.log(res.data, '查询排行榜');
						this.dataList = []
						this.dataList = res.data.rankList
						if (!this.dataList.length) this.showRanking = true
						this.dq_list = res.data.myRank
						this.$refs.paging.complete(this.dataList)
						setTimeout(() => {
							this.listShow = true
						}, 500)
					})
					.catch((err) => {});



			},
		}
	}
</script>

<style scoped lang="scss">
	.ranking_list {
		background: url("https://cdn.vrupup.com/s/116/img/kaPanBj.png") no-repeat;
		background-size: 100% 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		.rankingceng {
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

			.ranking {
				background: url("https://cdn.vrupup.com/s/116/img/paiHangBang.png") no-repeat;
				background-size: 100% 100%;
				width: 726rpx;
				height: 1316rpx;
				margin: 40rpx auto;
				padding: 0 40rpx 0 40rpx;
				box-sizing: border-box;

				.ranking1 {
					padding: 130rpx 40rpx 0 40rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					opacity: 0;
					&.shows{
						opacity: 1;
					}
					.ranking12 {
						// padding: 0 199rpx;
						margin-left: 8rpx;
					}

					.ranking11_wenzi {
						font-family: Alibaba PuHuiTi;
						font-weight: 500;
						font-size: 29rpx;
						color: #858585;
						line-height: 33rpx;
					}
				}

				.ranking2 {
					margin-top: 37rpx;
					height: 750rpx;
					overflow: scroll;
					margin-bottom: 40rpx;
					opacity: 0;
					transition: all 0.5s;

					.ranking21_1 {
						text-align: center;
						padding-top: 200rpx;
					}

					.ranking21 {
						padding: 0 40rpx 0 25rpx;
						margin-bottom: 69rpx;

						.ranking211 {
							width: 74rpx;
							font-family: Alibaba PuHuiTi;
							font-weight: 500;
							font-size: 25rpx;
							color: #000000;
							line-height: 33rpx;
							text-align: center;

							image {
								width: 49rpx;
								margin-top: 24rpx;
							}
						}

						.ranking212 {
							margin-left: 40rpx;
							margin-right: 40rpx;

							image {
								width: 96rpx;
								height: 96rpx;
								border-radius: 50%;
							}
						}

						.ranking213 {
							margin-top: 34rpx;
							font-family: Alibaba PuHuiTi;
							font-weight: 500;
							font-size: 25rpx;
							color: #000000;
							line-height: 33rpx;
							width:190rpx;
						}

						.ranking214 {
							margin-top: 33rpx;
							font-family: Alibaba PuHuiTi;
							font-weight: 500;
							font-size: 25rpx;
							color: #000000;
							line-height: 33rpx;
							width: 120rpx;
							text-align: center;
						}
					}
				}

				.listShow {
					opacity: 1;
				}

				.ranking2_lo {
					height: 151rpx;
					margin-top: 0rpx;
					opacity: 1;
					overflow: hidden;
					.ranking21 {
						background: #FFF0CE;
						border-radius: 16rpx;
						padding: 19rpx 11rpx;
						// margin: 0 19rpx;
					}
				}
			}
		}
	}
</style>