
import tool from './tool.js'
//判断渠道
const determineTheSceneJump = (scenc, scencVal, pageUrl) => {
	if (scenc == scencVal) {
		tool.jump_rel(pageUrl)
	}
}
//从地址栏获取传参
const getQueryString = name => {
  let after = window.location.href.split("?")[1]
  if (after) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let r = after.match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    } else {
      return null
    }
  }
}
//弹出、关闭弹窗
const showHidePopup = (page, popupType, type) => {
  if (!type) {
    page[popupType] = 1
  } else {
    page[popupType] = 2
    setTimeout(() => {
      page[popupType] = 0
    }, 500)
  }
}
/**
 * 深度拷贝对象
 * @param { Object } originalObj 待拷贝的原对象
 * @returns  拷贝出来的新对象
 */
const cloneObject = originalObj => {
  let d
  if (typeof originalObj === "object") {
    if (originalObj == null) {
      d = null
    } else {
      if (originalObj.constructor === Array) {
        d = []
        for (let i in originalObj) {
          d.push(cloneObject(originalObj[i]))
        }
      } else {
        d = {}
        for (let i in originalObj) {
          d[i] = cloneObject(originalObj[i])
        }
      }
    }
  } else {
    d = originalObj
  }
  return d
}
//获取当前时间
const getDate = () => {
  let dates = new Date()
  let years = dates.getYear() //获取当前年份(2位)
  let year = dates.getFullYear() //获取完整的年份(4位)
  let month = dates.getMonth() + 1 //获取当前月份(0-11,0代表1月)
  let date = dates.getDate() //获取当前日(1-31)
  let day = dates.getDay() //获取当前星期X(0-6,0代表星期天)
  let hours = dates.getHours() //获取当前小时数(0-23)
  let minute = dates.getMinutes() //获取当前分钟数(0-59)
  let second = dates.getSeconds() //获取当前秒数(0-59)
  let timeStamp = dates.getTime() //获取当前时间(从1970.1.1开始的毫秒数)
  let secs = dates.getMilliseconds() //获取当前毫秒数(0-999)
  let dateDate = dates.toLocaleDateString() //获取当前日期
  let dateTime = dates.toLocaleTimeString() //获取当前时间
  let dateDateTime = dates.toLocaleString() //获取日期与时间
  return {
    year,
    month,
    date,
    hours,
    minute,
    second,
    day,
    timeStamp,
    dateDateTime,
    dates: dateDateTime.split(' ')[0].replace(/\//g, '-')
  }
}
//获取距离某个日期固定天数的日期
const getDistance = (days = 7, ori_data) => {
  if (ori_data) ori_data = ori_data.replace(/-/g, "/")
  let date = ori_data ? new Date(ori_data) : new Date()
  date.setDate(date.getDate() + days)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    dates: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  }
}
//获取距离某个日期固定天数之前的日期
const getBeforeDate = (startDataTime, day) => {
  var today = new Date(startDataTime)
  var beforMilliseconds = today.getTime() - 1000 * 3600 * 24 * day
  var beforday = new Date()
  beforday.setTime(beforMilliseconds)
  var strYear = beforday.getFullYear()
  var strDay = beforday.getDate()
  var strMonth = beforday.getMonth() + 1
  if (strMonth < 10) {
    strMonth = "0" + strMonth
  }
  if (strDay < 10) {
    strDay = "0" + strDay
  }
  var strYesterday = strYear + "-" + strMonth + "-" + strDay
  return strYesterday
}
//时间戳转换时间
const timestampToTime = (timestamp, type = 0) => {
  var date = new Date(type ? timestamp : timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}
//倒计时(传秒数)
const minutesAndSeconds = (time, symbols) => {
  if (time < 0) {
    return {code: -1, msg: '时间格式有误'}
  }
  let _d, _h, _m, _s
  _d = parseInt(time / 86400)
  _h = parseInt(time / 3600) - _d * 24
  _m = parseInt(time / 60) - _d * 1440 - _h * 60
  _s = parseInt(time) - _d * 86400 - _h * 3600 - _m * 60
  _d < 10 ? (_d = '0' + _d) : _d = String(_d)
  _h < 10 ? (_h = '0' + _h) : _h = String(_h)
  _m < 10 ? (_m = '0' + _m) : _m = String(_m)
  _s < 10 ? (_s = '0' + _s) : _s = String(_s)
  return {
    code: 0,
    time: _d + (symbols || '天') + _h + (symbols || '时') + _m + (symbols || '分') + _s + (symbols ? '' : '秒'),
    times: {
      d: _d,
      h: _h,
      m: _m,
      s: _s
    }
  }
}
//动态秒数倒计时(常用于短信验证码)
const trendsCountDown = (pageThis, variables, second) => {
	return new Promise(resolve => {
		pageThis[variables] = second
		let _auto = setInterval(() => {
			pageThis[variables] = --second
			if (pageThis[variables] < 1) {
				clearInterval(_auto)
				resolve()
			}
		}, 1000)
	})
}
//某个时间距离当前时间转换
const distanceTime = (time, curTime) => {
  console.log(time, curTime)
  time = time.replace(/-/g, '/')
  if (curTime) curTime = curTime.replace(/-/g, '/')
  let _str = null
  let _date = new Date(curTime).getTime() || new Date().getTime()
  let _curDate = new Date(time).getTime()
  let _differDate = _date - _curDate
  let _min = parseInt(_differDate / 60000) > 0 ? parseInt(_differDate / 60000) : 1
  let _hour = parseInt(_min / 60)
  let _day = parseInt(_hour / 24)
  let _mon = parseInt(_day / 30)
  if (_min < 60) {
    _str = {
      ch: _min + "分钟前",
      en: _min + ' minutes ago'
    }
  } else if (_hour < 24) {
    _str = {
      ch: _hour + "小时前",
      en: _hour + ' hours ago'
    }
  } else if (_day < 30) {
    _str = {
      ch: _day + "天前",
      en: _day + ' days ago'
    }
  } else if (_mon < 12) {
    _str = {
      ch: _mon + "月前",
      en: _mon + ' months ago'
    }
  }
  return _str
}
//创建a标签并下载文件
const downloadFile = (downloadHref, isDelete = true) => {
  let a = document.createElement('a')
  a.setAttribute('href', downloadHref)
  document.body.appendChild(a)
  a.click()
  isDelete && a.parentNode.removeChild(a)
}
//判断屏幕方向
const getScreenOrientation = () => {
  if (window.orientation === 180 || window.orientation === 0) {
    return ('竖屏状态')
  }
  if (window.orientation == 90 || window.orientation == -90) {
    return ("横屏状态")
  }
}
//陀螺仪
const openGyroscope = () => {
  return new Promise(resolve => {
    if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
      window.DeviceOrientationEvent.requestPermission().then(state => {
        if (state === "granted") {
          resolve({
            code: 0,
            msg: '允许了陀螺仪权限'
          })
        } else if (state === "denied") {
          resolve({
            code: 1,
            msg: '拒绝了陀螺仪权限'
          })
        } else if (state === "prompt") {
          resolve({
            code: 2,
            msg: '用户进行其他操作'
          })
        }
      })
    } else {
      resolve({
        code: -1,
        msg: '您设备不支持陀螺仪功能'
      })
    }
  })
}
//生成随机字符串
const randomString = len => {
  len = len || 32
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
//生成随机数
const getRandomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
//获取图片旋转信息 返回值& 0°：1、顺时针90°：6、逆时针90°：8、180°：3
const getOrientation = file => {
  return new Promise(resolve => {
    var reader = new FileReader()
    reader.onload = function(e) {
      var view = new DataView(e.target.result)
      if (view.getUint16(0, false) != 0xFFD8) resolve(-2)
      var length = view.byteLength,
        offset = 2
      while (offset < length) {
        var marker = view.getUint16(offset, false)
        offset += 2
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) resolve(-1)
          var little = view.getUint16(offset += 6, false) == 0x4949
          offset += view.getUint32(offset + 4, little)
          var tags = view.getUint16(offset, little)
          offset += 2
          for (var i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              resolve(view.getUint16(offset + (i * 12) + 8, little))
        } else if ((marker & 0xFF00) != 0xFF00) break
        else offset += view.getUint16(offset, false)
      }
      resolve(-1)
    }
    reader.readAsArrayBuffer(file)
  })
}
//数组洗牌打乱
const shuffle = arr => {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  return _arr
}
/*两个数组之间的交集、差集、补集、并集 */
const getArrGather = (arr1, arr2) => {
  let sa = new Set(arr1),
    sb = new Set(arr2)
  let intersect = arr1.filter(x => sb.has(x)) // 交集
  let minus = arr1.filter(x => !sb.has(x)) // 差集
  let complement = [...arr1.filter(x => !sb.has(x)), ...arr2.filter(x => !sa.has(x))] // 补集
  let unionSet = Array.from(new Set([...arr1, ...arr2])) // 并集
  return {
    intersect,
    minus,
    complement,
    unionSet
  }
}
//设置页面滚动高度
const setPageScrollTop = scrollTop => {
  window.scrollTo(0, scrollTop)
  window.pageYOffset = scrollTop
  document.body.scrollTop = scrollTop
  document.documentElement.scrollTop = scrollTop
}
//获取界面宽高
const getScreenWidthHeight = () => {
  return new Promise(resolve => {
    resolve({
      width: document.body.clientWidth || document.documentElement.clientWidth,
      height: document.body.clientHeight || document.documentElement.clientHeight
    })
  })
}
//获取dom距离页面x、y方向的距离
const getDomPageDistance = dom => {
  return new Promise(resolve => {
    resolve({
      left: dom.offsetLeft,
      top: dom.offsetTop
    })
  })
}
//创建script标签并加载
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    let _script = document.createElement("script")
    _script.async = false
    _script.src = src
    let evtName = null
    let evtListener = null

    function logic() {
      _script.parentNode.removeChild(_script)
      _script.removeEventListener(evtName, evtListener, false)
      resolve()
    }
    evtName = "load"
    evtListener = logic
    // if (!-[1,]) {
    //   evtName = "readystatechange"
    //   evtListener = function () {
    //     (this.readyState == "loaded" || this.readyState == "complete") && logic()
    //   }
    // } else {
    //   evtName = "load"
    //   evtListener = logic
    // }
    _script.addEventListener(evtName, evtListener, false)
		console.log("document", document)
		console.log("document.body", document.body)
		console.log("_script", _script)
    document.body.appendChild(_script)

  })
}
//加载字体文件
const loadFonts = (fontName, fontUrl) => {
  return new Promise(async (resolve) => {
    let font = new FontFace(fontName, `url(${fontUrl})`)
    await font.load()
    // setTimeout(() => {
    document.fonts.add(font)
    resolve(font)
    // }, 500)
  })
}
//判断当前浏览器环境
const getBrowserEnvironment = () => {
  return new Promise(resolve => {
    let u = navigator.userAgent.toLowerCase(), environment
    if (u.indexOf('windowsWechat') > -1) {
      environment = {
        status: 1,
        name: "PC端微信浏览器"
      }
    } else if (u.indexOf('windows') > -1) {
      environment = {
        status: 2,
        name: "PC端普通浏览器"
      }
    } else if (u.indexOf('iphone') > -1) {
      environment = {
        status: 3,
        name: "移动端苹果ios浏览器"
      }
    } else if (u.indexOf('android') > -1) {
      environment = {
        status: 4,
        name: "移动端安卓Android浏览器"
      }
    } else if (u.indexOf('ipad') > -1) {
      environment = {
        status: 5,
        name: "IPad端浏览器"
      }
    } else {
      environment = {
        status: 6,
        name: "其它浏览器"
      }
    }
    Object.assign(environment, {
      isweChat: u.includes('micromessenger') || u.includes('MicroMessenger')
    })
    resolve(environment)
  })
}
//浏览器环境
const getIsWxClient = () => {
  return new Promise(resolve => {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
//判断当前手机系统（Android/ios） 
const isSystem = callback => {
  return new Promise(resolve => {
    let u = navigator.userAgent
    let isWx = (u.toLowerCase().match(/MicroMessenger/i) == "micromessenger")
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    let isIphone = /iphone/gi.test(window.navigator.userAgent)
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    let windowW = window.screen.width
    let windowH = window.screen.height
    let pixelRatio = window.devicePixelRatio
    let isX = isIphone && pixelRatio && pixelRatio === 3 && windowW === 375 && windowH === 812
    let isXsMax = isIphone && pixelRatio && pixelRatio === 3 && windowW === 414 && windowH === 896
    let isXR = isIphone && pixelRatio && pixelRatio === 2 && windowW === 414 && windowH === 896
    resolve({
      isAndroid: isAndroid,
      isiOS: isiOS,
      system: u,
      isWx,
      isX: {
        isX: isX || isXsMax || isXR,
        X: isX,
        XsMax: isXsMax,
        XR: isXR
      }
    })
  })
}
//audioContext播放音乐
const audioContextMusic = (mp3Url, clickEle, callback) => {
  let audioContext
  let audioBufferSourceNode
  let analyser
  let clickBtn = document.getElementById(clickEle)
  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window
    .msAudioContext
  audioContext = new window.AudioContext()
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  loadAudioFile(mp3Url)

  function loadAudioFile(url) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function(e) {
      decodecFile(this.response)
    }
    xhr.send()
  }

  function decodecFile(fileContent) {
    audioContext.decodeAudioData(fileContent, function(buffer) {
      start(buffer)
    })
  }

  function start(buffer) {
    if (audioBufferSourceNode) {
      audioBufferSourceNode.stop()
    }
    audioBufferSourceNode = audioContext.createBufferSource()
    audioBufferSourceNode.connect(analyser)
    analyser.connect(audioContext.destination)
    audioBufferSourceNode.buffer = buffer
    audioBufferSourceNode.loop = true
    audioBufferSourceNode.start(0)
    callback({
      status: 1
    })
  }
  clickBtn.onclick = function() {
    if (audioContext.state === "suspended") {
      audioContext.resume()
      callback({
        status: 1
      })
    } else if (audioContext.state === "running") {
      audioContext.suspend()
      callback({
        status: 2
      })
    }
  }
}
//保留n位小数
const retainedDecimal = (x, n, math) => {
  n = n || 2
  math = math || 'round'
  let f_x = parseFloat(x)
  if (isNaN(f_x)) {
    return 0
  }
  let _n = '1'
  for (let i = 0; i < n; i++) {
    _n += '0'
  }
  _n = Number(_n)
  if (math == 'none') {
    f_x = parseInt(x * _n) / _n
  } else if (math == 'round') {
    f_x = Math.round(x * _n) / _n
  } else if (math == 'floor') {
    f_x = Math.floor(x * _n) / _n
  }
  let s_x = f_x.toString()
  let pos_decimal = s_x.indexOf('.')
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }
  while (s_x.length <= pos_decimal + n) {
    s_x += '0'
  }
  return s_x
}
//图片base64路径处理
const base64Switch = base64 => {
  return "data:image/jpg;base64," + base64.slice(base64.indexOf("/9j"))
}
//js浮点数精度--两数相加
const accAdd = (num1, num2) => {
  let r1, r2, m
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return Math.round(num1 * m + num2 * m) / m
}
//js浮点数精度--两数相减
const accSub = (num1, num2) => {
  let r1, r2, m, n
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return parseFloat((Math.round(num1 * m - num2 * m) / m).toFixed(n))
}
//js浮点数精度--两数相乘 
const accMul = (num1, num2) => {
  let m = 0,
    s1 = num1.toString(),
    s2 = num2.toString()
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//js浮点数精度--两数相除
const accDiv = (num1, num2) => {
  let t1, t2, r1, r2
  try {
    t1 = num1.toString().split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split(".")[1].length
  } catch (e) {
    t2 = 0
  }
  r1 = Number(num1.toString().replace(".", ""))
  r2 = Number(num2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
//事件触发
const triggerEvent = (dom, eventName = 'click', canbubble = false, cancelable = true) => {
  return new Promise((resolve, reject) => {
    let _event = document.createEvent("MouseEvents")
    _event.initMouseEvent(eventName, canbubble, cancelable)
    if (typeof dom == 'string') dom = document.getElementById(dom)
    if (typeof dom != 'object') {
      reject({
        status: 1,
        message: 'dom传入有误，请传正确dom或正确dom的id值。'
      })
    } else {
      dom.dispatchEvent(_event)
      resolve({
        status: 0,
        message: `${eventName}事件触发成功。`
      })
    }
  })
}
/*h5生成图片*/
const canvasImg = (options) => {
  return new Promise(resolve => {
    let PSD_W = options.posterSize[0],
      PSD_H = options.posterSize[1],
      canvas = document.createElement('canvas'),
      devicePixelRatio = window.devicePixelRatio || 1
    let ctx = canvas.getContext("2d")
    let backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1
    let ratio = devicePixelRatio / backingStoreRatio
    canvas.width = (PSD_W * ratio) / 2
    canvas.height = (PSD_H * ratio) / 2
    ctx.scale(ratio / 2, ratio / 2)
    if (options.bgImg) {
      options.imgList.unshift({
        url: options.bgImg,
        imgW: PSD_W,
        imgH: PSD_H,
        imgX: 0,
        imgY: 0
      })
    }
    let _allNum = options.imgList.length || 0,
      _curNum = 0;
    (function _getImageInfo() {
      let _curimg = options.imgList[_curNum]
      getImageInfo(_curimg.url).then(res => {
        options.imgList[_curNum].newImg = res.newImg
        options.imgList[_curNum].width = res.width
        options.imgList[_curNum].height = res.height
        if (_curNum >= _allNum - 1) {
          startDraw()
        } else {
          _curNum++
          _getImageInfo()
        }
      })
    })()

    function handleBorderRect(ctx, x, y, w, h, r, color) {
      ctx.beginPath();
      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.lineTo(x + w, y + r);
      // 右上角
      ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
      ctx.lineTo(x + w, y + h - r);
      ctx.lineTo(x + w - r, y + h);
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
      ctx.lineTo(x + r, y + h);
      ctx.lineTo(x, y + h - r);
      // 左下角
      ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x + r, y);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    function startDraw() {
      //绘制图片
      for (var n in options.imgList) {
        let _rotate = options.imgList[n].rotate
        if (!options.imgList[n].radius) {
          drawImg()
        } else if (options.imgList[n].radius == "50%") {
          ctx.save()
          let r = options.imgList[n].imgW * 0.5
          ctx.arc(options.imgList[n].imgX + r, options.imgList[n].imgY + r, r, 0, 2 * Math.PI)
          ctx.clip()
          ctx.fill()
          drawImg(true)
          ctx.restore()
        } else {
          ctx.save()
          handleBorderRect(ctx, options.imgList[n].imgX, options.imgList[n].imgY, options.imgList[n].imgW, options
            .imgList[n].imgH, options.imgList[n].radius, '#ccc');
          ctx.clip();
          drawImg()
          ctx.restore()
        }

        function drawImg(arc) {
          ctx.beginPath()
          let _scale = 1,
            _curimg = options.imgList[n]
          let _drawW = _curimg.imgW,
            _drawH = _curimg.imgH,
            scaleType = 0,
            rx = options.imgList[n].imgW * 0.5,
            ry = options.imgList[n].imgH * 0.5
          if (_curimg.imgW) {
            _scale = Math.min(_curimg.width / _curimg.imgW, _curimg.height / _curimg.imgH)
            if (_curimg.width / _curimg.imgW > _curimg.height / _curimg.imgH) {
              scaleType = 1
            } else if (_curimg.width / _curimg.imgW < _curimg.height / _curimg.imgH) {
              scaleType = 2
            }
            _drawW = _curimg.width * _scale
            _drawH = _curimg.height * _scale
          }
          if (_rotate) {
            ctx.translate(options.imgList[n].imgX + rx, options.imgList[n].imgY + ry)
            ctx.rotate(_rotate * Math.PI / 180)
          }
          ctx.drawImage(
            _curimg.newImg,
            // vars["newImg" + n],
            scaleType == 1 ? (_curimg.width - _curimg.imgW * _scale) / 2 : 0,
            scaleType != 2 ? 0 : (_curimg.height - _curimg.imgH * _scale) / 2,
            scaleType == 1 ? _curimg.imgW * _scale : _curimg.width,
            scaleType == 1 ? _curimg.height : _curimg.imgH * _scale,
            _rotate ? 0 - rx : options.imgList[n].imgX,
            _rotate ? 0 - ry : options.imgList[n].imgY,
            _curimg.imgW || _drawW,
            _curimg.imgH || _drawH
          )
          if (_rotate) {
            ctx.rotate(_rotate * Math.PI * -1 / 180)
            ctx.translate((options.imgList[n].imgX + rx) * -1, (options.imgList[n].imgY + ry) * -1)
          }
        }
      }
      //绘制文字
      function drawFont() {
        let fonts = options.textList
        if (!fonts) return
        for (let i = 0; i < fonts.length; i++) {
          let _wrap = fonts[i].wrap
          let _h = fonts[i].textY
          let _string = fonts[i].string
          if ((_string.length > _wrap) && !fonts[i].isWrap) {
            let _arrText = []
            _arrText = [(_string).replace(/\s+/g, "")]
            let _x = 0
            let _this = this
            calcImgText(_x)

            function calcImgText(x) {
              let res = [],
                str = '',
                nums = 0
              for (var k = 0; k <= _arrText[x].length; k++) {
                if (nums < _wrap && !(k == _arrText[x].length)) {
                  (/[0-9a-ln-z.]/.test(_arrText[x][k])) ? nums += 0.5: nums++
                  str += _arrText[x][k]
                } else {
                  res.push(str)
                  let _item = cloneObj(fonts[i])
                  _item.string = str
                  _item.textY = _h
                  if (_item.string.length > _wrap) _item.isWrap = true
                  fonts.push(_item)
                  _h += _item.lineHeight
                  str = _arrText[x][k]
                  nums = 1
                }
              }
            }

            function cloneObj(obj) {
              let newObj = {};
              if (obj instanceof Array) {
                newObj = [];
              }
              for (let key in obj) {
                let val = obj[key];
                newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
              }
              return newObj;
            }
            fonts.splice(i, 1)
          }
        }
        for (let k in fonts) {
          let _rotate = fonts[k].rotate
          if (_rotate) {
            ctx.translate(fonts[k].textX, fonts[k].textY)
            ctx.rotate(_rotate * Math.PI / 180)
          }
          ctx.fillStyle = fonts[k].color
          ctx.font = fonts[k].style
          ctx.textBaseline = "hanging"
          ctx.textAlign = fonts[k].textAlign ? fonts[k].textAlign : "start"
          isSystem(res => {
            res.isiOS ? fonts[k].textY -= 6 : fonts[k].textY -= 2
          })
          if (fonts[k].vel) {
            for (let z in fonts[k].string) {
              ctx.fillText(
                fonts[k].string[z],
                fonts[k].textX,
                fonts[k].textY + z * (parseInt(fonts[k].fontSize) + fonts[k].vel)
              )
            }
          } else {
            ctx.fillText(fonts[k].string, _rotate ? 0 : fonts[k].textX, _rotate ? 0 : fonts[k].textY)
          }
          if (_rotate) {
            ctx.rotate(_rotate * -1 * Math.PI / 180)
            ctx.translate(fonts[k].textX * -1, fonts[k].textY * -1)
          }
        }
      }

      function isSystem(callback) {
        var u = navigator.userAgent
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        callback({
          isAndroid: isAndroid,
          isiOS: isiOS
        })
      }
      drawFont()
      setTimeout(() => {
        resolve(canvas.toDataURL("image/png"))
      }, 1000)
    }
  })
}
//获取图片信息
const getImageInfo = imgUrl => {
  return new Promise(resolve => {
    let _curImg = new Image()
    _curImg.setAttribute("crossOrigin", "anonymous")
    _curImg.src = imgUrl
    _curImg.onload = () => {
      resolve({
        newImg: _curImg,
        width: _curImg.width,
        height: _curImg.height
      })
    }
  })
}
//获取input[file]详细信息
const getFileData = file => {
  return new Promise(resolve => {
    var reader = new FileReader(),
      _blobUrl = null
    if (window.createObjectURL != undefined) {
      _blobUrl = window.createObjectURL(file)
    } else if (window.URL != undefined) {
      _blobUrl = window.URL.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
      _blobUrl = window.webkitURL.createObjectURL(file)
    }
    reader.readAsDataURL(file)
    reader.onload = e => {
      let img = new Image()
      img.src = e.target.result
      img.onload = () => {
        resolve({
          name: file.name,
          size: {
            bit: file.size,
            Kilobyte: Number((file.size / 1024).toFixed(2)),
            MByte: Number((file.size / 1024 / 1024).toFixed(2)),
            width: img.width,
            height: img.height
          },
          file: file,
          blob: _blobUrl,
          base64: reader.result
        })
      }
    }
  })
}
//获取base64图片大小
const getBase64Size = base64Url => {
  let equalIndex = base64Url.indexOf('='),
    base64Size = 0
  if (equalIndex > 0) {
    let str = base64Url.substring(0, equalIndex)
    let strLength = str.length;
    let fileLength = strLength - (strLength / 8) * 2
    base64Size = Math.floor(fileLength)
  } else {
    let strLength = base64Url.length;
    let fileLength = strLength - (strLength / 8) * 2
    base64Size = Math.floor(fileLength)
  }
  return {
    bit: base64Size,
    Kilobyte: Number((base64Size / 1024).toFixed(2)),
    MByte: Number((base64Size / 1024 / 1024).toFixed(2))
  }
}
//获取网络图片信息
const getNetWorkImg = img => {
  let imgElems = document.getElementById(img)
  let url = imgElems.src
  let varperformance = window.performance || window.msPerformance || window.webkitPerformance
  let iTime = varperformance.getEntriesByName(url)[0]
  let imgSize = iTime.decodedBodySize || iTime.encodedBodySize
  return {
    bit: imgSize,
    Kilobyte: Number((imgSize / 1024).toFixed(2)),
    MByte: Number((imgSize / 1024 / 1024).toFixed(2))
  }
}
//base64转文件流
const base64toFile = (dataurl, filename = 'file') => {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}
//压缩图片
const compressImg = (file, scale = 1, quality) => {
  return new Promise(resolve => {
    if (file.size && typeof file == 'object') {
      let fileSize = parseFloat(parseInt(file['size']) / 1024 / 1024).toFixed(2)
      let read = new FileReader()
      read.readAsDataURL(file)
      read.onload = () => {
        exportImg(read.result, fileSize, file.name)
      }
    } else if (file.includes('base64')) {
      exportImg(file, getBase64Size(file).MByte)
    } else if (file.includes('http') || file.includes('.')) {
      exportImg(file)
    } else {
      resolve({
        code: 1,
        msg: '请传正确格式的图片'
      })
    }

    function exportImg(imgUrl, fileSize, fileNmae) {
      let img = new Image()
      img.setAttribute("crossOrigin", "anonymous")
      img.src = imgUrl
      img.onload = () => {
        let w = img.width,
          h = img.height,
          base64
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.setAttribute("width", w * scale)
        canvas.setAttribute("height", h * scale)
        ctx.drawImage(img, 0, 0, w, h, 0, 0, w * scale, h * scale)
        if (quality) {
          base64 = canvas.toDataURL(file['type'], quality)
        } else {
          if (fileSize < 1) {
            base64 = canvas.toDataURL(file['type'], 1)
          } else if (fileSize > 1 && fileSize < 2) {
            base64 = canvas.toDataURL(file['type'], 0.5)
          } else {
            base64 = canvas.toDataURL(file['type'], 0.2)
          }
        }
        getFileData(base64toFile(base64, fileNmae)).then(res => {
          resolve(res)
        })
      }
    }
  })
}

module.exports = {
  getQueryString,
  showHidePopup,
  getDate,
  getDistance,
  getBeforeDate,
  timestampToTime,
	trendsCountDown,
  minutesAndSeconds,
  distanceTime,
  getOrientation,
  shuffle,
  getArrGather,
  setPageScrollTop,
  getScreenWidthHeight,
  getDomPageDistance,
  getBase64Size,
  getNetWorkImg,
  base64toFile,
  compressImg,
  loadScript,
  downloadFile,
  getScreenOrientation,
  openGyroscope,
  randomString,
  getRandomNum,
  loadFonts,
  getBrowserEnvironment,
  isSystem,
  audioContextMusic,
  retainedDecimal,
  base64Switch,
  getIsWxClient,
  accAdd,
  accSub,
  accMul,
  accDiv,
  getFileData,
  getImageInfo,
  canvasImg,
  triggerEvent,
  cloneObject
}
