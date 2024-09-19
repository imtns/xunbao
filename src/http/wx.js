const { request } = require('./request')
const { request2 } = require('./request2')

module.exports = {
  // 新版 - 通过code获取用户手机号信息
  wxMaLogin: (params) => request('/iclub/api/user/loginForMiniProgram', 'POST', params, true),
  // 通过code获取用户openid
  wxGetOpenId: (params) => request('/biz-passport/passport/login/getOpenId', 'POST', params, true, true, false, true, { 'business-app': 'iclub', 'business-sys': 'iclub' }),
  // 更新用户unionId
  wxUpdateOpenId: (params) => request('/passport/api/sso/updateUnionid', 'POST', params, true),
  // 上传用户信息
  userUploadUserInfo: (params) => request('/passport/api/user/uploadUserInfo', 'POST', params, true, true),
  // 获取用户信息
  userInfo: (data) => request('/iclub/api/user/queryUserInfo', 'post', data, true, true),
  // 刷新token
  refreshToken: (data) => request('/biz-passport/passport/auth/refreshToken', 'post', data, true, true),
  // 更新iclub的头像和昵称
  iclubApiUserEditUserInfo: (params) => request('/iclub/api/user/editUserInfo', 'POST', params, true, true),
  testJiami: () => request2({ url: '/iclub/openApi/test/testSM4', method: 'POST', data: { data: 123 }, encrypt: true }),
  getCodeByPhone: (params) => request('/passport/api/sso/sendSmsVerCode', 'POST', params, true, true),
  // 新用户登录
  loginForMiniProgramForNewUser: (params) => request('/passport/api/sso/loginForMiniProgramForNewUser', 'POST', params, true, true),

  // 统一登录后用户注册接口
  userRegister: (data) => request('/iclub/api/user/register', 'POST', data, true, true),
  xlogin: (data) => request('/biz-passport/passport/login/loginByMiniApp', 'POST', data, true, true),
  setEncryptKey: (data) => request('/biz-passport/passport/auth/refreshUserEncryptKey', 'POST', data, true, true)
}
