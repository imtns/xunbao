const { request } = require('./request')

module.exports = {
  // 查询用户收藏
  ibtApiContentCollectQuery: (val) => request('/ibt/api/contentcollect/queryContentCollect', 'GET', val, true),
  // 添加收藏
  ibtApiContentCollectAdd: (data) => request('/ibt/api/contentcollect/addContentCollect', 'POST', data, false, true),
  // 查询我的评论列表
  ibtApiContentCommentQueryMyComment: (val) => request('/ibt/api/contentcomment/queryMyComment', 'GET', val, true),
  // 删除评论
  ibtApiContentCommentDelete: (data) => request('/ibt/api/contentcomment/deleteContentComment', 'POST', data, false, true),

  // 新增地址
  iclubApiUserReceiveAddressAdd: (data) => request('/iclub/api/userReceiveAddress/add', 'POST', data, false, true),
  // 编辑地址
  iclubApiUserReceiveAddressEdit: (data) => request('/iclub/api/userReceiveAddress/edit', 'POST', data, false, true),
  // 删除地址
  iclubApiUserReceiveAddressDelete: (data) => request('/iclub/api/userReceiveAddress/delete', 'POST', data, false, true),
  // 用户地址详情
  iclubApiUserReceiveAddressGet: (objectCode) => request(`/iclub/api/userReceiveAddress/get/${objectCode}`, 'GET', {}, true),
  // 用户地址列表
  iclubApiUserReceiveAddressList: () => request('/iclub/api/userReceiveAddress/list', 'GET', { limit: 100, page: 1 }, true),
  // 批量管理
  iclubApiUserReceiveAddressManage: (data) => request('/iclub/api/userReceiveAddress/receiveAddressManage', 'POST', data, false, true),

  // 增加活力值
  iclubApiUserAddIntegral: (data) => request('/iclub/api/user/addIntegral', 'POST', data, false, true, true),

  // 我的点赞列表
  iclubApiUserContentUpvoteList: (params) => request('/iclub/api/content/upvoteList', 'GET', params, true),
  // 点赞-取消点赞
  iclubApiContentUpVote: (data) => request('/iclub/api/content/upvote', 'POST', data, false, true),

  // 我的收藏列表
  iclubApiUserContentCollectList: (params) => request('/iclub/api/content/collectList', 'GET', params, true),
  // 收藏-取消收藏
  iclubApiContentCollect: (data) => request('/iclub/api/content/collect', 'POST', data, false, true),

  // 开始考试
  iclubApiExamStartExam: (data) => request('/iclub/api/exam/startExam', 'POST', data, false, true, true),
  // 试卷提交
  iclubApiExamStartSubmitPaper: (data) => request('/iclub/api/exam/submitPaper', 'POST', data, false, true),
  // 考试结果页面
  iclubApiExamGetExamResultInfo: (code) => request(`/iclub/api/exam/getExamResultInfo/${code}`, 'GET', {}, true)
}
