const { request } = require('./request')

module.exports = {
  // 真伪查询
  queryAuthenticityInfo: (data) => request('/iclub/api/authenticity/queryAuthenticity', 'POST', data, true, true),
  // 我的查询记录
  getSearchRecord: (data) => request('/iclub/api/authenticity/queryRecords', 'POST', data, true, true)
}
