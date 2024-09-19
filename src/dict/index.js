// 顺序：宝尼达、爱芙莱、嗨体、逸美一加一、紧恋、冭活泡泡、濡白天使、嗨爆水、如生天使
export const brandList = [
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709705987752/%E5%AE%9D%E5%B0%BC%E8%BE%BE%403x.png',
    name: '宝尼达',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642797694/h-baonida.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709705976777/%E7%88%B1%E8%8A%99%E8%8E%B1%403x.png',
    name: '爱芙莱',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642760988/h-aifulai.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706021964/%E5%97%A8%E4%BD%93%403x.png',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642862729/h-haiti.png',
    name: '嗨体'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706105318/%E9%80%B8%E7%BE%8E%E4%B8%80%E5%8A%A0%E4%B8%80%403x.png',
    name: '逸美一加一',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642808713/h-yijiayi.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706062387/%E7%B4%A7%E6%81%8B%403x.png',
    name: '紧恋',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642851301/h-jinlian.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706095064/%E5%86%AD%E6%B4%BB%E6%B3%A1%E6%B3%A1%403x.png',
    name: '冭活泡泡',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642820428/h-taihuopaopao.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706085390/%E6%BF%A1%E7%99%BD%E5%A4%A9%E4%BD%BF%403x.png',
    name: '濡白天使',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642830380/h-rubaitianshi.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706048248/%E5%97%A8%E7%88%86%E6%B0%B4%403x.png',
    name: '嗨爆水',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642875146/h-haibaoshui.png'
  },
  {
    src: 'https://udstatic.imeik.com/pcUploads/1709706071334/%E5%A6%82%E7%94%9F%E5%A4%A9%E4%BD%BF%403x.png',
    name: '如生天使',
    header: 'https://imeikud.oss-cn-beijing.aliyuncs.com/pcUploads/1705642840526/h-rushengtianshi.png'
  }
]

export const TASK_DICT = {
  ZHU_CE: '1',
  DENG_LU: '2',
  MEI_RI_QIAN_DAO: '3',
  DIAN_ZAN_NEI_RONG: '4', // "点赞内容",
  SHOU_CANG_NEI_RONG: '5', // "收藏内容",
  /**
   * 分享内容:6
   *  */
  FEN_XIANG_NEI_RONG: '6',
  YAO_QING_XIN_YONG_HU_ZHU_CE: '7', // "邀请新用户注册",
  CHAN_PIN_ZHEN_WEI_CHA_XUN: '8',
  CHAN_PIN_SUI_TANG_KAO: '9',
  CHAN_PIN_SUI_TANG_KAO_BU_TONG_GUO: '10',
  DING_DAN_XIAO_HAO: '11',
  XIAO_HAO_ZHAO_LING: '12', // 消耗找零：订单消耗时，遇到多余的积分，生成一条找零记录
  GUO_QI_SHI_XIAO_JI_FEN: '13',
  SEARCH_DOCTOR_LICENSE: '14',
  SEARCH_CER_ORG: '15', // 宝尼达认证机构查询"
  XIAO_XIAO_LE_TONG_GUAN: '16', // "消消乐通关"),
  MA_SHANG_YAN_ZHEN_HUO_DONG_FEN_XIANG: '17', // "码上验真活动分享"
  AI_YAN_ZHEN_KA_FEN_XIANG: '18' // "i验真卡分享"
}

export const ZHOUWEN_GAME_URL = 'https://img.vrupup.com/s/525/front/index.html'

export const GONGGAO_DICT = {
  600: '您的账号已被注销，无法使用，如有疑问，请联系客服',
  601: '您的账号异常，无法使用，如有疑问，请联系客服',
  700: '当前访问人数过多，请稍后再试！',
  701: '您的操作过于频繁，请稍后再试！',
  800: '亲爱的IMEIK爱+用户您好，为向您提供更好的服务，系统正在更新升级。给您带来的不便敬请谅解。请稍后再试~',
  801: '网络请求失败，请稍后重试'
}
