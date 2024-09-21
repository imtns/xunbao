import {
	env
} from '@/http/env'
//获取胶囊
const getMenuButtonBoundingClientRect = () => {
	const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
	const systemInfo = wx.getSystemInfoSync();
	const {
		top,
		height
	} = menuButtonInfo;
	const {
		statusBarHeight
	} = systemInfo;
	const menuButtonHeight = top - statusBarHeight;
	return {
		width: menuButtonInfo.width,
		height: menuButtonHeight, // 胶囊高度
		top: statusBarHeight, // 胶囊顶部距离手机顶部的距离
		bottom: menuButtonHeight + menuButtonInfo.height, // 胶囊底部距离手机顶部的距离
		right: menuButtonInfo.right
	}
}
/**
 * 保存图片到系统相册
 * @param { String } imgUrl 图片路径，本地路径或线上路径
 */
const saveImageToPhotosAlbum = (imgUrl) => {
	return new Promise(async (resolve, reject) => {
		if (imgUrl.includes('https')) imgUrl = (await getImageInfo(imgUrl)).path
		uni.saveImageToPhotosAlbum({
			filePath: imgUrl,
			success: function() {
				resolve({
					status: 1,
					msg: '保存图片到系统相册成功'
				})
				alert('保存成功', 1)
			},
			fail(err) {
				if (err.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
					resolve({
						status: 0,
						msg: err
					})
					// alert('您拒绝了添加到相册授权')
				} else {
					resolve({
						status: -1,
						msg: err
					})
				}
			}
		})
		// })
	})
}

/**
 * 订阅消息
 * @param { Array } tmplIds 需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息
 */
const requestSubscribeMessage = (tmplIds) => {
	return new Promise((resolve, reject) => {
		uni.requestSubscribeMessage({
			tmplIds,
			success(res) {
				console.log("订阅消息ok", res)
				resolve(res)
			},
			fail(err) {
				console.log("订阅消息ok", err)
				resolve(err)
			}
		})
	})
}
/**
 * 文字轻提示
 * @param { String } 提示文字 
 * @param { Number } icon 提示icon
 * @param { Number } duration 提示时间
 */
const alert = (str, icon = 0, duration = 1500) => {
	uni.showToast({
		title: str + '',
		icon: ['none', 'success', 'loading'][icon],
		duration: duration
	})
}
/**
 * loading加载
 * @param { String } str 加载文案
 * @param {*} mask 
 */
const loading = (str = '加载中', mask = false) => {
	uni.showLoading({
		title: str,
		mask: mask
	})
}
/**
 * 关闭loading提示框
 */
const loading_h = () => {
	uni.hideLoading()
}
/**
 * 确认/取消弹窗
 * @param { String } title 弹窗标题
 * @param { String } content 弹窗询问内容
 * @param { String、Boolean } cancels 取消按钮文字文案和字体颜色/不显示取消按钮
 * @param { String } confirms 取消按钮文字文案和字体颜色
 */
const showModal = (title = "确认", content = "您确认进行此操作？", cancels = "取消,#666", confirms = "确认,#333") => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: title,
			content: content,
			showCancel: cancels ? true : false,
			cancelText: cancels ? (cancels.indexOf(',') != -1 ? cancels.split(",")[0] : cancels) :
				'取消',
			cancelColor: (cancels && cancels.indexOf(',') != -1) ? cancels.split(",")[1] : '#333',
			confirmText: confirms ? (confirms.indexOf(',') != -1 ? confirms.split(",")[0] :
				confirms) : '确认',
			confirmColor: (confirms && confirms.indexOf(',') != -1) ? confirms.split(",")[1] :
				'#333',
			success: (res) => {
				if (res.confirm) {
					resolve(true)
				} else {
					resolve(false)
				}
			}
		})
	})
}
/**
 * 设置页面标题
 * @param { String } title 页面标题
 */
const setTitle = (title = '微信小程序') => {
	uni.setNavigationBarTitle({
		title: title
	})
}
/**
 * 操作菜单
 * @param { Array } itemList 操作菜单信息
 */
