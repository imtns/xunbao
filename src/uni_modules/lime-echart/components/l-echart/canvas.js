const cacheChart = {}
class Image {
	constructor() {
		// __zr.dom
		this.currentSrc = null
		this.naturalHeight = 0
		this.naturalWidth = 0
		this.width = 0
		this.height = 0
		this.tagName = 'IMG'
	}
	set src(src) {
		this.currentSrc = src
		uni.getImageInfo({
			src,
			success: (res) => {
				this.naturalWidth = this.width = res.width
				this.naturalHeight = this.height = res.height
				this.onload()
			},
			fail: () => {
				this.onerror()
			}
		})
	}
	get src() {
		return this.currentSrc
	}
}
export class Canvas {
	constructor(ctx, canvasId, isNew, canvasNode={}) {
		cacheChart[canvasId] = {ctx}
		this.canvasId = canvasId;
		this.chart = null;
		this.isNew = isNew
		this.canvasNode = canvasNode;
		if (!isNew) {this._initStyle(ctx)}
		this._initEvent();
	}

	getContext(type) {
		if (type === '2d') {
			return this.ctx;
		}
	}
	setChart(chart) {
		this.chart = chart;
	}
	attachEvent() {
	}
	detachEvent() {
	}
	addEventListener() {}
	removeEventListener() {}
	_initCanvas(zrender, ctx) {
		zrender.util.getContext = function() {
			return ctx;
		};
		zrender.util.$override('measureText', function(text, font) {
			ctx.font = font || '12px sans-serif';
			return ctx.measureText(text, font);
		});
	}
	_initStyle(ctx) {
		const styles = [
			'fillStyle',
			'strokeStyle',
			'fontSize',
			'globalAlpha',
			'opacity',
			'textAlign',
			'textBaseline',
			'shadow',
			'lineWidth',
			'lineCap',
			'lineJoin',
			'lineDash',
			'miterLimit',
			// #ifdef MP-TOUTIAO
			'font'
			// #endif
		];
		const fontSizeReg = /([\d\.]+)px/;
		const colorReg = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\b/g;
		styles.forEach(style => {
			Object.defineProperty(ctx, style, {
				set: value => {
					if (style === 'font' && fontSizeReg.test(value)) {
						const match = fontSizeReg.exec(value);
						ctx.setFontSize(match[1]);
						return;
					}
					if (style === 'opacity') {
						ctx.setGlobalAlpha(value)
						return;
					}
					if (style !== 'fillStyle' && style !== 'strokeStyle' || value !== 'none' && value !== null) {
						// #ifdef H5 || APP-PLUS || MP-BAIDU
						if(typeof value == 'object') {
							if (value.hasOwnProperty('colorStop') || value.hasOwnProperty('colors')) {
								ctx['set' + style.charAt(0).toUpperCase() + style.slice(1)](value);
							}
							return
						} 
						// #endif
						// #ifdef MP-TOUTIAO
						if(colorReg.test(value)) {
							value = value.replace(colorReg, '#$1$1$2$2$3$3')
						}
						// #endif
						ctx['set' + style.charAt(0).toUpperCase() + style.slice(1)](value);
					}
				}
			});
		});
		if(!this.isNew) {
			ctx.uniDrawImage = ctx.drawImage
			ctx.drawImage = (...a) => {
				a[0] = a[0].src
				ctx.uniDrawImage(...a)
			}
		}
		if(!ctx.createRadialGradient) {
			ctx.createRadialGradient = function() {
				return ctx.createCircularGradient(...[...arguments].slice(-3))
			};
		}
		// 字节不支持
		if (!ctx.strokeText) {
			ctx.strokeText = (...a) => {
				ctx.fillText(...a)
			}
		}
		// 钉钉不支持 
		if (!ctx.measureText) {
			const strLen = (str) => {
				let len = 0;
				for (let i = 0; i < str.length; i++) {
					if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
						len++;
					} else {
						len += 2;
					}
				}
				return len;
			}
			ctx.measureText = (text, font) => {
				let fontSize = 12;
				if (font) {
					fontSize = parseInt(font.match(/([\d\.]+)px/)[1])
				}
				fontSize /= 2;
				return {
					width: strLen(text) * fontSize
				};
			}
		}
	}

	_initEvent(e) {
		this.event = {};
		const eventNames = [{
			wxName: 'touchStart',
			ecName: 'mousedown'
		}, {
			wxName: 'touchMove',
			ecName: 'mousemove'
		}, {
			wxName: 'touchEnd',
			ecName: 'mouseup'
		}, {
			wxName: 'touchEnd',
			ecName: 'click'
		}];

		eventNames.forEach(name => {
			this.event[name.wxName] = e => {
				const touch = e.touches[0];
				this.chart.getZr().handler.dispatch(name.ecName, {
					zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
					zrY: name.wxName === 'tap' ? touch.clientY : touch.y
				});
			};
		});
	}

	set width(w) {
		this.canvasNode.width = w
	}
	set height(h) {
		this.canvasNode.height = h
	}

	get width() {
		return this.canvasNode.width || 0
	}
	get height() {
		return this.canvasNode.height || 0
	}
	get ctx() {
		return cacheChart[this.canvasId]['ctx'] || null
	}
	set chart(chart) {
		cacheChart[this.canvasId]['chart'] = chart
	}
	get chart() {
		return cacheChart[this.canvasId]['chart'] || null
	}
}

export function dispatch(name, {x,y}) {
	this.dispatch(name, {
		zrX: x,
		zrY: y,
		preventDefault: () => {},
		stopPropagation: () =>{}
	});
}
export function setCanvasCreator(echarts, {canvas, node}) {
	// echarts.setCanvasCreator(() => canvas);
	echarts.registerPreprocessor(option => {
		if (option && option.series) {
			if (option.series.length > 0) {
				option.series.forEach(series => {
					series.progressive = 0;
				});
			} else if (typeof option.series === 'object') {
				option.series.progressive = 0;
			}
		}
	});
	function loadImage(src, onload, onerror) {
		let img = null
		if(node && node.createImage) {
			img = node.createImage()
			img.onload = onload.bind(img);
			img.onerror = onerror.bind(img);
			img.src = src;
			return img
		} else {
			img = new Image()
			img.onload = onload.bind(img)
			img.onerror = onerror.bind(img);
			img.src = src
			return img
		}
	}
	echarts.setPlatformAPI({
		loadImage: canvas.setChart ? loadImage : null,
		createCanvas(){
			return canvas
		}
	})
}