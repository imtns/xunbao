
const CryptoJS = require('crypto-js')
console.log(CryptoJS)
// const message = CryptoJS.enc.Utf8.parse("0102030405060708"); // 十六位十六进制数作为秘钥
const aseKey = CryptoJS.enc.Utf8.parse('liujinzhao') // 十六位十六进制数作为秘钥偏移量
/***
   * 加密
   */
function encrypt(message) {
  const result = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  console.log(result)
  return result
}

/***
   * 解密
   */
function decrypt(message) {
  const result = CryptoJS.AES.decrypt(message, aseKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
  return result
}

module.exports = {
  encrypt,
  decrypt
}
