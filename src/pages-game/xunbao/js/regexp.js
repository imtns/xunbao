/**
 * 手机号码
 */
const regex_phone = /^1\d{10}$/
/**
 * 姓名（2-4个中文字符）
 */
const regex_name = /^[\u4e00-\u9fa5]{2,4}$/
/**
 * 密码（字母开头，长度在6~18之间，只能包含字母、数字或下划线）
 */
const regex_password = /^[a-zA-Z]\w{5,17}$/
/**
 * 手机验证码
 */
const regex_phone_code = /^\d{6}$/
/**
 * 座机号码
 */
const regex_telephone = /^(0\d{2,3})-?(\d{7,8})$/
/**
 * 身份证号码
 */
const regex_identityCard = /(^\d{15}$)|(^\d{18}$)|(^d{17}(\d|X|x)$)/
/**
 * QQ号
 */
const regex_qq = /^[1-9][0-9]\d{4,9}$/
/**
 * 邮政编码
 */
const regex_postalCode = /^[1-9]\d{5}$/

export {
  regex_phone,
  regex_name,
  regex_password,
  regex_telephone,
  regex_phone_code,
  regex_identityCard,
  regex_qq,
  regex_postalCode
}