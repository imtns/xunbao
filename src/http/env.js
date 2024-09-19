const conf = {
  // 环境
  env: process.env.VUE_APP_ENV,
  // 测试环境跳 体验版
  envVersion: process.env.VUE_APP_BUILD_ENV === 'test' ? process.env.VUE_APP_ENV_VERSION_TEST : process.env.VUE_APP_ENV_VERSION,
  // 接口调用API地址
  baseNewUrl: process.env.VUE_APP_BUILD_ENV === 'test' ? process.env.VUE_APP_BASE_API_TEST : process.env.VUE_APP_BASE_API,
  // iclub接口地址
  baseIclubUrl: process.env.VUE_APP_BUILD_ENV === 'test' ? process.env.VUE_APP_BASE_API_TEST_ICLUB : process.env.VUE_APP_BASE_API_ICLUB
}

module.exports = conf
