/**
 * https://www.jianshu.com/p/62385951ebd4
 * 微信小程序通过STS直传阿里云OSS
 *（uniapp版上传，小程序原生需要将uni.XXX替换为wx.XXX）
 *
 * @param {filePath} 图片临时地址
 * @param {option|Object} OSS和STS配置
 * @param {savePath} oss中的文件目录
 * @param {AccessKeySecret} 服务端返回的STS中的AccessKeySecret
 * @param {SecurityToken} 服务端返回的STS中的SecurityToken
 * @param {AccessKeyId} 服务端返回的STS中的AccessKeyId
 * @param {bucket} 服务端返回的STS中的存储桶
 * @param {area} 地区
 * @return {string|boolean} 成功返回文件地址，失败返回false
 */

import crypto from 'crypto-js'
import { Base64 } from 'js-base64/base64.js'
import { findAliToken } from '../http/upload'

// 上传
function upload(filePath, savePath, callBack) {
  getUploadToken(function (res) {
    const option = {
      savePath: savePath,
      AccessKeySecret: res.accessKeySecret,
      SecurityToken: res.secretToken,
      AccessKeyId: res.accessKeyId,
      bucket: res.bucket,
      area: 'oss-cn-beijing'
    }

    aliUpload(filePath, option, callBack)
  })
}

// 获取阿里上传token
function getUploadToken(callBack) {
  findAliToken().then((info) => {
    const accessKeySecret = info.accessKeySecret
    const secretToken = info.securityToken
    const accessKeyId = info.accessKeyId
    const bucket = info.bucket

    callBack({
      accessKeySecret: accessKeySecret,
      secretToken: secretToken,
      accessKeyId: accessKeyId,
      bucket: bucket
    })
  })
}
function getUploadTokenAsync() {
  return new Promise((resolve) => {
    findAliToken().then((info) => {
      resolve({
        savePath: 'image',
        AccessKeySecret: info.accessKeySecret,
        SecurityToken: info.securityToken,
        AccessKeyId: info.accessKeyId,
        bucket: info.bucket,
        area: 'oss-cn-beijing'
      })
    })
  })
}
// 上传
function aliUpload(
  filePath,
  option = {
    savePath,
    AccessKeySecret,
    SecurityToken,
    AccessKeyId,
    bucket,
    area
  },
  callBack = () => {}
) {
  const fileType = filePath.split('.').pop()
  const tempFileName = createFileName(32)
  const filename = option.savePath + '/' + tempFileName + '.' + fileType

  const date = new Date()
  date.setHours(date.getHours() + 1)
  const policyText = {
    expiration: date.toISOString(), // 设置policy过期时间
    conditions: [['content-length-range', 0, 1024 * 1024 * 1024]]
  }
  // policy必须为base64的string
  const policy = Base64.encode(JSON.stringify(policyText))
  const signature = computeSignature(option.AccessKeySecret, policy)
  const formData = {
    OSSAccessKeyId: option.AccessKeyId,
    signature,
    policy,
    'x-oss-security-token': option.SecurityToken,
    key: filename,
    success_action_status: 200
  }
  const domain = 'https://' + option.bucket + '.' + option.area + '.aliyuncs.com'
  const cdnDomain = 'https://udstatic.imeik.com' // 2022-05-11 替换成固定的cdn域名

  uni.uploadFile({
    url: domain,
    filePath: filePath,
    name: 'file',
    formData: formData,
    success: (res) => {
      console.log('....success....', res)
      let ossFileName = ''
      if (res.statusCode === 200) {
        ossFileName = cdnDomain + '/' + filename // 回显url用cdn域名
      }
      console.log('uploadUrl', ossFileName)
      callBack(ossFileName, option.filename)
    },
    fail: (err) => {
      console.log('....err....', err)
      callBack('')
    }
  })
}

// 签名
function computeSignature(accessKeySecret, canonicalString) {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret))
}

// 生成随机文件名
function createFileName(length) {
  const data = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  let nums = ''
  for (let i = 0; i < length; i++) {
    const r = parseInt(Math.random() * (data.length - 1), 10)
    nums += data[r]
  }
  return nums
}

export default {
  upload,
  getUploadTokenAsync,
  aliUpload
}
