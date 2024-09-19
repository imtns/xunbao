<template>
	<view class="oh page box">
		<!-- <view class="ad_load10" v-show="youx_zdao_id == 5">
			  <image :src="`${ASSETSURL}image/ad_load11.png`"></image>
		  </view> -->
		<!-- 	<view class="bacBG">
			  <image :src="`${ASSETSURL}img/homeBG.png`" mode=""></image>
		  </view> -->
		<view class="add_container flex-ali-col" v-show="quan_tc">
			<image :src="`${ASSETSURL}ad_16.png`" class="ad_16"></image>
			<view class="add_container2">
				<u-line-progress :percentage="percentage" :showText="false" activeColor="#FA7700"
					height="18"></u-line-progress>
			</view>
			<view class="add_container3">{{ percentage }}%</view>
		</view>
		<view class="container" v-show="!quan_tc">
			<!-- <u-navbar title=" " leftIcon=" " :fixed="false" placeholder bgColor="#febd01"></u-navbar> -->
			<view class="container_bj">
				<u-image :src="ASSETSURL + 'image/ad_load11.png'" width="750rpx" height="1418rpx"
					v-if="youx_zdao_id == 5"></u-image>
				<!-- <image :src="ASSETSURL + 'ad_1.png'"
					  style="width: 100vw;height: 100vh; position: absolute; left: 0; bottom: 0;bottom: -40rpx;" v-else>
				  </image> -->
				<view :style="{ opacity: effEShow ? '1' : '0' }"
					style="width: 100vw; height: 100vh; position: absolute; left: 0; bottom: 0; bottom: 0rpx; transition: all 0.5s"
					v-else>
					<sequenceEffect ref="homeDx" :sequenceList="homeDxList" @loadOk="loadOk"></sequenceEffect>
				</view>
				<!-- <u-image  width="750rpx" height="100vh" mode="widthFix" ></u-image> -->
				<!-- <image src="ASSETSURL + 'ad_1.png'" mode="widthFix" style="width: 750rpx;height: 1420rpx;" ></image> -->

				<view class="miao_d" v-show="!youx_zdao">
					<view class="miao_d1" @click="handleDoubleClick1"></view>
					<view class="miao_d2" @click="handleDoubleClick1"></view>
					<view class="miao_d3" @click="handleDoubleClick1"></view>
					<view class="miao_d4" @click="handleDoubleClick1"></view>
					<view class="miao_d5" @click="handleDoubleClick1"></view>
				</view>
			</view>

			<view class="container_dibu oh" v-show="container_dibu">
				<view class="container_dibu2 le" @click="renw_2">
					<image :src="`${ASSETSURL}ad_3.png`"></image>
				</view>
				<view class="container_dibu2 le" @click="renw_3">
					<image :src="`${ASSETSURL}ad_4.png`"></image>
				</view>
				<view class="container_dibu2 le" @click="show_2 = true">
					<image :src="`${ASSETSURL}ad_5.png`"></image>
				</view>
				<view class="container_dibu1 le scale-wave" @click="renw_1">
					<image :src="`${ASSETSURL}ad_2.png`"></image>
				</view>
			</view>
			<!-- <tanc1></tanc1> -->
			<!-- 游戏指导 -->
			<view class="ppp" v-if="youx_zdao"> </view>
			<view class="youx_zdao" v-if="youx_zdao" @click="youx_zdao_xyb">
				<view class="out" @click="userCompleteNotice"> </view>
				<block v-for="(item, index) in 8" :key="index">
					<image :src="`${ASSETSURL}guide/${index + 1}.png`" :class="{ cur: youx_zdao_id == index + 1 }"
						style="width: 100vw; height: 100vh"></image>
				</block>
			</view>
			<!-- 弹窗语音识别 -->
			<dy-record v-if="showRecord" :showRecord="showRecord" @close="showRecord = false" ref="record"
				@detailCloce="detailCloce"></dy-record>
			<!-- 活动规则 -->
			<u-popup :show="show_2" mode="center" :safeAreaInsetBottom="false" bgColor="transparent"
				@click="show_2 = false" :overlayOpacity="0.8">
				<view class="warper">
					<view class="warper1">
						<view class="warper11" style="overflow-y: auto; overflow-x: hidden; width: 100%; height: 100%">
							<!-- <u-parse :content="content" :tagStyle="style"></u-parse> -->
							<image :src="`${ASSETSURL}image/guize.png`" mode="widthFix" style="width: 560rpx"></image>
							<!-- <u-image  mode="" width="560rpx"></u-image> -->
						</view>
					</view>
					<view class="warper2" @click="show_2 = false">
						<image src="https://cdn.vrupup.com/s/116/ad_14.png"></image>
					</view>
				</view>
			</u-popup>
			<!-- 分享弹窗 -->
			<u-popup :show="show_3" mode="center" :safeAreaInsetBottom="false" bgColor="transparent"
				@click="show_3 = false" :overlayOpacity="0.8">
				<view class="warper">
					<view class="warperTanC">
						<view class="warpertc">
							分享专属链接 邀请新人参与 双方都将
							<text style="color: #fa7700">获得卡片或丰厚奖励</text>
							哦~ 记住，分享链接将在
							<text style="color: #fa7700">每日0点失效</text>
							抓紧时间行动起来吧！
						</view>
						<view class="yaoQin">
							<button type="primary" open-type="share" class="btn">
								<image :src="`${ASSETSURL}show_hyou1.png`"></image>
							</button>
						</view>
					</view>
					<view class="warperTc" @click="show_3 = false">
						<image :src="`${ASSETSURL}tan2_0.png`"></image>
					</view>
				</view>
			</u-popup>
			<dy-prize ref="dyPrize2" seus="1" :show="showPrize" :item="prizeDetail" @close="showPrize = false"
				@getZlyq="showPrize = false"></dy-prize>
			<!-- 寻找宝藏 -->
			<u-popup :show="show_1" :safeAreaInsetBottom="false" bgColor="transparent" @click="show_1 = false"
				:overlayOpacity="overlayOpacity">
				<view class="container_tanc">
					<!-- <view class="justify-end" style="margin-right: 30rpx">
						  <dy-button fontSize="24" width="122rpx" height="50rpx">去完成</dy-button>
					  </view> -->
					<view class="arCard">
						<u-image :src="ASSETSURL + 'ad_7.png'" width="683rpx" height="225rpx"></u-image>
						<view class="arContent">
							<view class="flex-bet" style="margin-bottom: 20rpx">
								<view class="arText">
									<view class="">AR扫码（{{ scan.finishTimes || 0 }}/{{ scan.totalTimes || 0 }}）</view>
									<text class="">扫描"嗨体”，集卡片赢奖励</text>
								</view>
								<dy-button fontSize="24" width="122rpx" btn_bg="#847b73" height="50rpx"
									v-if="scan.finishTimes == scan.totalTimes">已完成</dy-button>
								<dy-button fontSize="24" width="122rpx" height="50rpx" @click="arCard"
									v-else>去完成</dy-button>
							</view>
							<u-line-progress :percentage="(scan.finishTimes / scan.totalTimes) * 100" :showText="false"
								height="14rpx" activeColor="#FA7700" inactiveColor="#000000"></u-line-progress>
						</view>
					</view>
					<view class="flex-bet" style="margin-top: 38rpx">
						<block v-for="(item, index) in taskList" :key="index">
							<view class="task" :style="{ 'background-image': `url(${ASSETSURL + item.icon}.png)` }">
								<view class="taskName">
									{{ item.name }}
									<text v-if="index != taskList.length - 1">({{ item.now }}/{{ item.max }})</text>
								</view>
								<view style="margin-top: 6rpx">
									<block v-if="item.todaySignStatus">
										<u-line-progress :percentage="100" :showText="false" height="14rpx"
											activeColor="#FA7700" inactiveColor="#000000"
											v-if="item.todaySignStatus"></u-line-progress>
										<u-line-progress :percentage="0" :showText="false" height="14rpx"
											activeColor="#FA7700" inactiveColor="#000000" v-else></u-line-progress>
									</block>
									<block v-else>
										<u-line-progress :percentage="(item.now / item.max) * 100" :showText="false"
											height="14rpx" activeColor="#FA7700"
											inactiveColor="#000000"></u-line-progress>
									</block>
								</view>
								<view class="taskText">{{ item.text }}</view>
								<view class="flex-bet">
									<!-- <dy-button fontSize="20" width="92rpx" height="36rpx" @click="tanc(item.tan)"
										  v-if="item.tan">{{ item.btnList[0] }}</dy-button> -->
									<!-- 	<dy-button fontSize="20" width="92rpx" height="36rpx" btn_bg="#847b73" v-if="item.id == 4 && item.now < item.max">{{ item.btnList[0] }}</dy-button> -->
									<dy-button fontSize="20" width="92rpx" height="36rpx" btn_bg="#847b73"
										v-if="item.todaySignStatus">{{ item.btnList[1] }}</dy-button>
									<dy-button fontSize="20" width="92rpx" height="36rpx"
										@click="$u.route(item.page), getSignin(item, index)"
										v-else-if="item.now < item.max">
										{{ item.btnList[0] }}
									</dy-button>
									<dy-button fontSize="20" width="92rpx" height="36rpx" btn_bg="#847b73"
										v-else>{{ item.btnList[1] }}</dy-button>
								</view>
							</view>
						</block>
					</view>
					<view class="flex-cen" style="margin-top: 50rpx">
						<!-- <u-image :src="ASSETSURL + 'ad_13.png'" width="120rpx" height="24rpx"></u-image> -->
					</view>
					<image class="close" @click="show_1 = false" :src="`${ASSETSURL}ad_14.png`"></image>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import {
		lsGet
	} from '@/utils/util'
	import api from '@/pages-game/xunbao/api/api'
	import tool from '@/pages-game/xunbao/js/tool'
	import store from '@/store'
	import dyRecord from '@/pages-game/xunbao/components/dy-record.vue'
	import dyPrize from '@/pages-game/xunbao/components/dy-prize.vue'
	import sequenceEffect from '@/pages-game/xunbao/components/sequenceEffect/sequenceEffect.vue'
	import {
		reportClickEvent,
		reportExposeEvent
	} from '@/utils/report/report'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			dyRecord,
			dyPrize,
			sequenceEffect,
			...mapState(['isLogin', 'userInfo'])
		},

		data() {
			return {
				effEShow: false, //首页特效
				homeDxList: {
					url: `https://cdn.vrupup.com/s/116/homeDx/1.png`,
					num: 29,
					initIndex: 1,
					speed: 100,
					loop: true,
					autoplay: false
				}, //序列帧
				openType: 0, //1语音识别 2终极奖励
				showPrize: false,
				prizeDetail: {},
				lastTapTimeoutFunc: null,
				lastTapDiffTime: 0,
				show_hyou: false, //分享好友
				showRecord: false,
				quan_tc: false, //loading
				show_1: false, //任务弹窗
				show_2: false, //规则弹窗
				show_3: false, //分享弹窗
				content: `22`,
				youx_zdao: false, //游戏规则
				youx_zdao_id: 1, //游戏指导1
				scan: null, //扫码
				container_dibu: true,
				overlayOpacity: 0.8,
				taskList: [{
						name: '每日问答',
						max: 1,
						now: 0,
						icon: 'ad_10',
						text: '答对问题，集卡 片赢奖励',
						page: '/pages-game/xunbao/pages-list/dayAnswer/dayAnswer',
						btnList: ['去完成', '已完成']
					},
					{
						name: '语音识别',
						max: 9,
						id: 2,
						now: 0,
						icon: 'ad_11',
						text: '读出嗨体广告语,集卡片赢奖励',
						tan: 1,
						btnList: ['去完成', '已完成']
					},
					{
						id: 3,
						name: '分享活动',
						max: 3,
						now: 0,
						icon: 'ad_8',
						text: '邀请新人参与,集卡片赢奖励',
						btnList: ['去分享', '领取', '已领取']
					},
					{
						id: 4,
						name: '连续签到',
						isNum: false,
						todaySignStatus: false,
						max: 3,
						now: 0,
						icon: 'ad_9',
						text: '连续签到3天,集卡片赢奖励',
						btnList: ['去签到', '已签到']
					}
				], //任务列表
				style: {
					// 字符串的形式
					p: 'font-size:32rpx;line-height: 45rpx',
					span: 'font-size: 30rpx;line-height: 45rpx'
				},
				percentage: 0
			}
		},
		created() {
			this.getUserInfo()
			tool.loading('')
		},

		onShow() {
			reportExposeEvent({
				activityName: '游戏首页浏览',
				actionRank: 0,
				activityId: 'game_xunbao_home_view',
				activityContent: {}
			})
			this.getActivityTaskList()
			setTimeout(() => {
				console.log(uni.getStorageSync('todaySignStatus'), 'aaa306')
				if (uni.getStorageSync('todaySignStatus') == 1) {
					console.log('tiaoguo')
					this.youx_zdao = false
				}
			}, 100)
		},
		onLoad(ope) {
			this.add_jsq()
		},
		methods: {
			//语音识别成功返回
			detailCloce(e) {
				this.prizeDetail = e
				this.showPrize = true
				this.$nextTick(() => {
					this.$refs.dyPrize2.play2()
				})
			},
			loadOk() {
				console.log('序列完成1111')
				this.effEShow = true
				tool.loading_h()
				this.$refs.homeDx.play()
			},
			handleDoubleClick1() {
				if (!this.isLogin) {
					reportClickEvent({
						activityName: '游戏首页跳转登录',
						actionRank: 0,
						activityId: 'game_xunbao_home_click_login',
						activityContent: {}
					})
					return tool.jump_nav('/pages-sub/login/index')
				}
				// 单击或双击
				let _this = this
				let curTime = new Date().getTime()
				let lastTime = _this.lastTapDiffTime
				_this.lastTapDiffTime = curTime
				//两次点击间隔小于300ms, 认为是双击
				let diff = curTime - lastTime
				if (diff < 300) {
					console.log('双击')
					this.showPrize = false
					this.triggerBuryPoint()
					reportClickEvent({
						activityName: '首页埋点点击',
						actionRank: 0,
						activityId: 'game_xunbao_click_point',
						activityContent: {}
					})
					//_this.handleVideo('screen',index)自定义事件
					clearTimeout(_this.lastTapTimeoutFunc) // 成功触发双击事件时，取消单击事件的执行
				} else {
					// 单击事件延时300毫秒执行
					_this.lastTapTimeoutFunc = setTimeout(function() {
						console.log('单击')
						//_this.handleVideo('playOrStop',index)自定义事件
					}, 300)
				}
			},
			// 查询活动任务接口
			getActivityTaskList() {
				api.getActivityTaskList()
					.then((res) => {
						console.log(res.data)
						this.scan = res.data[0]
						this.taskList[0].max = res.data[3].totalTimes
						this.taskList[0].now = res.data[3].finishTimes

						this.taskList[1].max = res.data[1].totalTimes
						this.taskList[1].now = res.data[1].finishTimes

						this.taskList[2].max = res.data[2].totalTimes
						this.taskList[2].now = res.data[2].finishTimes

						this.taskList[3].max = res.data[4].totalTimes
						this.taskList[3].now = res.data[4].finishTimes
						this.taskList[3].todaySignStatus = res.data[4].todaySignStatus
					})
					.catch((err) => {})
			},
			// 全局奖励判断
			quan_typoe(e) {
				this.showPrize = false
				if (e == 'kapian') {
					console.log(1111, this.$refs.dyPrize2)
					this.showPrize = true
					this.$nextTick(() => {
						this.$refs.dyPrize2.play2()
					})
				} else if (e == 'jiangli') {
					console.log(2222)
					// tool.jump_nav('/pages-game/xunbao/pages-list/advertising/advertising')
					this.showPrize = true
				} else if (e == 'kong') {
					this.showPrize = true
				}
				// else if (e == 'kong') {
				// 	console.log(0);
				// 	this.showRecord = true;
				// }
			},
			close() {
				this.show_hyou = false
				// console.log('close');
			},
			//双击
			triggerBuryPoint() {
				// someClickEvent() 全局埋点
				api.triggerBuryPoint()
					.then((res) => {
						console.log(res.data)
						this.prizeDetail = res.data
						this.triggerCode = res.data.triggerCode
						uni.setStorageSync('triggerCode', res.data.triggerCode)
						uni.setStorageSync('dropPrize', res.data.dropPrize)
						// triggerCode
						this.quan_typoe(res.data.prizeType)
					})
					.catch((err) => {})
			},
			//签到
			continueSign(e, inx) {

				api.continueSign().then((res) => {
					console.log(res, '--------')
					tool.alert(res.message)
					this.getActivityTaskList()
					if (res.data.finish) {
						this.prizeDetail = res.data
						this.showPrize = true
						this.$nextTick(() => {
							if (data.prizeType == 'kapian') {
								this.$refs.dyPrize2.play2()
							}
						})
					}
					// this.$set(this.taskList[inx].btnList, 0, '已签到');
				})
			},
			//签到 分享等
			getSignin(e, inx) {
				reportClickEvent({
					activityName: '好友分享页跳转登录',
					actionRank: 0,
					activityId: 'game_xunbao_index_click_task',
					activityContent: {
						name: e.name
					}
				})
				console.log(e, '------------')
				// someClickEvent() 全局埋点
				if (e.id == 4) {
					uni.$u.debounce(() => this.continueSign(e, inx), 500)
				}
				if (e.id == 2) {
					this.show_1 = false
					this.showRecord = true
					// this.$nextTick(() =>{
					// 	this.$refs.record.queryAd();
					// })
				}
				if (e.id == 3) {
					api.shareActivity().then((res) => {
						if (res.code == 200) {
							store.commit('storeShareCode', res.data.shareCode)
							console.log(store.state.shareCode, '-------shareCode-------')
							this.show_1 = false
							this.show_3 = true
						}
					})
				}
			},
			handleChildEvent(e) {
				console.log('Data from child:', e)
				this.openType = e
			},
			tanc(e) {
				console.log(e)
				if (e == 1) {
					this.show_1 = false
					this.showRecord = true
					return
				}
				this.show_1 = false
				this.openType = e
				console.log(e)
			},
			arCard() {
				tool.jump_nav('/pages-game/xunbao/pages-list/codes/codes')
			},
			youx_zdao_xyb() {
				this.youx_zdao_id = this.youx_zdao_id + 1
				if (this.youx_zdao_id == 9) {
					this.youx_zdao = false
					this.userCompleteNotice()
				}
			},
			add_jsq() {
				this.timer = setInterval(() => {
					this.percentage = uni.$u.range(0, 100, this.percentage + 1)
					if (this.percentage == 100) {
						clearInterval(this.timer)
						setTimeout(() => {
							this.quan_tc = false
						}, 200)
					}
				}, 30)
			},
			renw_1() {
				if (!this.isLogin) {
					reportClickEvent({
						activityName: '游戏首页跳转登录',
						actionRank: 0,
						activityId: 'game_xunbao_home_click_login',
						activityContent: {}
					})
					return tool.jump_nav('/pages-sub/login/index')
				}
				reportClickEvent({
					activityName: '寻找宝藏',
					actionRank: 0,
					activityId: 'game_xunbao_click_seek',
					activityContent: {}
				})
				// someClickEvent() 全局埋点
				this.getActivityTaskList()
				console.log(11)
				this.show_1 = true
			},
			renw_3() {
				if (!this.isLogin) {
					reportClickEvent({
						activityName: '游戏首页跳转登录',
						actionRank: 0,
						activityId: 'game_xunbao_home_click_login',
						activityContent: {}
					})
					return tool.jump_nav('/pages-sub/login/index')
				}
				tool.jump_nav('/pages-game/xunbao/pages-list/award/award')
			},
			renw_2() {
				if (!this.isLogin) {
					reportClickEvent({
						activityName: '游戏首页跳转登录',
						actionRank: 0,
						activityId: 'game_xunbao_home_click_login',
						activityContent: {}
					})
					return tool.jump_nav('/pages-sub/login/index')
				}
				tool.jump_nav('/pages-game/xunbao/pages-list/card/card')
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
					})
					.catch((err) => {})
			},
			//获取用户信息（请求示例）
			getUserInfo() {
				api.getUserInfo()
					.then((res) => {
						console.log('【获取用户信息】', res)
						// let userInfo = uni.getStorageSync('userInfo') || {};
						uni.setStorageSync('newUserFlag', res.data.newUserFlag)
						if (res.data.finishGuide == 0) {
							this.youx_zdao = true
							this.youx_zdao_id = 1
						}

						store.commit('setUserInfo', use)
					})
					.catch((err) => {
						console.log('【token可能失效】', err)
					})
			},

			cs_chun() {
				api.getUserInfo()
					.then((res) => {})
					.catch((err) => {})
			}
		}
	}
