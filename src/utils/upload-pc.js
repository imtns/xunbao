/**
 * pc上传图片方式，通过模块ali-oss实现，但是在小程序上不能用 - 暂存不用
 */
import { findAliToken } from '../http/upload'
const OSS = require('ali-oss')

export function beforeUpload(file, maxSize = 5) {
  if (file.size > maxSize * 1024 * 1024) {
    this.$message.error(`上传文件大小不能超过 ${maxSize}MB!`)
    return false
  }
  return true
}

export async function fnUploadRequest(options) {
  try {
    const res = await findAliToken()
    const client = new OSS({
      accessKeyId: res.accessKeyId, // 查看自己的阿里云KEYSECRET
      accessKeySecret: res.accessKeySecret, // 查看自己的阿里云KEYSECRET
      stsToken: res.securityToken,
      bucket: res.bucket, // 你的 OSS bucket 名称
      region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
      endpoint: 'udstatic.imeik.com' // 自己的域名
    })
    const file = options // 拿到 file
    const fileName = file.name.substr(0, file.name.lastIndexOf('.'))
    const date = new Date().getTime()
    const fileNames = `${date}_${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名
    // 上传文件,这里是上传到OSS的 uploads文件夹下
    client.put('pcUploads/' + fileNames, file).then(res => {
      if (res.res.statusCode === 200) {
        console.log('fnUploadRequestres1', res)
        // options.onSuccess(res)
      } else {
        console.log('fnUploadRequestres2', res)
        // options.onError('上传失败')
      }
    })
  } catch (e) {
    console.log('fnUploadRequeste``````````', e)
    // options.onError('上传失败')
  }
}
