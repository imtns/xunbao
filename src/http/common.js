const { request } = require('./request')

module.exports = {
  // 查询全部字典的树形结构
  apiDictionaryTree: (params) => request('/qxcollege/api/dictionary/tree', 'GET', params, true),
  // 数据埋点
  apiBuryPointClick: (data) => request('/qxcollege/api/buryPoint/click', 'POST', data, true, true, true),
  // 小程序码生成
  apiQRCode: (data) => request('/biz-passport/api/qrCode/createQrCode', 'POST', data, true, true, false, false)
}
