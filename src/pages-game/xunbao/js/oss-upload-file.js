import OSS from 'ali-oss'
// import apiConfig from "api/api.config"
import api from '../api/api'
let client
//cos初始化配置参数
const ossOption = {
  region: 'oss-cn-hangzhou', //存储桶所在地域
  bucket: 'pilihuo', // 存储桶名称
  // uploadPath: 'web/resources-all/' //上传文件路径
  uploadPath: 's/', //上传文件路径
  host: 'https://img.vrupup.com/' //上传/访问域名
}
const ossUploadFile = (tempFilePaths, dirname) => {
  console.log('tempFilePaths', tempFilePaths, tempFilePaths[0])
  if (dirname && dirname[0] == '/') {
    dirname = dirname.slice(1)
  }
  if (dirname && dirname[dirname.length - 1] != '/') {
    dirname = dirname + '/'
  }
  return new Promise((resolve, reject) => {
    api.getOssOptions({ type: 2 }).then((res) => {
      console.log('getOssOptions', res)
      let _timestamp = new Date().getTime(),
        _ossOptions = res.data
      // let _key = `${ossOption.uploadPath}${dirname}wckj_${_timestamp}.${tempFilePaths[0].split('.')[1]}`
      let _key = `${ossOption.uploadPath}${dirname}upload/wckj_${_timestamp}.${tempFilePaths[0].split('.')[1]}`
      uni.uploadFile({
        // url: `${ossOption.host}${_key}`, // 开发者服务器的URL。
        url: ossOption.host, // 开发者服务器的URL。
        filePath: tempFilePaths[0],
        name: 'file', // 必须填file
        header: {
          'Content-Type': 'multipart/form-data'
        },
        formData: {
          key: _key,
          policy: _ossOptions.policy,
          OSSAccessKeyId: _ossOptions.OSSAccessKeyId,
          signature: _ossOptions.signature
          // 'x-oss-security-token': securityToken // 使用STS签名时必传。
        },
        success: (res) => {
          console.error(res, 'res')
          if (res.statusCode === 204) {
            res.data = { url_cdn: `${ossOption.host}${_key}` }
            console.log('res.data', res.data)
            resolve(res)
          }
        },
        fail: (err) => {
          console.error(err, '23')
          reject(err)
        }
      })
    })
  })
}
export default ossUploadFile