const showSheet = (itemList) => {
	return new Promise(resolve => {
		uni.showActionSheet({
			itemList: itemList,
			success: res => {
				resolve({
					status: 1,
					index: res.tapIndex
				})
			},
			fail: res => {
				resolve({
					status: 0
				})
			}
		})
	})
}
/**
 * 获取小程序详细信息[**]
 */
const getWxConfig = () => {
	return new Promise((resolve) => {
		resolve(__wxConfig)
	})
}
/**
 * 获取手机系统信息
 */
const getSystemInfo = () => {
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			success(res) {
				resolve(res)
			}
		})
	})
}
/**获取dom节点
 * 
 * @param { String } ele dom节点
 */
const getDom = (ele, _this) => {
	return new Promise((resolve, reject) => {
		const query = uni.createSelectorQuery().in(_this)
		query.select(ele).boundingClientRect(res => {
			resolve(res)
		}).exec()
	})
}
/**
 * 设置tabbar右上角文字
 * @param { Number } index tabbar索引
 * @param { String } value 右上角文字
 */
const setTab = (index, value) => {
	uni.setTabBarBadge({
		index: index,
		text: typeof value == 'number' ? value + '' : value
	})
}
/**
 * 选择视频
 * @param { Number } sourceType 视频选择的来源（0：相册和相机，1：相机，2：相册）
 */
