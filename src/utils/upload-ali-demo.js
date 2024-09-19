/**
 * 阿里云官方小程序上传图片方式，通过引入aliyun-upload-sdk-1.0.0.min.js（官方文档：https://help.aliyun.com/document_detail/158671.htm）
 * 按道理小程序上能用，但是反复实验，开始上传时一直报错”The bucket you are attempting to access must be addressed using the specified endpoint.Please send all future requests to this endpoint“
 * 对于上面这个报错，官方的解释是”Bucket和Endpoint不符“（https://developer.aliyun.com/ask/213843）
 * 怀疑是接口签名的问题，但是没有证据，并且同样的签名在web端是可以正常上传的，这就奇怪了~
 *
 * --- 最终结果没调通，等后面闲了再研究吧（或许一直不会闲，或许闲下来了也不会再研究~）
 */

import VODUpload from './aliyun-upload-sdk-1.0.0.min.js'
import { findAliToken } from '../http/upload.js'

// 初始化uploader
export function initUploader(option) {
  console.log('initUploaderinitUploader', option)
  const uploader = new VODUpload({
    timeout: option.timeout || 60000,
    region: option.region || 'oss-cn-beijing',
    // 添加文件成功
    addFileSuccess(uploadInfo) {
      console.log('addFileSuccess' + JSON.stringify(uploadInfo))
    },
    // 开始上传
    onUploadstarted(uploadInfo) {
      console.log('onUploadStarted:' + JSON.stringify(uploadInfo))
      findAliToken().then(info => {
        const accessKeyId = info.accessKeyId
        const accessKeySecret = info.accessKeySecret
        const secretToken = info.securityToken

        uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret, secretToken)
      })
    },
    // 文件上传成功
    onUploadSucceed(uploadInfo) {
      console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
      option.success && option.success(uploadInfo)
    },
    // 文件上传失败
    onUploadFailed(uploadInfo, code, message) {
      console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
      option.error && option.error(uploadInfo, code, message)
    },
    // 取消文件上传
    onUploadCanceled(uploadInfo, code, message) {
      console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
    },
    // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
    onUploadProgress(uploadInfo, totalSize, progress) {
      // let files;
      // if (uploadInfo.isImage) {
      //     files = images;
      // } else {
      //     files = videos;
      // }

      // files.forEach((file, idx) => {
      //     if (file.url === uploadInfo.url) {
      //         file.progress = progress;
      //         if (uploadInfo.isImage) {
      //             that.images = files
      //         } else {
      //             that.videos = files
      //         }
      //     }
      // })

      console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
      option.progress && option.progress(Math.ceil(progress * 100))
    },
    // 上传凭证超时
    onUploadTokenExpired: function(uploadInfo) {
      // // 如果是上传方式二即根据 STSToken 实现时，从新获取STS临时账号用于恢复上传
      // // 上传文件过大时可能在上传过程中 sts token 就会失效, 所以需要在 token 过期的回调中调用 resumeUploadWithSTSToken 方法

      console.log('文件上传超时!')
      findAliToken().then(info => {
        const accessKeyId = info.accessKeyId
        const accessKeySecret = info.accessKeySecret
        const secretToken = info.securityToken
        const expiration = info.Expiration // todo 需要接口返回
        uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expiration)
      })
    },
    // 全部文件上传结束
    onUploadEnd: function(uploadInfo) {
      console.log('文件上传完毕 onUploadEnd: uploaded all the files', uploadInfo)
      option.end && option.end(uploadInfo)
    }
  })

  return uploader
}
