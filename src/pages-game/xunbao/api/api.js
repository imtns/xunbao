const { request: myRequest } = require('@/http/request3')
export default {
  /**
   * 接口请求封装
   * @param { Object } data 传参
   * @param { String } url 请求地址
   * @param { String } method 请求方式
   * @param { Boolean } isOpenid 是否默认带上唯一标识
   * @param { Number } contentType content-type类型，0为application/x-www-form-urlencoded，1为application/json
   * @returns 请求结果
   */
  //原始方法
  myRequest,
  //获取用户信息
  getUserInfo: (data, url = '/iclub/api/activity/htxb/queryUserInfo') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //查询我的卡片
  htxb_myCard: (data, url = '/iclub/api/activity/htxb/myCard') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //查询我的奖品
  htxbMyPrize: (data, url = '/iclub/api/activity/htxb/myPrize') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //签到
  continueSign: (data, url = '/iclub/api/activity/htxb/continueSign') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //用户完成新手引导
  userCompleteNotice: (data, url = '/iclub/api/activity/htxb/userCompleteNotice') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //卡详情
  htxb_cardDetail: (data, url = '/iclub/api/activity/htxb/cardDetail') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //埋点
  triggerBuryPoint: (data, url = '/iclub/api/activity/htxb/triggerBuryPoint') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //查询视频
  queryVideo: (data, url = '/iclub/iclub/openApi/activity/htxb/queryVideo') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //查询视频
  watchVideo: (data, url = '/iclub/api/activity/htxb/watchVideo') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //查询排行榜
  htxb_rankList: (data, url = '/iclub/api/activity/htxb/rankList') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //卡详情
  shareActivity: (data, url = '/iclub/api/activity/htxb/shareActivity') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //核销分享code
  joinActivity: (data, url = '/iclub/api/activity/htxb/joinActivity') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //收卡
  acceptCard: (data, url = '/iclub/api/activity/htxb/acceptCard') => {
    return myRequest(data, url, 'POST', false, 1)
  },
  //获取oss上传参数
  getOssOptions: (data, url = 'https://iclub/api.vrupup.com/sanguo/wujinwen/applet/test/public/index.php/iclub/api/oss_upload') => {
    return myRequest(
      {
        type: 1
      },
      url,
      'post',
      false,
      0,
      false
    )
  },
  // 查询今日答题
  queryQuestion: (data, url = '/iclub/openApi/activity/htxb/queryQuestion') => {
    return myRequest(data, url, 'POST', false, 0)
  },
  // 问答提交
  submitQuestion: (data, url = '/iclub/api/activity/htxb/submitQuestion') => {
    return myRequest(data, url, 'POST', false, 1)
  },
  //查询广告词
  queryAd: (data, url = '/iclub/openApi/activity/htxb/queryAd') => {
    return myRequest(data, url, 'POST', false, 0)
  },
  //语音识别接口
  voiceRecognition: (data, url = '/iclub/api/activity/htxb/voiceRecognition') => {
    return myRequest(data, url, 'POST', false, 1)
  },
  //预语音识别接口
  preVoiceRecognition: (data, url = '/iclub/api/activity/htxb/preVoiceRecognition') => {
    return myRequest(data, url, 'POST', false, 0)
  },
  //AR扫码接口
  arScan: (data, url = '/iclub/api/activity/htxb/arScan') => {
    return myRequest(data, url, 'POST', false, 1)
  },
  //预语音识别接口
  preArScan: (data, url = '/iclub/api/activity/htxb/preArScan') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //查询活动任务接口
  getActivityTaskList: (data, url = '/iclub/api/activity/htxb/getActivityTaskList') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //合成卡
  mergeCard: (data, url = '/iclub/api/activity/htxb/mergeCard') => {
    return myRequest(data, url, 'POST', false, 0)
  },

  //赠卡
  htxb_giveCard: (data, url = '/iclub/api/activity/htxb/giveCard') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //收卡
  htxb_acceptCard: (data, url = '/iclub/api/activity/htxb/acceptCard') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //分享朋友圈
  shareWithFriends: (data, url = '/iclub/api/activity/htxb/shareWithFriends') => {
    return myRequest(data, url, 'POST', false, 1)
  },

  //获取地址详情
  getAddressDetail: (data, url = `https://iclub-backend-test.imeik.com/iclub/iclub/api/userReceiveAddress/get/${data}`) => {
    return myRequest(data, url, 'GET', false, 1)
  },

  //保存收获信息
  saveAddressInfo: (data, url = '/iclub/api/activity/htxb/saveAddressInfo') => {
    return myRequest(data, url, 'POST', false, 1)
  }
}
