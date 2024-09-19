const { request } = require('./request')

module.exports = {
  // 查询活力值任务
  getIntegralTask: (params) => request('/iclub/api/user/getIntegralTask', 'post', params, true, true),
  // 签到
  signIn: (params) => request('/iclub/api/user/userSign', 'post', params, false, true, true, true),
  // 查询活力值余额
  getIntegralBalance: (params) => request('/iclub/api/user/getIntegralBalance', 'post', params, false, true, false, false),

  getIntegralBalanceNew: (params) => request('/iclub/api/user/getIntegralInfo', 'post', params, false, true, false, false),
  // 查询用户签到(一周)
  getUserSignForOneWeek: (params) => request('/iclub/api/user/getUserSignForOneWeek', 'post', params, false, true, false, false),
  // 查询用户积分
  getIntegralSet: (params) => request('/iclub/api/userIntegralDetail/getIntegralSet', 'post', params, false, true, false, false)
}
