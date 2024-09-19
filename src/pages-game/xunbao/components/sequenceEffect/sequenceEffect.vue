<template>
	<div class="sequence poa">
		<div class="currency poa" v-if="sequenceListIndex >= 0">
			<block v-for="(item, index) in sequenceLists" :key="index">
				<image class="poa" :class="sequenceListIndex == index ? 'on' : ''" :src="item.url" @load="load"></image>
			</block>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		name: "",
		props: {
			//序列信息
			sequenceList: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				page: null, //父组件
				sequenceIndex: null, //动态索引
				sequenceListIndex: -1, //序列索引
				imgTotalNum: 0, //图片总数 
				sequenceLists: [],
				loadNum: 0 //图片加载数量
			}
		},
		mounted() {
			this.sequenceInit()
		},
		methods: {
			//序列帧初始化
			sequenceInit(sequence = "sequenceList") {
				let _sequence = [],
					{
						url,
						num,
						speed,
						loop,
						initIndex,
						autoplay
					} = this[sequence]
				this.imgTotalNum = num
				// if (this[sequence].autoSequence) this.autoSequence = this[sequence].autoSequence
				if (url.indexOf('//') == -1) {
					this.page = this[sequence].page
					this.sequenceIndex = this[sequence].sequenceIndex || 'sequenceListIndex'
				}
				this.sequenceListIndex = this[sequence].initIndex - 1
				let _getPublicUrl = this.getPublicUrl(url)
				for (let i = _getPublicUrl.startNum; i < num + _getPublicUrl.startNum; i++) {
					_sequence.push({
						url: `${_getPublicUrl.publicUrl}${i}.${_getPublicUrl.format}`,
						num,
						speed: this[sequence].speed,
						loop,
						initIndex
					})
				}
				this.sequenceLists = _sequence
				if (autoplay) this.play()
			},
			//序列帧播放
			play(loop = this.sequenceLists[0].loop, sequence = "sequenceList") {
				let _num = 1
				clearInterval(this[sequence].autoSequence)
				if (typeof loop == 'object') {
					if (typeof loop[0] != 'number' || typeof loop[1] != 'number' || loop[0] >= loop[1]) {
						console.warn("传参有误，正确示例：this.$refs.sequence.play([5, 12])")
						return
					}
					this.page ? this.page[this.sequenceIndex] = loop[0] - 1 : this.sequenceListIndex = loop[0] - 1
				}
				return new Promise(resolve => {
					this[sequence].autoSequence = setInterval(() => {
						let _curSequenceIndex = this.page ? this.page[this.sequenceIndex] : this
							.sequenceListIndex || 0
						_curSequenceIndex++
						if ((_curSequenceIndex <= this.sequenceLists[0].num - 1 && typeof loop !=
								'number' && typeof loop != 'object') || (typeof loop == 'number' &&
								_curSequenceIndex < parseInt(loop) - 1) || (typeof loop == 'object' &&
								_curSequenceIndex < loop[1])) {
							this.page ? this.page[this.sequenceIndex] = _curSequenceIndex : this
								.sequenceListIndex = _curSequenceIndex
						} else {
							if ((((typeof loop == 'boolean' && loop) || (typeof loop == 'string' && _num <
									loop)) && !(typeof loop == 'number')) || (typeof loop == 'object')) {
								_num++
								this.page ? this.page[this.sequenceIndex] = (typeof loop == 'object' ?
									loop[0] - 1 : 0) : this.sequenceListIndex = (typeof loop ==
									'object' ? loop[0] - 1 : 0)
							} else {
								this.page ? (this.page[this.sequenceIndex] = typeof loop == 'number' ?
									parseInt(loop) - 1 : this.sequenceLists[0].initIndex ? this
									.sequenceLists[0].initIndex - 1 : -1) : (this.sequenceListIndex =
									typeof loop == 'number' ? parseInt(loop) - 1 : this.sequenceLists[
										0].initIndex ? this.sequenceLists[0].initIndex - 1 : -1)
								if (typeof loop == 'number') this.sequenceLists[0].loop = false
								clearInterval(this[sequence].autoSequence)
								resolve()
							}
						}
					}, this.sequenceLists[0].speed)
				})
			},
			//序列帧暂停
			pause(pauseNum, sequence = "sequenceList") {
				if (pauseNum) {
					this.page ? this.page[this.sequenceIndex] = pauseNum - 1 : this.sequenceListIndex = pauseNum - 1
				}
				clearInterval(this[sequence].autoSequence)
			},
			//图片加载
			load() {
				++this.loadNum
				this.loadNum == this.imgTotalNum && this.$emit("loadOk")
			},
			//图片src解析
			getPublicUrl(url) {
				let urlArray = url.split("/")
				let order = urlArray[urlArray.length - 1].replace(/[^\d]/ig, '')
				let _index = url.indexOf(`${order}.`)
				return {
					publicUrl: url.slice(0, _index),
					format: url.slice(url.indexOf(`${order}.`) + order.length + 1),
					startNum: parseInt(order)
				}
			}
		},
		computed: {
			//插槽
			isSlot() {
				return this.$slots.default
			}
		}
	}
</script>

<style scoped>
	.sequence {
		width: 100%;
		height: 100%;
	}

	.currency {
		z-index: 10;
		width: 100%;
		height: 100%;
		overflow: hidden;
		font-size: 0;
	}

	.currency image {
		width: 100%;
		height: 100%;
		opacity: 0;
		top: 50%;
		transform: translateY(-50%);
		position: absolute;
	}

	.currency image.on {
		width: 100%;
		height: 100%;
		opacity: 1;
	}
</style>