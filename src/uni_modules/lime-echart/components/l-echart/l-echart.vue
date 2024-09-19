<template>
	<view class="lime-echart" :style="customStyle" v-if="canvasId" >
		<!-- #ifndef APP-NVUE -->
		<canvas
			class="lime-echart__canvas"
			v-if="use2dCanvas"
			type="2d"
			:id="canvasId"
      :canvas-id="canvasId"
			:style="'width:' + width + 'px;height:' + height + 'px'"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
		/>
		<canvas
			class="lime-echart__canvas"
			v-else
			:width="nodeWidth"
			:height="nodeHeight"
			:style="'width:' + width + 'px;height:' + height + 'px'"
			:canvas-id="canvasId"
			:id="canvasId"
			:disable-scroll="isDisableScroll"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
			@mousedown="touchStart"
			@mousemove="touchMove"
			@mouseup="touchEnd"
		/>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<web-view
			class="lime-echart__canvas"
			:id="canvasId"
      :canvas-id="canvasId"
			:webview-styles="webviewStyles"
			ref="webview"
			src="/uni_modules/lime-echart/static/index.html"
			@pagefinish="finished = true"
			@onPostMessage="onMessage"
		></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
// #ifdef VUE3
// #ifdef APP-PLUS
global = {}
// #endif
// #endif
// #ifndef APP-NVUE
import {Canvas, setCanvasCreator, dispatch} from './canvas';
import { compareVersion, wrapTouch, devicePixelRatio } from './utils';
import regeneratorRuntime from 'regenerator-runtime';
// #endif
// #ifdef APP-NVUE
import { base64ToPath } from './utils';
// #endif
const charts = {}
const echartsObj = {}
export default {
	name: 'lime-echart',
	props: {
		// #ifdef MP-WEIXIN || MP-TOUTIAO
		type: {
			type: String,
			default: '2d'
		},
		// #endif
		// #ifdef APP-NVUE
		webviewStyles: Object,
		// hybrid: Boolean,
		// #endif
		customStyle: String,
		isDisableScroll: Boolean,
		isClickable: {
			type: Boolean,
			default: true
		},
    canvasName: {
      type: String,
      default: ''
    }
	},
	data() {
		return {
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
			use2dCanvas: true,
			// #endif
			// #ifndef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
			use2dCanvas: false,
			// #endif
			width: null,
			height: null,
			nodeWidth: null,
			nodeHeight: null,
			canvasNode: null,
			config: {},
			inited: false,
			finished: false,
			file: '',
			platform: ''
		};
	},
	computed: {
		canvasId() {
			return this.canvasName || `lime-echart${this._uid || this._.uid}`
		}
	},
	beforeDestroy() {
		this.clear()
		this.dispose()
	},
	created() {
		// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
		const { SDKVersion, version, platform, environment } = uni.getSystemInfoSync();
		// #endif
		// #ifdef MP-WEIXIN
		this.isPC = /windows/i.test(platform)
		this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '2.9.2') >= 0 && !((/ios/i.test(platform) && /7.0.20/.test(version)) || /wxwork/i.test(environment)) && !this.isPC;
		// #endif
		// #ifdef MP-TOUTIAO
		this.isPC = /devtools/i.test(platform)
		this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '1.78.0') >= 0;
		// #endif
		// #ifdef MP-ALIPAY
		this.use2dCanvas = this.type === '2d' && compareVersion(my.SDKVersion, '2.7.0') >= 0;
		// #endif
	},
	methods: {
		// #ifdef APP-NVUE
		onMessage(e) {
			const res = e?.detail?.data[0] || null;
			if (res?.event) {
				if(res.event === 'inited') {
					this.inited = true
				}
				this.$emit(res.event, JSON.parse(res.data));
			} else if(res?.file){
				this.file = res.data
			} else if(!res[0] && JSON.stringify(res[0]) != '{}'){
				console.error(res);
			} else {
				console.log(...res)
			}
		},
		// #endif
		setChart(callback) {
			if(!this.chart) {
				console.warn(`组件还未初始化，请先使用 init`)
				return
			}
			if(typeof callback === 'function' && this.chart) {
				callback(this.chart);
			}
			// #ifdef APP-NVUE
			if(typeof callback === 'function') {
				this.$refs.webview.evalJs(`setChart(${JSON.stringify(callback.toString())}, ${JSON.stringify(this.roptions)})`);
			}
			// #endif
		},
		setOption() {
			if (!this.chart || !this.chart.setOption) {
				console.warn(`组件还未初始化，请先使用 init`)
				return
			}
			// #ifndef APP-NVUE
			this.chart.setOption(...arguments);
			// #endif
			// #ifdef APP-NVUE
			this.$refs.webview.evalJs(`setOption(${JSON.stringify(arguments)})`);
			// #endif
		},
		showLoading() {
			if(this.chart) {
				// #ifndef APP-NVUE
				this.chart.showLoading()
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJs(`showLoading()`);
				// #endif
			}
		},
		hideLoading() {
			if(this.chart) {
				// #ifndef APP-NVUE
				this.chart.hideLoading()
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJs(`hideLoading()`);
				// #endif
			}
		},
		clear() {
			if(this.chart) {
				// #ifndef APP-NVUE
				this.chart.clear()
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJs(`clear()`);
				// #endif
			}
		},
		dispose() {
			if(this.chart) {
				// #ifndef APP-NVUE
				this.chart.dispose()
				// #endif
				// #ifdef APP-NVUE
				this.$refs.webview.evalJs(`dispose()`);
				// #endif
			}
		},
		canvasToTempFilePath(args = {}) {
			// #ifndef APP-NVUE
			const { use2dCanvas, canvasId, canvasNode } = this;
			return new Promise((resolve, reject) => {
				const copyArgs = Object.assign({
					canvasId,
					success: resolve,
					fail: reject
				}, args);
				if (use2dCanvas) {
					delete copyArgs.canvasId;
					copyArgs.canvas = canvasNode;
				}
				uni.canvasToTempFilePath(copyArgs, this);
			});
			// #endif
			// #ifdef APP-NVUE
			this.file = ''
			this.$refs.webview.evalJs(`canvasToTempFilePath()`);
			return new Promise((resolve, reject) => {
				this.$watch('file', async (file) => {
					if(file) {
						const tempFilePath = await base64ToPath(file)
						resolve(args.success({tempFilePath}))
					} else {
						reject(args.fail({error: ``}))
					}
				})
			})
			// #endif
		},
		async init(echarts, callback) {
			// #ifndef APP-NVUE
			if(arguments.length < 2) {
				console.error('缺少参数：init(echarts, chart => {})')
				return
			}
			let config = await this.getContext();
			if(typeof callback === 'function') {
				setCanvasCreator(echarts, config)
				this.chart = echarts.init(config.canvas, null, config)
				callback(this.chart, config)
			} else {
				console.error('callback 非 function')
			}
			// #endif
			// #ifdef APP-NVUE
			await this.getContext();
			if(!arguments.length) {
				console.error('缺少参数：init(chart => {})')
				return
			}
			const find = [...arguments].find(v => typeof v === 'function')
			if(find) {
				this.chart = {
					setOption: (options) => {
						this.roptions = options
					}
				}
				callback(this.chart)
				this.$refs.webview.evalJs(`init(${JSON.stringify(find.toString())}, ${JSON.stringify(this.roptions)})`)
			} else {
				console.error('callback 非 function')
			}
			// #endif
		},
		getContext() {
			// #ifdef APP-NVUE
			if(this.finished) {
				return Promise.resolve(this.finished)
			}
			return new Promise(resolve => {
				this.$watch('finished', (val) => {
					if(val) {
						resolve(this.finished)
					}
				})
			})
			// #endif
			// #ifndef APP-NVUE
			const { use2dCanvas} = this;
			let dpr = devicePixelRatio
			if (use2dCanvas) {
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`#${this.canvasId}`)
						.fields({
							node: true,
							size: true
						})
						.exec(res => {
							let { node, width, height } = res[0];
							this.width = width = width || 300;
							this.height = height = height || 300;
							const ctx = node.getContext('2d');
							const canvas = new Canvas(ctx, this.canvasId, true, node);
							resolve({ canvas, width, height, devicePixelRatio: dpr, node });
						});
				});
			}
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					.select(`#${this.canvasId}`)
					.boundingClientRect()
					.exec(res => {
						if (res) {
							let { width, height } = res[0];
							this.width = width = width || 300;
							this.height = height = height || 300;
							// #ifdef MP-TOUTIAO
							dpr = !this.isPC ? devicePixelRatio : 1// 1.25
							// #endif
							// #ifdef MP-ALIPAY
							dpr = devicePixelRatio
							// #endif
							// #ifndef MP-ALIPAY || MP-TOUTIAO
							dpr = this.isPC ? devicePixelRatio : 1
							// #endif
							this.nodeWidth = width * dpr;
							this.nodeHeight = height * dpr;
							const ctx = uni.createCanvasContext(this.canvasId, this);
							const canvas =  new Canvas(ctx, this.canvasId, false);
							resolve({ canvas, width, height, devicePixelRatio: dpr });
						}
					});
			});
			// #endif
		},
		// #ifndef APP-NVUE
		touchStart(e) {
			this.isDown = true
			if (this.chart && (e.touches.length > 0 || e.type == 'mousedown')) {
				const touch = e.touches[0] || {x: e.clientX, y: e.clientY};
				const handler = this.chart.getZr().handler;
				dispatch.call(handler, 'mousedown', touch)
				dispatch.call(handler, 'mousemove', touch)
				handler.processGesture(wrapTouch(e), 'start');
			}
		},
		touchMove(e) {
			if (this.chart && (e.touches.length > 0 || e.type == 'mousemove' && this.isDown)) {
				const handler = this.chart.getZr().handler;
				dispatch.call(handler, 'mousemove', e.touches[0] || {x: e.clientX, y: e.clientY})
				handler.processGesture(wrapTouch(e), 'change');
			}
		},
		touchEnd(e) {
			this.isDown = false
			if (this.chart) {
				const touch = e.changedTouches ? e.changedTouches[0] || {x: e.clientX, y: e.clientY} : {};
				const handler = this.chart.getZr().handler;
				dispatch.call(handler, 'mouseup', touch)
				if(this.isClickable) {
					dispatch.call(handler, 'click', touch)
				}
				handler.processGesture(wrapTouch(e), 'end');
			}
		}
		// #endif
	}
};
</script>
<style scoped lang="scss">
.lime-echart {
  // #ifndef APP-NVUE
  width: 100%;
  height: 100%;
  // #endif
  // #ifdef APP-NVUE
  flex:1;
  // #endif
  position: relative;

  &__canvas {
    // #ifndef APP-NVUE
    width: 100%;
    height: 100%;
    // #endif
    // #ifdef APP-NVUE
    flex:1;
    // #endif
  }
}
</style>
