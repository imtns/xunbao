<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList" :loading-more-enabled='false'
		:refresher-enabled="false">
		<view class="awardceng">
			<view class="award">
				<view class="award2">
					<u-subsection mode="button" :list="list" :current="curNow" @change="sectionChange" bgColor="#ffe3a0"
						activeColor="#fa7700" inactiveColor="#000"></u-subsection>
				</view>
				<view class="award3_list" v-for="(item,index) in dataList" :key="index"
					:class="curNow == 0 ? 'add_h' : ''">
					<!-- 基础 -->
					<view class="conterFoms" v-if="curNow == 0" style="margin-top: 0;">
						<view v-if="item.prizeInfoList.length > 0 && item.prizeType == 'diaoluo'">
							<view v-for="(item2,index2) in item.prizeInfoList" :key="index2">
								<view class="award3" v-if="item2.prizeStatus < 2">
									<view class="award31 oh">
										<view class="oh">
											<view class="award311 le" v-if="item2.prizeStatus == 0">
												<view class="prizeImage">
													<image :src="item2.prizeImage"></image>
												</view>
												<view class="theAddress">
													<view class="address">
														填写地址
													</view>
													<view class="time" v-if="timeDiff">
														{{timeDiff}}
													</view>
												</view>
											</view>
											<view class="award311 le" v-else>
												<image :src="item2.prizeImage"></image>
											</view>
											<view class="award312 le oh">
												<view class="award3121">{{item2.prizeName}}</view>
												<view class="award3122"
													:class="item2.prizeStatus == 1 ? 'yiLinQu' : 'aaa'"
													@click="priztus(item2)">
													{{prizeStatus[item2.prizeStatus]}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else-if="index == 0 && item.prizeType != 'diaoluo'" class="zwhdjl">
							<image :src="`${ASSETSURL}img/zanweihuode.png`" width="490rpx" height="135rpx"></image>
						</view>
					</view>

					<!-- 卡片奖励 -->
					<view class="conterFoms" v-if="curNow == 1 && item.prizeType == 'jichu'">
						<view class="" v-if="item.prizeInfoList.length > 0 && item.prizeType == 'jichu'">
							<view class="" v-for="(item2,index2) in item.prizeInfoList" :key="index2">
								<view class="award3">
									<view class="award31_add1">
										<view class="award31 oh award31_add">
											<view class="award311 le">
												<image :src="item2.prizeImage" v-if="item2.prizeStatus != 0"></image>
												<view class="prizeImage">
													<image :src="item2.prizeImage"></image>
												</view>
												<view class="theAddress" v-if="item2.prizeStatus == 0">
													<view class="address">
														填写地址
													</view>
													<view class="time" v-if="timeDiff">
														{{timeDiff}}
													</view>
												</view>
											</view>
											<view class="award312 le oh">
												<view class="award3121">{{item2.prizeName}}</view>
												<!-- <view class="award3122" v-if="item2.prizeStatus == 0"
													@click="item2.prizeStatus == 0 ? show = true : ''"
													:class="item2.prizeStatus == 1 ? 'yiLinQu' : 'aaa'">
													{{prizeStatus[item2.prizeStatus]}}
												</view> -->
												<view class="award3122"
													v-if="item2.prizeStatus == 0 || item2.prizeStatus == 1"
													:class="item2.prizeStatus == 1 ? 'yiLinQu' : 'aaa'"
													@click="priztus(item2)">
													{{prizeStatus[item2.prizeStatus]}}
												</view>
												<!-- <view class="award3122" v-if="item2.prizeStatus == 66"
													@click="item2.prizeStatus == 0 ? show = true : ''"
													:class="item2.prizeStatus == 1 ? 'yiLinQu' : 'aaa'">
													{{prizeStatus[3]}}
												</view> -->
												<view class="award3122" v-if="item2.prizeStatus == 66"
													@click="priztus(item2)"
													:class="item2.prizeStatus == 1 ? 'yiLinQu' : 'aaa'">
													{{prizeStatus[3]}}
												</view>
											</view>
											<view class="award31_mc"
												v-if="item2.prizeStatus == 2 || item2.prizeStatus == 3 || item2.prizeStatus == 4 || item2.prizeStatus == 5">
												<view class="award31_mc1">
													<view class="award31_mc11">
														<!-- {{prizeStatus2[item2.prizeStatus]}} -->
														<image
															:style="{'margin-top': item2.prizeStatus == 5 ? '44rpx' : ''}"
															:src="ASSETSURL + 'img/' + prizeStatus2[item2.prizeStatus]"
															height="92rpx" mode="heightFix"></image>
													</view>
													<view class="award31_mc12" v-if="index2 == 0">
														第1-2000名可得宝藏唱片音响
													</view>
													<view class="award31_mc12" v-if="index2 == 1">
														第2001-6000名可得宝藏嗨嗨挂件
													</view>
													<view class="award31_mc12" style="margin-top: 15rpx;"
														v-if="item2.prizeStatus != 5">
														奖品当前剩余数量：{{item2.goodCnt || 0}}个
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

						</view>
						<view v-else style="display: flex;justify-content: center;margin-top: 287rpx;">
							<image :src="`${ASSETSURL}img/zanweihuode.png`" mode="widthFix" width="490rpx"
								height="135rpx"></image>
						</view>
					</view>
					<!-- 最高 -->
					<view class="conterFoms" v-if="item.prizeType == 'zuigao' && curNow == 2">
						<view class="award5" v-show="item.prizeInfoList[0].prizeStatus == 1">
							<view class="award51">
								<image :src="`${ASSETSURL}img/wmcZuiGao.png`" mode="widthFix"></image>
							</view>
							<view class="award52" style="margin-top: 50rpx;">
								<image :src="`${ASSETSURL}ad_23.png`"></image>
							</view>
						</view>
						<view class="award5" v-show="item.prizeInfoList[0].prizeStatus != 1">
							<view class="award51">
								<image :src="`${ASSETSURL}img/mcZuiGao.png`" mode="widthFix"></image>
								<view class=""
									v-if="item.prizeInfoList[0].prizeStatus == 4 || item.prizeInfoList[0].prizeStatus == 2">
								</view>
								<view class="award53" v-if="item.prizeInfoList[0].prizeStatus == 0">
									<view class="award531 oh">
										<view class="award5311">
											<image :src="`${ASSETSURL}ad_2311.png`"></image>
										</view>
										<view class="award5312" v-if="timeDiff">
											{{timeDiff}}
										</view>
									</view>
								</view>
							</view>
							<view class="award52" style="margin-top: 50rpx;"
								v-if="item.prizeInfoList[0].prizeStatus == 0" @click="show = true">
								<image :src="`${ASSETSURL}ad_231.png`" @click="priztus(item.prizeInfoList[0])"></image>
							</view>
						</view>

					</view>
				</view>
			</view>
			<view class="award4" v-show="list_dq == 0 && curNow == 0">
				<image src="https://cdn.vrupup.com/s/116/ad_20.png"></image>
			</view>
			<view class="award6" v-show="curNow == 0">
				<image :src="ASSETSURL + 'img/diaoLuoText.png'" mode=""></image>
				<!-- <view class="award61">活动截止时间</view>
				<view class="award62">10月11日12:00:00</view> -->
			</view>
			<view class="award6 img" style v-show="curNow == 1" style="margin-top: auto;bottom: 10%;"
				@click="getMyAddressId">
				<image :src="ASSETSURL + 'img/jikaText.png'" mode=""></image>
			</view>

			<!-- 	<u-popup :show="show" mode="center" @close="close" @click="show = false">
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
									<input disabled v-model="addressDate.receiver" />
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
			</u-popup> -->

			<!-- 地址弹窗 -->
			<view style="margin-top: -100rpx;">
				<shareAndDrop v-if="show" :addressDate="addressDate" :show="show" @close="show = false"
					@selectAddress="selectAddress" @saveAddressInfo2="saveAddressInfo" />
			</view>
		</view>
		</view>
	</z-paging>
</template>

<script>
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	import shareAndDrop from '@/pages-game/xunbao/components/shareAndDrop/shareAndDrop.vue'
	import store from '@/store'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			shareAndDrop,
			...mapState(['isLogin', 'userInfo'])
		},
		data() {
			return {
				show: false,
				timeData: {},
				list_dq: 1, // 0:无数据 1:有数据
				list: ['掉落奖励', '集卡奖励', '最高奖励'],
				curNow: 0, //0:掉落奖励 1:集卡奖励 2:最高奖励
				dataList: [],
				jiangp_list: [{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp1.png',
						prizeName: '收纳盒',
						lingqu_status: 0, //暂未领取
					},
					{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp2.png',
						prizeName: '嗨嗨钥匙扣',
						lingqu_status: 0, //暂未领取
					},
					{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp3.png',
						prizeName: '打光板',
						lingqu_status: 0, //暂未领取
					},
					{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp4.png',
						prizeName: '贴纸',
						lingqu_status: 0, //暂未领取
					},
					{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp5.png',
						prizeName: '嗨嗨',
						lingqu_status: 0, //暂未领取
					},
					{
						type: 1,
						prizeImage: 'https://cdn.vrupup.com/s/116/dayAnswer/jiangp6.png',
						prizeName: '唱片机',
						lingqu_status: 0, //暂未领取
					}
				], //奖品合计
				prizeStatus: [
					'填写地址',
					'已领取',
					'未获得',
					'需要切图XXX',
					'预占',
					'暂未开始发放',
				],
				prizeStatus2: [
					'zWHD.png', // '暂未领取',
					'已领取',
					'zWHD.png',
					'预占',
					'zwkf.png', //'暂未开始发放',
					'nyhd.png', //'您已获得音响',
				],
				difference: null,
				timeDiff: null, //倒计时
				addressId: null, //获取地址
				addressDate: {}, //地址详情
				name: '', //收货人
				commodity: {}, //商品单个详情
				isSubmit: false //防止重复提交
			}
		},
		computed: {
			priceImgList() {
				return [{
					prizeName: '宝藏嗨嗨打光板',
					prizeImage: `${this.ASSETSURL}img/daGuanBan.png`
				}, {
					prizeName: '宝藏嗨嗨挂件',
					prizeImage: `${this.ASSETSURL}img/kaiKai.png`
				}, {
					prizeName: '宝藏嗨嗨收纳盒',
					prizeImage: `${this.ASSETSURL}img/shouLaHe.png`
				}, {
					prizeName: '宝藏嗨嗨贴纸',
					prizeImage: `${this.ASSETSURL}img/tieZhi.png`
				}, {
					prizeName: '宝藏嗨嗨钥匙扣',
					prizeImage: `${this.ASSETSURL}img/yaoShiKo.png`
				}, {
					prizeName: '宝藏金条项链',
					prizeImage: `${this.ASSETSURL}img/zuiGao.png`
				}, {
					prizeName: '宝藏唱片音响',
					prizeImage: `${this.ASSETSURL}img/changPianJi.png`
				}]
			}
		},
		onLoad(opation) {
			console.log("award-opation", opation)
			if (opation.curNow) this.curNow = opation.curNow
			console.log('this.isLogin', this.isLogin)
			if (!this.isLogin) {
				reportClickEvent({
					activityName: '游戏首页跳转登录',
					actionRank: 0,
					activityId: 'game_xunbao_home_click_login',
					activityContent: {}
				})
				return tool.jump_nav('/pages-sub/login/index')
			}
		},
		onShow() {
			
			this.countdown("2024-10-11 12:00:00", 1000, this.onCountdownComplete)
			// tool.storage('addressId', '1837064729768472578')
			this.$refs.paging.reload()
			// this.queryList()
			this.jsq_sj()
			//获取地址
			if (tool.storage('addressId')) {
				this.addressId = tool.storage('addressId')
				this.getAddressId(this.addressId)
			}
			// this.getAddressId("1783425478279778305")//陈豪豪 的收货地址
			// this.getAddressId("1837064729768472578")//扬帆 的收货地址
		},
		methods: {
			//测试查询所有storage
			getMyAddressId() {
				uni.getStorageInfo({
					success: function(res) {
						console.log("查询所有storage");
						console.log(res.keys);
						console.log(res.currentSize);
						console.log(res.limitSize);
					}
				});
				// tool.storage('addressId', '1837064729768472578')
				uni.getStorage({
					key: 'test_addressId',
					success: function(res) {
						console.log("查询ok")
						console.log(res);
					},
					fail(err) {
						console.log("查询no")
						console.log(err);
					},
					complete(res) {
						console.log("查询com")
						console.log(res);
					}
				});
				console.log('tool.storage查询')
				console.log('tool.storage查询2', tool.storage('addressId'))
			},
			//保存地址信息
			saveAddressInfo() {
				if (this.addressDate && !this.addressDate.objectCode) return tool.alert('请选择地址')
				let data = {
          methodName: 'saveAddressInfo',
          goodsCode: this.commodity.goodsCode, //商品编码
					receiveAddressCode: this.addressDate.objectCode
				}
				console.log("this.commodity", this.commodity)
				console.log("保存地址信息", data)
				tool.loading('提交中')
				api.saveAddressInfo(data).then(res => {
					console.log(res, '===保存地址信息=======');
					if (res.code == 200) {
						tool.alert('提交成功', 1)
						reportClickEvent({
							activityName: '完成留资',
							actionRank: 0,
							activityId: 'game_xunbao_prize_click_leave',
							activityContent: {}
						})
						this.show = false
						this.queryList()
						// somePageViewEvent() 全局埋点
					}
				})
			},
			//点击填写地址
			priztus(e) {
				console.log('点击填写地址', e, e.prizeStatus, e.prizeStatus == 0);
				if (store.state.actEndFlag && this.curNow != 2) return tool.alert('活动已结束，感谢您的关注~')
				if (this.isSubmit) return
				this.isSubmit = true
				setTimeout(() => {
					this.isSubmit = false
				}, 1500)
				if (e.prizeStatus == 0) {
					this.commodity = e
					this.show = true
					console.log("this.commodity", this.commodity)
				}
			},
			//获取地址详情
			getAddressId(e) {
				api.getAddressDetail(e).then(res => {
					console.log(res, '----获取地址详情----');
					this.addressDate = res.data
					uni.removeStorageSync("addressId")
				})
			},
			//选择地址
			selectAddress() {
				tool.jump_nav('/pages/mine/address/list')
				// tool.jump_nav('/pages-game/xunbao/pages-list/song-test/song-test')
			},
			// 倒计时函数
			countdown(endTime, interval = 1000, onComplete) {
				const timer = setInterval(() => {
					const timeDiff = tool.getDateTime(endTime);
					this.timeDiff = timeDiff.time
					if (timeDiff.day === 0 && timeDiff.hour === 0 && timeDiff.minute === 0 && timeDiff.second ===
						0) {
						clearInterval(timer); // 时间到，清除定时器
						onComplete(); // 调用完成回调函数
					}
				}, interval);
			},
			// 倒计时结束的回调函数
			onCountdownComplete() {
				console.log('倒计时结束！1');
			},
			// 算时间差
			jsq_sj() {
				// 获取当前日期
				var timestamp = Date.now();
				const date = new Date('2024-10-11T12:00:00Z');
				let time = date.getTime();
				this.difference = date - timestamp;
				console.log(this.difference, 'difference');
			},
			onChange(e) {
				this.timeData = e
			},
			close() {
				this.show = false
			},
			fhui() {
				tool.jump_back()
			},
			sectionChange(index) {
				console.log(index, 111, this.dataList);
				this.curNow = index;
			},
			// 获取数据
			queryList(pageNo, pageSize) {
				api.htxbMyPrize().then(res => {
					console.log(res, this.priceImgList, '我的奖品');
					res.data.forEach(item => {
						if (item.prizeType == 'diaoluo') {
							item.prizeInfoList.forEach(item2 => {
								this.priceImgList.forEach(item3 => {
									if (item2.prizeName == item3.prizeName) {
										item2.prizeImage = item3.prizeImage
										console.log("item2------", item2)
									}
								})
							})
						}
						if (item.prizeType == "jichu") {
							let firstZeroIndex = -1; // 初始化第一个0的索引
							// 遍历列表找到第一个prizeStatus为0的元素索引
							for (let i = 0; i < item.prizeInfoList.length; i++) {
								if (item.prizeInfoList[i].prizeStatus == 0) {
									firstZeroIndex = i;
									console.log("firstZeroIndex", firstZeroIndex)
									break; // 找到第一个0，记录索引后退出循环
								}
							}
							// 如果找到了第一个0，则将剩余的所有元素的prizeStatus设置为1
							if (firstZeroIndex !== -1) {
								console.log('如果找到了第一个0，则将剩余的所有元素的prizeStatus设置为1')
								for (let i = firstZeroIndex + 1; i < item.prizeInfoList.length; i++) {
									item.prizeInfoList[i].prizeStatus = 5;
									console.log("item.prizeInfoList[i].prizeStatus", item.prizeInfoList[i]
										.prizeStatus)
								}
							}
						}
						// if (item.prizeType == "zuigao") {
						// 	item.prizeInfoList.forEach(item2 => {
						// 		item2.prizeStatus = 0
						// 	})
						// }
					})
					this.$refs.paging.complete(res.data)
				})

			},
		}
	}