const chooseVideo = (sourceType) => {
	return new Promise((resolve, reject) => {
		uni.chooseVideo({
			sourceType: !sourceType ? ['album', 'camera'] : (sourceType == 1 ? ['camera'] : [
				'album'
			]),
			maxDuration: 60,
			camera: 'back',
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
/**
 * 播放视频
 * @param { String } ele video的id
 * @param { Boolean } isFullScreen 是否全屏
 */
const videoPlay = (ele, isFullScreen = true) => {
	let videoContext = uni.createVideoContext(ele)
	videoContext.play()
}
/**
 * 获取视频信息
 * @param { String } videoUrl 视频路径
 */
const getVideoInfo = videoUrl => {
	return new Promise((resolve, reject) => {
		uni.getVideoInfo({
			src: videoUrl,
			success: res => {
				resolve(res)
			},
			fail: err => {
				resolve(err)
			}
		})
	})
}
/**
 * 可返回跳转
 * @param { String } url 页面地址
 */
const jump_nav = url => {
	uni.navigateTo({
		url: url
	})
}
/**
 * 不可返回跳转
 * @param { String } url 页面地址
 */
const jump_red = url => {
	uni.redirectTo({
		url: url
	})
}
/**
 * 清除页面栈跳转
 * @param { String } url 页面地址
 */
const jump_rel = url => {
	uni.reLaunch({
		url: url
	})
}
/**
 * 跳转tabBar页
 * @param { String } url 页面地址
 */
const jump_swi = url => {
	uni.switchTab({
		url: url
	})
}
/**
 * 返回上一页面
 * @param { Number } delta 返回层级
 */
const jump_back = (delta) => {
	uni.navigateBack({
		delta
	})
}
/**
 * 操作本地缓存
 * @param { String } key 缓存键值
 * @param { String } value 缓存数据
 */
const storage = (key, value) => {
	if (value != null) {
		uni.setStorageSync(`${env}_${key}`, value)
	} else {
		if (key == null) {
			return uni.getStorageInfoSync()
		} else {
			if (key != '#') {
				if (key[0] == '#') {
					uni.removeStorageSync(`${env}_${key.slice(1)}`)
				} else {
					return uni.getStorageSync(`${env}_${key}`)
				}
			} else if (key == '#') {
				uni.clearStorageSync()
			}
		}
	}
}
/**
 * 选择/拍摄图片
 * @param { Number } count 选择/拍摄图片张数
 * @param { Number } type 是否选择压缩图（不传为两者都有，1为原图，2为压缩图）
 */
const chooseImage = (count = 1, type = 0) => {
	return new Promise(reject => {
		let sizeType = ['original', 'compressed']
		uni.chooseImage({
			count: count,
			sizeType: type == 0 ? sizeType : sizeType.slice(0 + type, 1 + type),
			sourceType: ['album', 'camera'],
			success(res) {
				reject(res)
			}
		})
	})
}
/**
 * 选择文件
 * @param { Number } count 选择/拍摄图片张数
 * @param { Number } type 是否选择压缩图（不传为两者都有，1为原图，2为压缩图）
 */
const chooseFile = (count = 1, type = ['.doc', '.docx', '.xlsx', 'xls']) => {
	return new Promise(reject => {
		uni.chooseFile({
			count: count, //默认100
			extension: type,
			success(res) {
				// console.log(JSON.stringify(res.tempFilePaths));
				reject(res)
			}
		})
	})
}
/**
 * 预览图片
 * @param { String } urls 预览图片地址
 * @param { Number } current 预览图片总张数
 */
const previewImage = (urls, current) => {
	uni.previewImage({
		urls: urls,
		current: current
	})
}
/**获取图片信息
 * 
 * @param { String } imgUrl 图片地址
 */
const getImageInfo = imgUrl => {
	console.log("获取图片信息", imgUrl)
	return new Promise(resolve => {
		uni.getImageInfo({
			src: imgUrl,
			success(res) {
				resolve(res)
			}
		})
	})
}
/**
 * 选择文件
 * @param { Number } count 可以选择的文件个数
 */
const chooseMessageFile = (count = 1) => {
	return new Promise(resolve => {
		uni.chooseMessageFile({
			count: count,
			type: 'file',
			success(res) {
				resolve(res)
			}
		})

	})
}
/**
 * 文件路径转换获取
 * @param { String } wxfileUrl 原文件路径
 */
const getFileSystemManager = (wxfileUrl) => {
	return new Promise((resolve, reject) => {
		const fsManager = wx.getFileSystemManager();
		fsManager.saveFile({
			tempFilePath: wxfileUrl,
			success: function(res) {
				resolve(res)
			},
			fail: function(err) {
				reject(err)
			}
		});
	})
}
/**
 * 上传文件
 * @param { Array } filePathArr 待上传列表
 * @param { String } url 上传接口地址
 */
const uploadFiles = (filePathArr, url) => {
	let imgList = []
	let _ulloadNum = 0
	return new Promise((resolve, reject) => {
		let eachUpload = () => {
			if (_ulloadNum >= filePathArr.length) {
				resolve(imgList)
				return
			}
			let uploadTask = uni.uploadFile({
				url: url,
				filePath: filePathArr[_ulloadNum],
				name: 'file',
				success: function(res) {
					imgList.push(JSON.parse(res.data).data)
					_ulloadNum++
					eachUpload()
				},
				fail(err) {
					reject(err)
				}
			})
			// uploadTask.onProgressUpdate((res) => {
			//   console.log('上传进度', res.progress)
			//   console.log('已经上传的数据长度', res.totalBytesSent)
			//   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
			// })
		}
		eachUpload()
	})
}
/**
 * 下载文件资源到本地
 * @param { String } filePath 文件地址
 */
const downloadFile = filePath => {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: filePath,
			success(res) {
				// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
				if (res.statusCode === 200) {
					resolve(res.tempFilePath)
				}
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
/**
 * 查看文件
 * @param { String } filePath 文件地址
 */
const openDocument = filePath => {
	downloadFile(filePath).then(res => {
		console.log("res", res)
		uni.openDocument({
			filePath: res,
			success(res) {
				console.log(res, '打开文档成功')
			},
			fail(err) {
				console.log(err, '打开文档失败')
			}
		})
	})
}
/**
 * 把canvas转换成本地图片路径
 * @param { String } canvasId canvas标签的id
 * @param { Number } x 开始转换的x坐标
 * @param { Number } y 开始转换的y坐标
 * @param { Number } w 开始转换的宽度
 * @param { Number } h 开始转换的高度
 * @param { Number } scale 缩放级别
 */
const canvasToTempImage = (canvasId, x = 0, y = 0, w, h, scale) => {
	return new Promise((resolve, reject) => {
		uni.canvasToTempFilePath({
			canvasId,
			x: x,
			y: y,
			width: w,
			height: h,
			destWidth: w * scale,
			destHeight: h * scale,
			success(res) {
				resolve(res.tempFilePath)
			},
			fail(res) {
				reject(res);
			}
		})
	})
}
/**
 * 生成海报
 * @param { Object } options 配置项
 */
const canvasImg = options => {
	return new Promise((resolve, reject) => {
		const ctx = uni.createCanvasContext(options.canvasId)
		ctx.setFillStyle('#fff')
		ctx.rect(0, 0, options.canvasSize.split("*")[0], options.canvasSize.split("*")[1])
		ctx.fill()
		if (options.imgList && options.imgList.length > 0) {
			let _allNum = options.imgList.length || 0
			let _curNum = 0
			let _getImage = []
			_getImageInfo()

			function _getImageInfo() {
				let _curimg = options.imgList[_curNum]
				getImageInfo(_curimg.url).then(res => {
					_curNum++
					_getImage.push(res)
					if (_curNum >= _allNum) {
						_drawImage()
					} else {
						_getImageInfo()
					}
				})
			}

			function _drawImage() {
				for (let i = 0; i < _getImage.length; i++) {
					let _curimg = options.imgList[i]
					_curimg.url = _getImage[i].path
					_curimg.imgW = _getImage[i].width
					_curimg.imgH = _getImage[i].height
					if (_curimg.isRadius) {
						ctx.save()
						ctx.beginPath()
						ctx.arc(_curimg.imgX + (_curimg.drawW || _curimg.imgW) / 2, _curimg.imgY + (_curimg
								.drawH || _curimg.imgH) / 2, (_curimg.drawW || _curimg.imgW) / 2, 0, 2 *
							Math.PI)
						ctx.clip()
					}
					let _scale = 1
					let _drawW = _curimg.imgW
					let _drawH = _curimg.imgH
					if (_curimg.drawW) {
						_scale = Math.min(_curimg.imgW / _curimg.drawW, _curimg.imgH / _curimg.drawH)
						_drawW = _curimg.drawW * _scale
						_drawH = _curimg.drawH * _scale
					}
					ctx.drawImage(_curimg.url, (_curimg.imgW - _drawW) / 2, (_curimg.imgH - _drawH) / 2,
						_drawW, _drawH, _curimg.imgX, _curimg.imgY, _curimg.drawW || _curimg.imgW,
						_curimg.drawH || _curimg.imgH)
					ctx.restore()
					if (i == _getImage.length - 1) {
						drawNext()
					}
				}
			}
		} else {
			drawNext()
		}

		function drawNext() {
			if (options.textList && options.textList.length > 0) {
				let _textList = options.textList
				for (let i = 0; i < _textList.length; i++) {
					let _wrap = _textList[i].wrap
					let _h = _textList[i].textY
					let _string = _textList[i].string
					if ((_textList[i].string.length > _wrap) && !_textList[i].isWrap) {
						let _arrText = []
						_arrText = [(_textList[i].string).replace(/\s+/g, "")]
						let _x = 0
						let _this = this
						calcImgText(_x)

						function calcImgText(x) {
							var res = []
							var str = ''
							var nums = 0
							for (var k = 0; k <= _arrText[x].length; k++) {
								if (nums < _wrap && !(k == _arrText[x].length)) {
									(/[0-9a-ln-z.]/.test(_arrText[x][k])) ? nums += 0.5: nums++
									str += _arrText[x][k]
								} else {
									res.push(str)
									let _item = cloneObj(_textList[i])
									_item.string = str
									_item.textY = _h
									if (_item.string.length > _wrap) _item.isWrap = true
									_textList.push(_item)
									_h += _item.lineHeight
									str = _arrText[x][k]
									nums = 1
								}
							}
						}

						function cloneObj(obj) {
							var newObj = {};
							if (obj instanceof Array) {
								newObj = [];
							}
							for (var key in obj) {
								var val = obj[key];
								newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
							}
							return newObj;
						}
						_textList.splice(i, 1)
					}
				}
				for (let i = 0; i < options.textList.length; i++) {
					let _curText = options.textList[i]
					// ctx.font = "50px ygyxsziti2"
					ctx.font =
						`${_curText.fontStyle || 'normal'} ${_curText.fontSize || 24}px ${_curText.fontFamily || 'Arial'}`
					// ctx.setFontSize(_curText.fontSize)
					ctx.setFillStyle(_curText.color)
					ctx.setTextAlign(_curText.textAlign || 'left')
					ctx.setTextBaseline('top')
					ctx.fillText(_curText.string, _curText.textX, _curText.textY)
					if (_curText.bold) {
						ctx.fillText(_curText.string, _curText.textX, _curText.textY - 0.5)
						ctx.fillText(_curText.string, _curText.textX - 0.5, _curText.textY)
					}
					ctx.fillText(_curText.string, _curText.textX, _curText.textY)
					if (_curText.bold) {
						ctx.fillText(_curText.string, _curText.textX, _curText.textY + 0.5)
						ctx.fillText(_curText.string, _curText.textX + 0.5, _curText.textY)
					}
				}
				//ctx.draw(true)
			}
			ctx.draw(true, () => {
				setTimeout(() => {
					canvasToTempImage(options.canvasId, 0, 0, options.canvasSize.split("*")[
						0], options.canvasSize.split("*")[1], options.scale).then(
						res => {
							resolve(res)
						})
				}, 100)
			})
		}
	})
}
// 获取当前时间和指定时间的天，时，分，秒
const getDateTime = (timeStr) => {
	const date = new Date(timeStr);
	const now = new Date();
	let delta = date - now; // 时间差，单位为毫秒
	if (delta < 0) {
		delta = 0; // 如果时间差为负，则设置为0
	}
	// 计算天、小时、分钟和秒
	const day = Math.floor(delta / (1000 * 60 * 60 * 24));
	delta -= day * (1000 * 60 * 60 * 24); // 减去天数对应的毫秒数
	const hour = Math.floor(delta / (1000 * 60 * 60)) % 24;
	delta -= hour * (1000 * 60 * 60); // 减去小时数对应的毫秒数
	const minute = Math.floor(delta / (1000 * 60)) % 60;
	delta -= minute * (1000 * 60); // 减去分钟数对应的毫秒数
	const second = Math.floor(delta / 1000) % 60;
	const positiveDay = Math.abs(day);
	return {
		day: positiveDay,
		hour: hour,
		minute: minute,
		second: second,
		time: positiveDay + '天' + hour + '小时' + minute + '分钟' + second + '秒'
	};
};

/**
 * 查询是否授权
 * @param { String } scope 授权项
 */
const getSetting = scope => {
	return new Promise((resolve, reject) => {
		console.log("scope", scope)
		uni.getSetting({
			success(res) {
				let _scope = res.authSetting[scope]
				console.log("查询是否授权查询是否授权2", res, _scope)
				if (_scope === undefined) {
					resolve({
						status: -1,
						msg: '用户未授过权',
						data: res
					})
				} else if (!_scope) {
					resolve({
						status: 0,
						msg: '用户拒绝过授权',
						data: res
					})
				} else {
					resolve({
						status: 1,
						msg: '用户已授权',
						data: res
					})
				}
			},
			fail(err) {
				resolve({
					status: -1,
					msg: '获取授权设置失败',
					data: err
				})
			}
		});

	})
}
/**
 * 打开系统授权设置页
 */
const openSetting = () => {
	return new Promise((resolve, reject) => {
		uni.openSetting({
			success: res => {
				if (res.authSetting['scope.writePhotosAlbum'] === true) {
					resolve()
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}



module.exports = {
	getSetting,
	getDateTime,
	openSetting,
	saveImageToPhotosAlbum,
	requestSubscribeMessage,
	alert,
	showModal,
	loading,
	loading_h,
	setTitle,
	showSheet,
	getWxConfig,
	getSystemInfo,
	getDom,
	setTab,
	chooseVideo,
	videoPlay,
	getVideoInfo,
	jump_nav,
	jump_red,
	jump_rel,
	jump_swi,
	jump_back,
	storage,
	chooseImage,
	chooseFile,
	previewImage,
	canvasImg,
	getImageInfo,
	canvasToTempImage,
	chooseMessageFile,
	uploadFiles,
	downloadFile,
	openDocument,
	getFileSystemManager,
	getMenuButtonBoundingClientRect
}