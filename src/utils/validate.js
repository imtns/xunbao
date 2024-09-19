/**
 * 常用的校验
 */

// 手机号校验
const isMobile = (str) => {
  return /^1\d{10}$/.test(str)
}

// 邮箱校验
const isEmail = (str) => {
  return /^\S+?@\S+?\.\S+?$/.test(str)
}

// http链接校验
const isHttpLink = (str) => {
  return /^https?/.test(str)
}

module.exports = {
  isEmail,
  isMobile,
  isHttpLink
}