</script>
<style>
	@import './css/base.css';
</style>
<style scoped lang="scss">
	.box {
		position: relative;

		.bacBG {
			position: absolute;
			left: 0;
			top: 0%;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
	}

	.container_bj {
		// position: fixed;
		// bottom: 0;

		.miao_d {
			position: absolute;
			top: 15%;
			// background: red;
			left: 0;
			width: 100vw;
			height: 1112rpx;
			opacity: 0.5;
			z-index: 999;

			.miao_d1 {
				position: absolute;
				width: 300rpx;
				height: 300rpx;
				top: 101rpx;
				z-index: 9999;
				left: 431rpx;
			}

			.miao_d2 {
				position: absolute;
				width: 350rpx;
				height: 300rpx;
				top: 281rpx;
				z-index: 9999;
				left: 31rpx;
			}

			.miao_d3 {
				position: absolute;
				width: 300rpx;
				height: 300rpx;
				top: 644rpx;
				z-index: 9999;
				left: 16rpx;
			}

			.miao_d4 {
				position: absolute;
				width: 380rpx;
				height: 380rpx;
				top: 430rpx;
				z-index: 9999;
				right: 0;
			}

			.miao_d5 {
				position: absolute;
				width: 380rpx;
				height: 300rpx;
				top: 800rpx;
				z-index: 9999;
				right: 0;
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

	.add_container {
		position: absolute;
		top: 463rpx;
		left: 50%;
		transform: translateX(-50%);

		.ad_16 {
			width: 212rpx;
			height: 184rpx;
		}

		.add_container2 {
			width: 474rpx;
			height: 36rpx;
			margin: 8rpx 0 27rpx;
		}

		.add_container3 {
			font-weight: 600;
			font-size: 32rpx;
			color: #000000;
		}
	}

	.ppp {
		width: 750rpx;
		height: 1480rpx;
	}

	.youx_zdao {
		position: fixed;
		top: 0;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.7);
		width: 100vw;
		height: 100vh;
		overflow-y: auto;

		image {
			width: 100vw;
			height: 100vh;
			position: absolute;
			top: 0;
			left: 0;
			transition: all 0.5s;
			z-index: 0;
			opacity: 0;
		}

		.cur {
			z-index: 1;
			opacity: 1;
		}

		.out {
			position: absolute;
			top: 36rpx;
			right: 52rpx;
			width: 100rpx;
			height: 100rpx;
			z-index: 99999;
		}
	}

	.container {
		min-height: 100vh;
		// background-color: ;
		background-size: 100% 100%;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 60rpx;
		box-sizing: border-box;

		.warper {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;

			.warper1 {
				background: url('https://cdn.vrupup.com/s/116/ad_15.png') no-repeat;
				background-size: 100% 100%;
				width: 677rpx;
				height: 1196rpx;
				padding: 273rpx 40rpx 158rpx 80rpx;

				.warper11 {
					image {
						width: 276rpx;
					}
				}
			}

			.warperTanC {
				width: 622rpx;
				height: 678rpx;
				background: url('https://cdn.vrupup.com/s/116/image/fXTC.png') no-repeat;
				background-size: 100% 100%;

				.warpertc {
					margin-top: 202rpx;
					margin-left: 94rpx;
					margin-right: 88rpx;
					font-family: Alibaba PuHuiTi;
					font-weight: 500;
					font-size: 29rpx;
					color: #000000;
					line-height: 50rpx;
				}

				.yaoQin {
					margin-top: 63rpx;

					image {
						width: 283rpx;
						height: 85rpx;
					}
				}
			}

			.warperTc {
				position: relative;

				image {
					position: absolute;
					height: 59rpx;
					width: 59rpx;
					right: 16rpx;
					top: -410rpx;
				}
			}

			.warper2 {
				position: relative;

				image {
					position: absolute;
					height: 59rpx;
					width: 59rpx;
					right: 16rpx;
					top: -520rpx;
				}
			}
		}

		.container_tanc {
			background: url('https://cdn.vrupup.com/s/116/ad_6.png') no-repeat;
			background-size: 100%;
			width: 750rpx;
			height: 944rpx;
			padding: 280rpx 40rpx 0;
			position: relative;

			.arCard {
				width: 684rpx;
				height: 226rpx;
				position: relative;

				.arContent {
					width: 420rpx;
					position: absolute;
					left: 220rpx;
					top: 64rpx;

					.arText {
						font-weight: 500;
						font-size: 26rpx;
						color: #000000;
						line-height: 36rpx;

						text {
							letter-spacing: -1px;
							color: #3f3f3f;
						}
					}
				}
			}

			.task {
				width: 160rpx;
				height: 202rpx;
				background-size: 100%;
				padding: 16rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;

				&>view {
					width: 146rpx;
				}

				.taskName {
					font-weight: bold;
					font-size: 20rpx;
					color: #000000;
					line-height: 30rpx;

					text {
						font-weight: 500;
						font-size: 18rpx;
					}
				}

				.taskText {
					font-weight: 500;
					font-size: 20rpx;
					color: #3f3f3f;
					margin: 10rpx 0 12rpx;
				}
			}

			.close {
				position: absolute;
				top: 32rpx;
				right: 32rpx;
				width: 60rpx;
				height: 60rpx;
			}
		}

		.container_dibu {
			position: fixed;
			bottom: 40rpx;
			padding: 15rpx;
			background: rgba(10, 10, 10, 0.45);
			border-radius: 33rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			z-index: 999;

			.container_dibu1 {
				margin-right: 18rpx;
				margin-left: 30rpx;

				image {
					width: 264rpx;
					height: 93rpx;
				}
			}

			.container_dibu2 {
				margin-left: 15rpx;

				image {
					width: 105rpx;
					height: 87rpx;
				}
			}
		}
	}

	.show_hyou {
		position: relative;

		.show_hyou0 {
			position: absolute;
			z-index: 999;
			right: 20rpx;
			top: -82rpx;

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.show_hyou1 {
			image {
				width: 622rpx;
				height: 678rpx;
			}
		}

		.show_hyou1_1 {
			width: 417rpx;
			height: 178rpx;
			font-family: Alibaba PuHuiTi;
			font-weight: 500;
			font-size: 29rpx;
			color: #000000;
			line-height: 50rpx;
			position: absolute;
			top: 191rpx;
			left: 91rpx;

			text {
				color: #fa7700;
			}
		}

		.show_hyou2 {
			position: absolute;
			top: 434rpx;
			left: 171rpx;

			image {
				width: 283rpx;
				height: 85rpx;
			}
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