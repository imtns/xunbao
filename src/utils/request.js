/**
 * @files 请求方法封装
 */
import { Encrypt, Decrypt } from './encyption.js' // 首次打开初始化信息

/**
 * REQUEST 拦截
 */

function reqIntercept(config) {
  console.log('%c%s', 'color: red; background: yellow; font-family: Micirosft Yahei; font-size: 24px;', ' 入参明细：')
  console.log(JSON.parse(JSON.stringify(config)))

  if (!uni.userInfo.isLoading) {
    // 开启Loading状态
    // wx.setUserInfo({
    //     isLoading: true
    // })
    // // 开启Loading
    // wx.showLoading({
    //     title: '请稍候...'
    // })
  } // 判断给数据加密

  if (config.data && config.data.isEncry) {
    Reflect.deleteProperty(config.data, 'isEncry')
    config.data = {
      requestData: Encrypt(JSON.stringify(config.data))
    }
  } // DO SOMETHING...

  return config
}
/**
 * RESPONSE 拦截
 */

function resIntercept(result) {
  // 处理异常JSON字符串
  const retData = result

  if (typeof retData.data === 'string') {
    try {
      retData.data = JSON.parse(retData.data)
    } catch {}
  } // 输出日志

  console.log('%c%s', 'color: green; background: yellow; font-family: Micirosft Yahei; font-size: 24px;', ' 出参明细：')
  console.log(retData)

  if (uni.userInfo.isLoading) {
    // 隐藏Loading
    // wx.hideLoading();
    // // 关闭Loading状态
    // wx.setUserInfo({
    //     isLoading: false
    // })
  } // 判断是否需要回调

  return retData
}
/**
 * 异常拦截
 */

function catchHandle(err) {
  // 判断解密
  const retErr = err // 输出日志

  console.log('%c%s', 'color: white; background: red; font-family: Micirosft Yahei; font-size: 24px;', ' 出参明细：')
  console.log(retErr) // 隐藏Loading

  uni.hideLoading() // 抛出异常到页面

  const errMsg =
        (err.data && err.data.message) ||
        (() => {
          switch (err.errMsg) {
            case 'request:fail timeout':
              return '请求超时'

            case 'request:fail url not in domain list':
            case 'uploadFile:fail createUploadTask:fail url not in domain list':
              return '域名不在白名单'

            default:
              return '网络错误'
          }
        })() // 认证失败 重新登录

  try {
    if (retErr.data.code === 500 && retErr.data.data === 'Full authentication is required to access this resource') {
      // 清除用户信息
      uni.clearUserInfo()
      uni.cToast({
        title: '登录已过期，请重新登录'
      }) // 记录当前路由

      uni.cacheBeforeRoute()
      uni.toLogin()
    }
  } catch (e) {}

  uni.cToast({
    title: errMsg
  })
  return err
}
/**
 * 合并请求参数
 */

function mergeParams(options) {
  // 合并请求头 header
  try {
    const curToken = {
      Authorization: uni.userInfo.token
    }
    const header = Object.assign(curToken, options.header)
    if (uni.userInfo.token !== 'Bearer ') options.header = header // 拼装 url

    if (options.url.match(/https?:\/\//g)) {
      console.log('ss')
    } else {
      options.url = uni.userInfo.baseUrl + options.url
    }
  } catch (e) {
    console.log(e)
  } // 返回参数

  return options
}
/**
 * 特殊处理JSON字符串
 */

function handleJSONStr(result) {
  try {
    // 判断返回数据是否为加密
    if (typeof result.data !== 'object') {
      result.data = JSON.parse(Decrypt(result.data))
    }

    return result
  } catch (e) {
    try {
      result.data = JSON.parse(result.data)
      return JSON.parse(result)
    } catch (e) {
      return result
    }
  }
}
/**
 * GET 请求封装
 */

uni.get = (options = {}) => {
  const obj = {
    method: 'GET',
    ...mergeParams(options)
  }
  const config = reqIntercept(obj)
  sendData(config)
}
/**
 * POST 请求封装
 */

uni.post = (options = {}) => {
  const obj = {
    method: 'POST',
    ...mergeParams(options)
  }
  const config = reqIntercept(obj)
  sendData(config)
}
/**
 * PUT 请求封装
 */

uni.put = (options = {}) => {
  const obj = {
    method: 'PUT',
    ...mergeParams(options)
  }
  const config = reqIntercept(obj)
  sendData(config)
}
/**
 * DELETE 请求封装
 */

uni.del = (options = {}) => {
  const obj = {
    method: 'DELETE',
    ...mergeParams(options)
  }
  const config = reqIntercept(obj)
  sendData(config)
}
/**
 * POST 文件上传
 */

uni.upload = (options = {}) => {
  const obj = {
    method: 'POST',
    ...mergeParams(options)
  }
  const config = reqIntercept(obj)
  sendData(config, true, options.sourceSrc)
}
/**
 * aliOSS 文件上传
 */

uni.aliOssUpload = (options = {}) => {
  // 请求加密信息
  uni.get({
    url: 'sys/common/getSign/' + uni.userInfo.aliOssDir,

    success(res) {
      const data = res.data.data
      const fileKey = new Date().getTime() + '_' + options.file.url.split('http://tmp/')[1] // 上传文件

      uni.upload({
        url: uni.userInfo.aliOssUrl,
        filePath: options.file.url,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          name: fileKey,
          key: uni.userInfo.aliOssDir + '/' + fileKey,
          policy: data.policy,
          Signature: data.signature,
          OSSAccessKeyId: data.accessId,
          success_action_status: '200'
        },
        sourceSrc: uni.userInfo.aliOssUrl + '/' + uni.userInfo.aliOssDir + '/' + fileKey,
        ...options // success: function (res) {
        //     let sourceSrc = wx.userInfo.aliOssUrl + '/' + wx.userInfo.aliOssDir + '/' + fileKey;
        //     options.success && options.success(sourceSrc);
        // },
        // fail: function () {
        //     wx.cToast({ title: '上传失败' });
        // }
      })
    }
  })
}
/**
 * 发送数据
 */

function sendData(config, isUpd, filePath) {
  const success = config.success
  const fail = config.fail

  if (isUpd) {
    uni.uploadFile(
      Object.assign(config, {
        success(res) {
          const resData = handleJSONStr(res)
          if (filePath) console.log(resData.statusCode)

          if ((resData.statusCode === 200 && resData.data.code >= 200 && resData.data.code < 300) || resData.data.code === undefined) {
            if (filePath) {
              resData.data = {}
              resData.data.url = filePath
            }

            success && success(resIntercept(resData))
          } else {
            const retHandle = catchHandle(resData)
            fail && fail(retHandle)
          }
        },

        fail(err) {
          const errData = handleJSONStr(err)
          fail && fail(catchHandle(errData))
        }
      })
    )
  } else {
    uni.request(
      Object.assign(config, {
        success(res) {
          const resData = handleJSONStr(res)

          if ((resData.statusCode === 200 && resData.data.code >= 200 && resData.data.code < 300) || resData.data.code === undefined) {
            success && success(resIntercept(resData))
          } else {
            const retHandle = catchHandle(resData)
            fail && fail(retHandle)
          }
        },

        fail(err) {
          const errData = handleJSONStr(err)
          const retHandle = catchHandle(errData)
          fail && fail(catchHandle(retHandle))
        }
      })
    )
  }
}
/**
 * 显示弹层提示
 */