</script>
<style>
	@import '@/pages-game/xunbao/css/base.css';
</style>
<style scoped lang="scss">
	.awardceng {

		background: #febe00;
		min-height: 100vh;
		background: url("https://cdn.vrupup.com/s/116/ad_17.png") no-repeat;
		background-size: 100% 100%;
		height: 100vh;
		overflow: hidden;
	}

	.award_tanc {
		height: 1111rpx;
		width: 750rpx;
		margin-top: -80rpx;

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

	.award {


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

		.add_h {
			// height: 900rpx;
			overflow-y: auto;
		}

		.award3_list {
			// height: 50vh;
			// overflow: auto;
			// margin-top: 100rpx;
		}

		.award2 {
			padding-top: 270rpx;
			width: 482rpx;
			margin: 0 auto;
			height: 52rpx;
			border-radius: 50rpx;
			margin-bottom: 100rpx;
		}

		.conterFoms {
			padding-bottom: 50rpx;
			box-sizing: border-box;

			.zwhdjl {
				display: flex;
				justify-content: center;
				margin-top: 287rpx;

				image {
					width: 490rpx;
					height: 135rpx;
				}
			}
		}

		.award3 {
			// margin-top: 94rpx;
			// padding-bottom: 50rpx;

			.award31_add {
				background: url("https://cdn.vrupup.com/s/116/ad_24.png") no-repeat;
				background-size: 100% 100%;
			}

			.award31_add1 {
				position: relative;

				// background: #fff;
				.award31_mc {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					background: rgba(0, 0, 0, 0.6);
					border-radius: 20rpx 68rpx 37rpx 68rpx;

					.award31_mc11 {
						font-family: Alibaba PuHuiTi;
						font-weight: bold;
						font-size: 29rpx;
						color: #FFFFFF;
						line-height: 29rpx;
						text-stroke: 1px #FFCF5E;
						-webkit-text-stroke: 1px #FFCF5E;
						text-align: center;
						margin-top: -10rpx;

						image {
							height: 110rpx;
							// width: 236rpx;
						}
					}

					.award31_mc12 {
						margin-top: -20rpx;
						font-family: Alibaba PuHuiTi;
						font-weight: 500;
						font-size: 25rpx;
						color: #D9D9BE;
						line-height: 29rpx;
						text-align: center;
					}
				}
			}

			.award31 {
				margin: 20rpx 40rpx;
				padding: 22rpx 50rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 20rpx 68rpx 37rpx 68rpx;
				position: relative;
				display: flex;

				.award311 {
					position: relative;
					border: 4rpx solid #FE8A01;
					border-radius: 28rpx;
					font-size: 0;

					image {
						width: 188rpx;
						height: 128rpx;
						border-radius: 27rpx;
						// border: 7rpx solid #ff8a00;
					}

					.award5312 {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						color: #FFF;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						font-size: 21rpx;
						padding: 0 13rpx;
						box-sizing: border-box;
						width: 100%;
					}

					.prizeImage {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						width: 188rpx;
						height: 128rpx;
						border-radius: 27rpx;
					}

					.theAddress {
						width: 188rpx;
						height: 128rpx;
						// background: url('https://cdn.vrupup.com/s/116/img/tianXieDiZhiKuang.png') #6A4718;
						background-size: 100% 100%;
						border-radius: 26rpx;
						color: #FFF;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						font-size: 21rpx;
						padding: 0 13rpx;
						box-sizing: border-box;
						position: relative;

						&::after {
							content: '';
							width: 100%;
							height: 100%;
							position: absolute;
							left: 0%;
							top: 0;
							background: rgba(0, 0, 0, 0.5);
							border-radius: 26rpx;
						}

						.address {
							position: relative;
							z-index: 11;

							&::after {
								content: "";
								width: 45%;
								height: 4rpx;
								background-color: #FFF;
								position: absolute;
								left: -50%;
								top: 50%;
								transform: translateY(-50%);
							}

							&::before {
								content: "";
								width: 45%;
								height: 4rpx;
								background-color: #FFF;
								position: absolute;
								right: -50%;
								top: 50%;
								transform: translateY(-50%);
							}
						}

						.time {
							margin-top: 10rpx;
							z-index: 11;
						}
					}
				}

				.award312 {
					margin-left: 31rpx;
					margin-top: 8rpx;

					.award3121 {
						font-family: Alibaba PuHuiTi;
						font-weight: bold;
						font-size: 33rpx;
						color: #000000;
						line-height: 52rpx;

						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 350rpx;
					}

					.award3122 {
						width: 138rpx;
						height: 44rpx;
						margin-top: 13rpx;
						text-align: center;
						background: #FA7700;
						border-radius: 21rpx;
						border: 1px solid #000000;
						font-family: Alibaba PuHuiTi;
						font-weight: 500;
						font-size: 29rpx;
						color: #000000;
						line-height: 40rpx;
					}

					.yiLinQu {
						background: #5E5E5E;
						color: #FFFFFF;
					}
				}
			}
		}

		.award4 {
			text-align: center;
			margin: 280rpx 0 60rpx 0;

			image {
				width: 490rpx;
				height: 135rpx;
			}
		}

		.award5 {
			margin-top: 130rpx;
			text-align: center;

			.award51 {
				margin-bottom: 62rpx;
				position: relative;
				width: 636rpx;
				height: 487rpx;
				margin: 0 auto;
				position: relative;

				image {
					width: 636rpx;
					height: 487rpx;
				}
			}

			.award52 {
				image {
					width: 284rpx;
					height: 85rpx;
				}
			}

			.award53 {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 10rpx;
				top: 60rpx;
				z-index: 9;
				// background: rgba(0, 0, 0, 0.6);
				border-radius: 19rpx 115rpx 19rpx 105rpx;

				.award531 {
					height: 100%;

					.award5311 {
						margin-top: 150rpx;
						text-align: center;

						image {
							width: 360rpx;
							height: 46rpx;
						}
					}

					.award5312 {
						margin-top: 15rpx;
						width: 378rpx;
						height: 46rpx;
						font-family: Alibaba PuHuiTi;
						font-weight: 500;
						font-size: 49rpx;
						color: #FFFFFF;
						line-height: 68rpx;
						text-align: center;
						width: 100%;
					}

					.award5313 {
						margin-top: 170rpx;
						width: 378rpx;
						height: 46rpx;
						font-family: Alibaba PuHuiTi;
						font-weight: 500;
						font-size: 49rpx;
						color: #FFFFFF;
						line-height: 68rpx;
						text-align: center;
						width: 100%;
					}
				}
			}
		}


	}

	.award6 {
		position: fixed;
		bottom: 10%;
		text-align: center;
		width: 100%;

		image {
			width: 208rpx;
			height: 53rpx;
		}


		.award61 {
			font-family: Alibaba PuHuiTi;
			font-weight: bold;
			font-size: 25rpx;
			color: #000000;
			line-height: 29rpx;
			text-align: center;
		}

		.award62 {
			font-family: Alibaba PuHuiTi;

			font-size: 25rpx;
			color: #000000;
			line-height: 29rpx;
			text-align: center;
		}
	}

	.img {
		image {
			width: 417rpx !important;
			height: 54rpx !important;
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

	.u-subsection {
		border-radius: 30px !important;
	}

	.u-subsection__item__text {
		color: #000 !important;
	}

	.award2 .u-subsection .u-subsection__bar {
		background: #FA7700 !important;
		border-radius: 44rpx !important;
	}
</style>
<style lang="scss">
	.time {
		@include flex;
		align-items: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		margin: 0 auto;

		&__item {
			color: #fff;
			font-size: 12px;
			text-align: center;
		}
	}

	.award_tanc1 .u-count-down {
		font-size: 21rpx !important;
		color: #262626 !important;
	}
</style>
