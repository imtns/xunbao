/**
 * 埋点上报配置
 *  曝光：exposure (页面或者节点)
 *    - eventId：优先级最高
 *    - element：需要曝光的节点选择器（最好页面级别能唯一精确到该节点，选择器最好以 report-el- 开头），如果不配置则默认是页面的曝光
 *      - 可以是class,id等选择器，详见：https://uniapp.dcloud.net.cn/api/ui/nodes-info.html#selectorquery-select
 *    - relative：相对于某元素是否可见，如果不传则相对于视窗（仅曝光时候生效）
 *    - dataKeys：上报携带的参数 {key: value}，value可选如下
 *      - $APP.*：globalData里面的字段
 *      - $DATASET.*：节点的dataset
 *      - $QUERY.*：页面query字段
 *      - $PAGE.*：当前页面的data，等于vue文件里data里定义的字段
 *      - $INDEX：当前节点的下标，需要在wxml上显示设置 data-index="xxx"
 *      - 任意字符串：原样返回
 *      - 公共参数：详见utils/report/report里 getCommonParams 方法
 *    - dataFunctions：当dataKeys的value取值达不到要求时，支持自定义取值格式化方法 {key: function}，其中function的参数如下
 *      - value：对应上面dataKeys里的valued
 *      - dataset：节点的dataset
 *      - pageData：组件内的data
 *      - query：页面路由参数
 *      - args：监听方法的原始参数
 *    - stopReport: 方法阻止上报逻辑，bool | function，当其返回true时，可以阻止上报，参照 pages/mine/message/reply 的"未读消息曝光"
 *  节点点击：elementTracks (节点点击事件) - 注：需要在页面最外层的view上加上 @tap.native.stop="$elementTracker"，否则不生效
 *    - 配置同曝光
 *  方法点击：comMethodTracks (特定方法事件)
 *    - 配置同曝光
 *
 * 注：每个页面都会上报PV，默认的PV上报不会携带参数，如果需要带pageContent参数，则需要在trackConfig进行配置(参照：pages/detail/lecturer)
 * 注：分享到朋友圈和分享给好友，每个页面都会自动埋点，逻辑在 mixin/report 里
 *
 * 注意：如果埋点的节点自身有多个事件绑定（如课程详情页的video），此时不能用comMethodTracks进行埋点（会重复上报&&误报），可以在页面里对应方法里引入report，手动上报
 * 注意：config里使用exposure进行元素曝光配置时，如果元素是通过接口动态生成，则需要在接口请求回来后调用一遍initExport进行曝光上报初始化，详见 pages/mine/message/reply 的 未读消息曝光
 */
// 配置示例
export const configExample = {
  'pages/center/center': {
    exposure: [
      // 曝光上报 - 页面或具体节点
      {
        dataKeys: { isLogin: 'isLogin' } // 页面曝光上报
      },
      {
        element: '.abc', // 具体节点曝光上报
        dataKeys: { isLogin: 'isLogin' }
      }
    ],
    elementTracks: [
      // 节点点击上报
      {
        element: '.avatar',
        dataKeys: { isLogin: 'isLogin', userInfo: 'userInfo' }
      }
    ],
    comMethodTracks: [
      // 方法执行上报
      {
        method: 'identifyClick',
        dataFunctions: {
          // 支持自定义参数格式化方法
          course: (params) => {
            console.log(params.key, params.dataset, params.pageData, params.query, params.args)
            return ''
          }
        },
        dataKeys: { course: '$APP.selectedCourseSort', idx: '$DATASET.index', index: '$INDEX', from: '$QUERY.from' }
      }
    ]
  },
  'pages/mine/feedback/index': {
    elementTracks: [
      {
        element: '.switch-tab >>> .tab-text', // 可以是这种跨组件选择器
        dataKeys: { tab: 'activeTab', phone: 'phoneNo' }
      }
    ]
  }
}

// pv eventId
export const EVENT_ID_PV = 'page_expose'
// element expose eventId
export const EVENT_ID_ELEMENT_EXPOSE = 'element_expose'
// click eventId
export const EVENT_ID_ELEMENT_CLICK = 'element_click'

// 上报配置
export const trackConfig = {
  'pages/home/home': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.home >>> .report-el-swiper-item',
        dataKeys: { activityName: '焦点图', actionRank: '$INDEX', activityId: 'p001_click', activityContent: '$DATASET.item.pitName' }
      },
      {
        element: '.home >>> .report-el-home-search',
        dataKeys: { activityName: '搜索', actionRank: 1, activityId: 'p001_search', activityContent: '' }
      }
    ],
    comMethodTracks: [
      {
        method: 'bannerHomeChange',
        eventId: EVENT_ID_ELEMENT_EXPOSE, // 由于createIntersectionObserver监听不到banner的曝光，退而求其次，这里监听banner切换的方法
        dataKeys: { activityName: '焦点图', actionRank: '', activityId: 'p001_focus', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params.args[1] || 0,
          activityContent: (params) => (params.args[0] && params.args[0].pitName) || ''
        }
      },
      {
        method: 'entryHomeClick',
        dataKeys: { activityName: '课程区', actionRank: '', activityId: 'p001_course', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params.args[1] || 0,
          activityContent: (params) => (params.args[0] && params.args[0].text) || ''
        }
      },
      {
        method: 'homeTabTextClick',
        dataKeys: { activityName: '', actionRank: 0, activityId: '', activityContent: '' },
        dataFunctions: {
          activityName: (params) => ({ 1: '人气讲师', 2: '热门课程', 3: '最新课程' }[(params.args[0] && params.args[0].value) || 1] || ''),
          activityId: (params) => ({ 1: 'p001_teacher', 2: 'p001_hotcourse', 3: 'p001_newcourse' }[(params.args[0] && params.args[0].value) || 1] || ''),
          activityContent: (params) => ({ 1: '人气讲师tab', 2: '热门课程tab', 3: '最新课程tab' }[(params.args[0] && params.args[0].value) || 1] || '')
        }
      },
      {
        method: 'homeLecturerItemClick',
        dataKeys: { activityName: '人气讲师', actionRank: '', activityId: 'p001_teacher', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => (params.args[1] || 0) + 1,
          activityContent: (params) => (params.args[0] && params.args[0].title) || ''
        }
      },
      {
        method: 'homeCourseItemClick',
        dataKeys: { activityName: '', actionRank: '', activityId: '', activityContent: '' },
        dataFunctions: {
          activityName: (params) => ({ 2: '热门课程', 3: '最新课程' }[params.pageData.defCourseTab] || ''),
          actionRank: (params) => (params.args[1] || 0) + 1,
          activityId: (params) => ({ 2: 'p001_hotcourse', 3: 'p001_newcourse' }[params.pageData.defCourseTab] || ''),
          activityContent: (params) => (params.args[0] && params.args[0].title) || ''
        }
      },
      {
        method: 'homeShowMore',
        dataKeys: { activityName: '', actionRank: 1000, activityId: '', activityContent: '查看更多>' },
        dataFunctions: {
          activityName: (params) => ({ 2: '热门课程', 3: '最新课程' }[params.pageData.defCourseTab] || ''),
          activityId: (params) => ({ 2: 'p001_hotcourse', 3: 'p001_newcourse' }[params.pageData.defCourseTab] || '')
        }
      },
      {
        method: 'homeShareClick',
        dataKeys: { activityName: '分享', actionRank: 0, activityId: 'p001_share', activityContent: '分享' }
      },
      {
        method: 'homeActivityItemClick',
        dataKeys: { activityName: '热门活动', actionRank: '', activityId: 'p001_activity', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => (params.args && params.args[1]) || 0,
          activityContent: (params) => (params.args[0] && params.args[0].title) || ''
        }
      }
    ]
  },
  'pages/course/course': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-course-fake-search',
        dataKeys: { activityName: '搜索', actionRank: 3, activityId: 'p002_search' }
      }
    ],
    comMethodTracks: [
      {
        method: 'switchClick',
        dataKeys: { activityName: '', actionRank: '', activityId: '' },
        dataFunctions: {
          actionRank: (params) => ({ 1: 1, 2: 2 }[params.args[0] && params.args[0].value]),
          activityName: (params) => ({ 1: '课程', 2: '专栏' }[params.args[0] && params.args[0].value]),
          activityId: (params) => ({ 1: 'p002_course', 2: 'p002_column' }[params.args[0] && params.args[0].value])
        }
      },
      {
        method: 'controlFilter',
        dataKeys: { activityName: '筛选', actionRank: 4, activityId: 'p002_screen' }
      },
      {
        method: 'navCourseClick',
        dataKeys: { activityName: '一级分类', actionRank: '', activityId: 'p002_category', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => (params.args[0] && params.args[0].name) || '',
          actionRank: (params) => (params.args[1] || 0) + 1
        }
      },
      {
        method: 'bannerCourseClick',
        dataKeys: { activityName: '全部课程顶部头图', actionRank: '', activityId: 'p002_top_picture', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => (params.args[1] || 0) + 1,
          activityContent: (params) => (params.args[0] && params.args[0].pitName) || ''
        }
      },
      {
        method: 'sortClick',
        dataKeys: { activityName: '', actionRank: '', activityId: '' },
        dataFunctions: {
          actionRank: (params) => ({ 1: 1, 2: 2 }[params.args[0] && params.args[0].value] || ''),
          activityName: (params) => ({ 1: '课程_最热', 2: '课程_最新' }[params.args[0] && params.args[0].value] || ''),
          activityId: (params) => ({ 1: 'p002_course_hot', 2: 'p002_course_new' }[params.args[0] && params.args[0].value] || '')
        }
      },
      {
        method: 'filterClick',
        dataKeys: { activityName: '筛选三角区', actionRank: '', activityId: 'p002_screen_triangle', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params.args[3] || 0,
          activityContent: (params) => [(params.args[1] && params.args[1].name) || '', (params.args[2] && params.args[2].name) || ''].filter((i) => !!i).join('\\')
        }
      },
      {
        method: 'subFilterClick',
        dataKeys: { activityName: '二级分类', actionRank: '', activityId: 'p002_sub_category', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params.args[2] || 0,
          activityContent: (params) => (params.args[1] && params.args[1].name) || ''
        }
      },
      {
        method: 'courseItemClick',
        dataKeys: { activityName: '课程_列表', actionRank: '', activityId: 'p002_course_list', activityContent: '', actionContentScreen: '' },
        dataFunctions: {
          actionRank: (params) => (params.args[1] || 0) + 1,
          activityContent: (params) => {
            const item = params.args[0] || {}
            return { courseCode: item.objectCode || '', courseTitle: item.title || '' }
          },
          actionContentScreen: (params) => {
            const fo = params.pageData.filterOptions
            const sel = params.pageData.selectedFilter
            const res = { secCategoryCode: params.pageData.secCategoryCode || '' }

            fo.map((i) => {
              res[i.code] = sel[i.code] || ''
              return i
            })

            return JSON.stringify(res)
          }
        }
      }
    ]
  },
  'pages/center/center': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-center',
        dataKeys: { activityName: '$DATASET.item.name', actionRank: '$INDEX', activityId: '$DATASET.item.activityId' }
      }
    ],
    comMethodTracks: [
      {
        method: 'goCenterUserInfo',
        dataKeys: { activityName: '个人信息', actionRank: 1, activityId: 'p004_profile' }
      },
      {
        method: 'goCenterUpdate',
        dataKeys: { activityName: '升级为注册医生', actionRank: 2, activityId: 'p004_certificate' }
      },
      {
        method: 'goMessageList',
        dataKeys: { activityName: '消息入口', actionRank: 11, activityId: 'p004_message' }
      },
      {
        method: 'showAllCenterIntroduction',
        dataKeys: { activityName: '', actionRank: '', activityId: '' },
        dataFunctions: {
          actionRank: (params) => (params.pageData.showAll ? 13 : 12),
          activityName: (params) => (params.pageData.showAll ? '个人介绍收起按钮' : '个人介绍展开按钮'),
          activityId: (params) => (params.pageData.showAll ? 'p004_profile_fold' : 'p004_profile_open')
        }
      }
    ]
  },
  'pages/mine/userAbout/introduction': {
    elementTracks: [
      {
        element: '.report-el-user-introduction-submit',
        dataKeys: { activityName: '确认修改', actionRank: 1, activityId: 'p004001003_done' }
      }
    ]
  },
  'pages/mine/userAbout/index': {
    elementTracks: [
      {
        element: '.report-el-user-about-avatar',
        dataKeys: { activityName: '修改头像热区', actionRank: 1, activityId: 'p004001_photo' }
      },
      {
        element: '.report-el-user-about-nickName',
        dataKeys: { activityName: '修改昵称热区', actionRank: 2, activityId: 'p004001_nickname' }
      },
      {
        element: '.report-el-user-about-introduction',
        dataKeys: { activityName: '修改个人介绍热区', actionRank: 3, activityId: 'p004001_profile' }
      }
    ]
  },
  'pages/landingPage/landingPage': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.code' }
      }
    ]
  },
  'pages/questionnaire/questionnaire': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.code' }
      }
    ]
  },
  'pages/hotActivity/hotActivity': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.actCode' }
      }
    ]
  },
  'pagesLive/liveTab': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.meetingCode' }
      }
    ]
  },
  'pages/detail/column': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.code' }
      }
    ]
  },
  'pages/activity/activity': {
    elementTracks: [
      {
        element: '.schedule >>> .report-el-activity-view-change',
        dataKeys: { activityName: '日程切换', actionRank: 2, activityId: 'p003_change' }
      }
    ],
    comMethodTracks: [
      {
        method: 'scheduleNameSearch',
        dataKeys: { activityName: '搜索', actionRank: 1, activityId: 'p003_search' }
      }
    ]
  },
  'pages/activity/activityDetail': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.code' }
      }
    ]
  },
  'pages/search/course': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.key' }
      }
    ]
  },
  'pages/search/column': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.key' }
      }
    ]
  },
  'pages/detail/lecturer': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.id' }
      }
    ],
    comMethodTracks: [
      {
        method: 'lectureDetailCourseClick',
        dataKeys: { activityName: '课程列表', actionRank: '', activityId: 'p001001_course_list', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => (params.args[1] || 0) + 1,
          activityContent: (params) => (params.args[0] && params.args[0].title) || ''
        }
      },
      {
        method: 'showAllLetureIntroduction',
        dataKeys: { activityName: '', actionRank: '', activityId: '' },
        dataFunctions: {
          actionRank: (params) => (params.pageData.showAll ? 2 : 1),
          activityName: (params) => (params.pageData.showAll ? '个人介绍收起按钮' : '个人介绍详情按钮'),
          activityId: (params) => (params.pageData.showAll ? 'p001001_profile_fold' : 'p001001_profile_open')
        }
      }
    ]
  },
  'pages/detail/newDetail': {
    exposure: [
      {
        dataKeys: { pageContent: '$QUERY.code' }
      },
      {
        element: '.report-el-operate-banner',
        dataKeys: { activityName: '播放器下方banner位', actionRank: 1, activityId: 'p002002_banner', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const pd = params.pageData || {}
            const course = pd.infos || {}
            const banner = pd.operateInfo || {}
            return { courseCode: course.objectCode || '', courseTitle: course.title || '', bannerCode: banner.objectCode || '', bannerTitle: banner.title || '' }
          }
        }
      }
    ],
    elementTracks: [
      {
        element: '.report-el-course-detail-collect',
        dataKeys: { activityName: '课程器下方_收藏', actionRank: 2, activityId: 'p002002_collect', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => ({ ...params.pageData.courseReportObj, collect: params.pageData.hasCollection ? 1 : 0 })
        }
      },
      {
        element: '.report-el-course-detail-star',
        dataKeys: { activityName: '课程器下方_点赞', actionRank: 3, activityId: 'p002002_like', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => ({ ...params.pageData.courseReportObj, star: params.pageData.hasStar ? 1 : 0 })
        }
      },
      {
        element: '.report-el-course-detail-share',
        dataKeys: { activityName: '课程器下方_分享', actionRank: 4, activityId: 'p002002_share', activityContent: '$PAGE.courseReportObj' }
      },
      {
        element: '.report-el-tab-select',
        dataKeys: { activityName: '', actionRank: '', activityId: '', activityContent: '$PAGE.courseReportObj' },
        dataFunctions: {
          activityName: (params) => ({ introduce: '课程器下方_介绍', exam: '课程器下方_考试', comment: '课程器下方_评论' }[params.dataset.item.value] || ''),
          actionRank: (params) => ({ introduce: 5, exam: 7, comment: 6 }[params.dataset.item.value] || ''),
          activityId: (params) => ({ introduce: 'p002002_introduce', exam: 'p002002_exam', comment: 'p002002_comment' }[params.dataset.item.value] || '')
        }
      },
      {
        element: '.report-el-operate-banner',
        dataKeys: { activityName: '播放器下方banner位', actionRank: 1, activityId: 'p002002_banner', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const pd = params.pageData || {}
            const course = pd.infos || {}
            const banner = pd.operateInfo || {}
            return { courseCode: course.objectCode || '', courseTitle: course.title || '', bannerCode: banner.objectCode || '', bannerTitle: banner.title || '' }
          }
        }
      }
    ],
    comMethodTracks: [
      {
        method: 'onPlaybackRate',
        dataKeys: { activityName: '播放器_倍速', actionRank: 3, activityId: 'p002002_play_speed', activityContent: '$PAGE.courseReportObj' }
      },
      {
        method: 'handleCourseShortDesc',
        dataKeys: { activityName: '课程器下方_课程简介', actionRank: 1, activityId: 'p002002_course_brief', activityContent: '$PAGE.courseReportObj' }
      },
      {
        method: 'courseDetailShareClick',
        dataKeys: { activityName: '课程器下方_浮层分享', actionRank: 8, activityId: 'p002002_surface_share', activityContent: '$PAGE.courseReportObj' }
      }
    ]
  },
  'pages/mine/feedback/index': {
    exposure: [
      {
        dataKeys: {}
      }
    ]
  },
  'pages/mine/interests/index': {
    elementTracks: [
      {
        element: '.report-el-interests-leve2',
        dataKeys: { activityName: '底部提交资质认证按钮', actionRank: 2, activityId: 'p004002_bottom_certificate' }
      }
    ]
  },
  'pages/mine/doctor/register': {
    comMethodTracks: [
      {
        method: 'submitWithMessage',
        dataKeys: { activityName: '底部提交按钮', actionRank: 3, activityId: 'p004002002_submit' }
      },
      {
        method: 'showFailReason',
        dataKeys: { activityName: '查看原因', actionRank: 1, activityId: 'p004002004_check' }
      },
      {
        method: 'reApply',
        dataKeys: { activityName: '重新申请', actionRank: 2, activityId: 'p004002004_reapply' }
      }
    ]
  },
  'pages/mine/message/index': {
    comMethodTracks: [
      {
        method: 'messageIndexGoReply',
        dataKeys: { activityName: '回复我的模块', actionRank: 1, activityId: 'p004_my_message', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => (params.pageData.totalCountReply > 0 ? 1 : 2) // 1：有新消息  2：无新消息
        }
      }
    ]
  },
  'pages/mine/message/reply': {
    exposure: [
      // 曝光上报 - 页面或具体节点
      {
        element: '.report-el-message-reply-item',
        relative: '.report-el-message-reply-scroll-area',
        dataKeys: { activityName: '未读消息曝光', actionRank: 1, activityId: 'p004011001_unreadmessage', activityContent: '' },
        stopReport: (data) => (data.dataset && data.dataset.item && data.dataset.item.lockReport) || false,
        dataFunctions: {
          activityContent: (params) => {
            const data = (params.dataset && params.dataset.item) || {}
            return { courseCode: data.courseCode, courseTitle: data.title, commentCode: data.pictureCode, commentContent: data.replayComment }
          }
        }
      }
    ],
    comMethodTracks: [
      {
        method: 'messageReplyCourseClick',
        dataKeys: { activityName: '未读消息_所属课程点击', actionRank: 2, activityId: 'p004011001_unreadmessage_course', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const data = params.dataset.item || {}
            return { courseCode: data.courseCode, courseTitle: data.title, commentCode: data.pictureCode, commentContent: data.replayComment }
          }
        }
      },
      {
        method: 'messageReplyItem',
        dataKeys: { activityName: '未读消息_回复评论', actionRank: 3, activityId: 'p004011001_unreadmessage_reply', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const data = params.args[0] || {}
            return { courseCode: data.courseCode, courseTitle: data.title, commentCode: data.pictureCode, commentContent: data.replayComment }
          }
        }
      }
    ]
  },
  'pages/share/shareIndex': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-share-now',
        dataKeys: { activityName: '立即邀请', actionRank: 1, activityId: 'p010_invite' }
      },
      {
        element: '.report-el-share-rule',
        dataKeys: { activityName: '活动规则', actionRank: 3, activityId: 'p010_rule' }
      }
    ],
    comMethodTracks: [
      {
        method: 'shareIndexInventCode',
        dataKeys: { activityName: '生成我的专属邀请码', actionRank: 2, activityId: 'p010_invite_code' }
      },
      {
        method: 'shareIndexJumpToGiftInfo',
        dataKeys: { activityName: '请选择礼品', actionRank: 4, activityId: 'p010_prize' }
      }
    ]
  },
  'pages/share/invitePoster': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-save-poster',
        dataKeys: { activityName: '保存海报', actionRank: 1, activityId: 'p010002_save' }
      }
    ]
  },
  'pages/share/invited': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-help-friend',
        dataKeys: { activityName: '为好友助力', actionRank: 1, activityId: 'p010003_assist' }
      }
    ]
  },
  'pages/share/giftInfo': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    elementTracks: [
      {
        element: '.report-el-confirm-info',
        dataKeys: { activityName: '确认信息', actionRank: 1, activityId: 'p011_confirm' }
      }
    ]
  },
  'pages/promote/yearEndReview/YearInventory': {
    exposure: [
      {
        element: '.year-inventory >>> .report-el-1-mk-meet',
        dataKeys: { activityName: '1相遇模块曝光', actionRank: 13, activityId: 'p001002_MK_register' }
      },
      {
        element: '.year-inventory >>> .report-el-2-course-and-like',
        dataKeys: { activityName: '2线上课程和直播模块曝光', actionRank: 16, activityId: 'p001002_MK_course&live' }
      },
      {
        element: '.year-inventory >>> .report-el-3-mk-like',
        dataKeys: { activityName: '3喜欢模块曝光', actionRank: 18, activityId: 'p001002_MK_favourite' }
      },
      {
        element: '.year-inventory >>> .report-el-4-mk-company',
        dataKeys: { activityName: '4陪伴模块曝光', actionRank: 23, activityId: 'p001002_MK_accompany' }
      },
      {
        element: '.year-inventory >>> .report-el-5-mk-struggle',
        dataKeys: { activityName: '5奋斗模块曝光', actionRank: 27, activityId: 'p001002_MK_struggle' }
      },
      {
        element: '.year-inventory >>> .report-el-6-mk-interactive',
        dataKeys: { activityName: '6互动模块曝光', actionRank: 31, activityId: 'p001002_MK_interact', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const interaction = (params.pageData.detail && params.pageData.detail.userYearInteractionVO) || {}
            return interaction.loveCv || interaction.commentPv ? 1 : 2
          }
        }
      },
      {
        element: '.year-inventory >>> .report-el-7-mk-professional',
        dataKeys: { activityName: '7专业模块曝光', actionRank: 33, activityId: 'p001002_MK_speciality', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const major = (params.pageData.detail && params.pageData.detail.userYearMajorListVO) || {}
            return major.majorListVOList && major.majorListVOList.length ? 1 : 0
          }
        }
      },
      {
        element: '.year-inventory >>> .report-el-expose-meet-regist',
        dataKeys: { activityName: '1医生信息曝光', actionRank: 14, activityId: 'p001002_MK_doctor_certificate' }
      },
      {
        element: '.year-inventory >>> .report-el-like-detail-course',
        dataKeys: { activityName: '3喜欢的课程曝光', actionRank: 19, activityId: 'p001002_MK_favouritecourse', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            return { courseCode: course.firstCourseCode, courseTitle: course.courseTitle, courseAuthor: course.courseAuthor, courseLike: course.collection }
          }
        }
      },
      {
        element: '.year-inventory >>> .report-el-like-detail-author',
        dataKeys: { activityName: '3喜欢的讲师曝光', actionRank: 21, activityId: 'p001002_MK_favouriteteacher' }
      },
      {
        element: '.year-inventory >>> .report-el-company-detail-course',
        dataKeys: { activityName: '4特别日子课程曝光', actionRank: 24, activityId: 'p001002_MK_accompany_course', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            return { type: course.type, courseCode: course.courseCode, courseTitle: course.courseTitle, courseAuthor: course.author, courseLike: course.collection }
          }
        }
      },
      {
        element: '.year-inventory >>> .report-el-struggle-detail-course',
        dataKeys: { activityName: '5最晚学习的课程', actionRank: 28, activityId: 'p001002_MK_struggle_course', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            return { courseCode: course.playEndCourseCode, courseTitle: course.courseTitle, courseAuthor: course.author, courseLike: course.collection }
          }
        }
      },
      {
        element: '.year-inventory >>> .report-el-8-year-course',
        dataKeys: { activityName: '8年度课单', actionRank: 35, activityId: 'p001002_MK_annual_course' }
      }
    ],
    elementTracks: [
      {
        element: '.year-inventory >>> .report-el-first-btn',
        dataKeys: { activityName: '立即开启', actionRank: 1, activityId: 'p001002_open' }
      },
      {
        element: '.year-inventory >>> .report-el-online-data-course-like',
        dataKeys: { activityName: '点击查看课程点赞数据', actionRank: 3, activityId: 'p001002_praise_check' }
      },
      {
        element: '.year-inventory >>> .report-el-online-data-save-image',
        dataKeys: { activityName: '线上课程_保存本图', actionRank: 4, activityId: 'p001002_course_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-student-dist-city-view',
        dataKeys: { activityName: '点击查看城市数据', actionRank: 5, activityId: 'p001002_citydata_check' }
      },
      {
        element: '.year-inventory >>> .report-el-student-dist-save-image',
        dataKeys: { activityName: '学生地域分布_保存本图', actionRank: 6, activityId: 'p001002_citydata_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-offline-meeting-save-image',
        dataKeys: { activityName: '线下会议_保存本图', actionRank: 7, activityId: 'p001002_meeting_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-project-coop-save-image',
        dataKeys: { activityName: '课题合作_保存本图', actionRank: 8, activityId: 'p001002_expertproject_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-project-data-display-save-image',
        dataKeys: { activityName: '平台数据_保存本图', actionRank: 9, activityId: 'p001002_platformdata_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-project-data-display-save-long',
        dataKeys: { activityName: '点击保存长图', actionRank: 10, activityId: 'p001002_savelongchart' }
      },
      {
        element: '.year-inventory >>> .report-el-project-data-display-share',
        dataKeys: { activityName: '分享', actionRank: 11, activityId: 'p001002_share' }
      },
      // {
      //   element: '.year-inventory >>> .report-el-year-head-music',
      //   dataKeys: { activityName: '背景音乐', actionRank: 12, activityId: 'p001002_bgm', activityContent: '' },
      //   dataFunctions: {
      //     activityContent: (params) => params.pageData.isPlay ? 1 : 0
      //   }
      // },
      {
        element: '.year-inventory >>> .report-el-8-course-save-image',
        dataKeys: { activityName: '8年度课单点击保存课单长图', actionRank: 36, activityId: 'p001002_MK_annual_course_savepicture' }
      },
      {
        element: '.year-inventory >>> .report-el-8-course-share',
        dataKeys: { activityName: '8年度课单立即分享按钮', actionRank: 38, activityId: 'p001002_MK_annual_course_share' }
      }
    ],
    comMethodTracks: [
      {
        method: 'reportLikeDetailStartCollect',
        dataKeys: { activityName: '3喜欢的课程收藏按钮点击', actionRank: 20, activityId: 'p001002_MK_favouritecourse_collect', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            const courseLike = params.args[0] === 2 ? 0 : 1 // 2-取消收藏 1-收藏
            return { courseCode: course.firstCourseCode, courseTitle: course.courseTitle, courseAuthor: course.courseAuthor, courseLike: courseLike }
          }
        }
      },
      {
        method: 'reportCompanyDetailStartCollect',
        dataKeys: { activityName: '4特别日子课程收藏按钮点击', actionRank: 25, activityId: 'p001002_MK_accompany_collect', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            const courseLike = params.args[0] === 2 ? 0 : 1 // 2-取消收藏 1-收藏
            return { type: course.type, courseCode: course.courseCode, courseTitle: course.courseTitle, courseAuthor: course.author, courseLike: courseLike }
          }
        }
      },
      {
        method: 'reportStruggleStartCollect',
        dataKeys: { activityName: '5最晚学习的课程收藏按钮点击', actionRank: 29, activityId: 'p001002_MK_struggle_course_collect', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const course = params.dataset.course || {}
            const courseLike = params.args[0] === 2 ? 0 : 1 // 2-取消收藏 1-收藏
            return { courseCode: course.playEndCourseCode, courseTitle: course.courseTitle, courseAuthor: course.author, courseLike: courseLike }
          }
        }
      },
      {
        method: 'yearCourseBackFirstPage',
        dataKeys: { activityName: '8年度课单回到第一页按钮', actionRank: 37, activityId: 'p001002_MK_annual_course_backtotop' }
      },
      {
        method: 'yearHeadPlayVoice',
        dataKeys: { activityName: '背景音乐', actionRank: 12, activityId: 'p001002_bgm', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => (params.pageData.isPlay ? 0 : 1)
        }
      }
    ]
  },
  // 轮廓美学
  'pages/msAndlk/msAndlk': {
    exposure: [
      {
        element: '.activity-container >>> .report-el-domTraining',
        dataKeys: { activityName: '班型卡片', actionRank: '$INDEX', activityId: 'p013_class_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: infos && infos.actCode,
              classTypeCode: infos && infos.objectCode,
              applyStatus: infos && infos.applyStatus
            }
          }
        }
      },
      {
        element: '.activity-container >>> .report-el-domExpert-courseList',
        dataKeys: { activityName: '课程合集卡片', actionRank: 1, activityId: 'p013_course_fold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: infos && infos.actCode,
              courseCode: infos && infos.objectCode,
              courseAssociateType: params.pageData.activity_info && params.pageData.activity_info.courseAssociateType
            }
          }
        }
      },
      {
        element: '.activity-container >>> .report-el-domExpert-courserTiled',
        dataKeys: { activityName: '课程平铺卡片', actionRank: '$INDEX', activityId: 'p013_course_unfold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: params.pageData && params.pageData.objectCode,
              courseCode: infos && infos.courseCode,
              courseAssociateType: params.pageData.activity_info && params.pageData.activity_info.courseAssociateType
            }
          }
        }
      }
    ],
    comMethodTracks: [
      {
        method: 'changeTab',
        dataKeys: { activityName: '顶部导航', actionRank: '', activityId: 'p013_top_guide', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params && params.args[1],
          activityContent: (params) => {
            console.log(params)
            const activityInfo = params.pageData.activity_info
            return {
              actName: activityInfo.actName,
              objectCode: activityInfo.objectCode,
              tabName: params.args[0] && params.args[0].label
            }
          }
        }
      },
      // 班型卡片
      {
        method: 'goDetail',
        dataKeys: { activityName: '班型卡片', actionRank: '$INDEX', activityId: 'p013_class_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('===', params)
            const infos = params.dataset && params.dataset.item
            return {
              applyStatus: infos && infos.applyStatus,
              actCode: infos && infos.actCode,
              objectCode: infos && infos.objectCode
            }
          }
        }
      },
      // 课程合集
      {
        method: 'jumpToAllList',
        dataKeys: { activityName: '课程合集卡片', actionRank: 1, activityId: 'p013_course_fold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: infos && infos.actCode,
              courseCode: infos && infos.objectCode,
              courseAssociateType: params.pageData.activity_info && params.pageData.activity_info.courseAssociateType
            }
          }
        }
      },
      // 课程平铺
      {
        method: 'jumpToDetail',
        dataKeys: { activityName: '课程平铺卡片', actionRank: '$INDEX', activityId: 'p013_course_unfold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: params.pageData && params.pageData.objectCode,
              courseCode: infos && infos.courseCode,
              courseAssociateType: params.pageData.activity_info && params.pageData.activity_info.courseAssociateType
            }
          }
        }
      },
      // 考试合集
      {
        method: 'jumpToExamList',
        dataKeys: { activityName: '考试合集卡片', actionRank: '1', activityId: 'p013_exam_fold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.args[0]
            return {
              examAssociateType: params.pageData.activityinfo && params.pageData.activityinfo.examAssociateType,
              actCode: params.pageData.activityinfo && params.pageData.activityinfo.objectCode,
              paperListCode: infos && infos.paperListCode
            }
          }
        }
      },
      // 考试
      {
        method: 'jumpToExamDetail',
        dataKeys: { activityName: '考试平铺卡片', actionRank: '$INDEX', activityId: 'p013_exam_unfold_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              examAssociateType: params.pageData.info.examAssociateType,
              actCode: infos && infos.actCode,
              paperCode: infos && infos.paperCode
            }
          }
        }
      }
    ]
  },

  // 轮廓美学-班型详情
  'pages/msAndlk/components/training/trainingDetail/trainingDetail': {
    exposure: [
      {
        element: '.activity-container >>> .report-el-trainingDetail-items',
        dataKeys: { activityName: '班次卡片', actionRank: '$INDEX', activityId: 'p013001_class_course_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('=====', params)
            const infos = params.dataset.item
            return {
              actCode: params.pageData.activity_info.actCode,
              classTypeCode: params.pageData.activity_info.objectCode,
              classCode: infos && infos.objectCode,
              status: infos && infos.status
            }
          }
        }
      },

      // 申请规则及要求-合集
      {
        element: '.activity-container >>> .report-el-RuleAndrequire-heji',
        dataKeys: { activityName: '申请规则卡片-考试合集', actionRank: 1, activityId: 'p013001_class_course_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              signFlag: params.pageData.activity_info.signFlag,
              status: params.pageData.rankList[0].status,
              examAssociateType: infos && infos.examAssociateType,
              actCode: infos && infos.actCode,
              classTypeCode: infos && infos.classTypeCode
            }
          }
        }
      },
      // 申请规则及要求-平铺
      {
        element: '.activity-container >>> .report-el-RuleAndrequire-pingpu',
        dataKeys: { activityName: '申请规则卡片-考试平铺', actionRank: '$INDEX', activityId: 'p013001_class_exam_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('====', params)
            const infos = params.dataset.item
            return {
              signFlag: params.pageData.activity_info.signFlag,
              status: params.pageData.rankList[0].status,
              actCode: infos && infos.actCode,
              classTypeCode: infos && infos.classTypeCode,
              paperCode: infos && infos.paperCode
            }
          }
        }
      }
    ],
    comMethodTracks: [
      {
        method: 'jumpExamList',
        dataKeys: { activityName: '申请规则卡片-考试合集', actionRank: 1, activityId: 'p013001_class_course_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('=======', params)

            const infos = params.dataset.item
            return {
              signFlag: params.pageData.activity_info.signFlag,
              status: params.pageData.rankList[0].status,
              examAssociateType: infos && infos.examAssociateType,
              actCode: infos && infos.actCode,
              classTypeCode: infos && infos.classTypeCode
            }
          }
        }
      },
      // 申请规则及要求-平铺
      {
        method: 'jumpToExamDetail',
        dataKeys: { activityName: '申请规则卡片-考试平铺', actionRank: '$INDEX', activityId: 'p013001_class_exam_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              signFlag: params.pageData.activity_info.signFlag,
              status: params.pageData.rankList[0].status,
              actCode: infos && infos.actCode,
              classTypeCode: infos && infos.classTypeCode,
              paperCode: infos && infos.paperCode
            }
          }
        }
      },
      {
        method: 'changeTab',
        dataKeys: { activityName: '顶部导航', actionRank: '', activityId: 'p013001_top_guide', activityContent: '' },
        dataFunctions: {
          actionRank: (params) => params.args[0] && params.args[0].value,
          activityContent: (params) => {
            const activityInfo = params.pageData.activity_info
            return {
              actCode: activityInfo.actCode,
              classTypeCode: activityInfo.actCode,
              tabName: params.args[0] && params.args[0].label
            }
          }
        }
      },
      // 班型详情
      {
        method: 'showWind',
        dataKeys: { activityName: '班次卡片', actionRank: '$INDEX', activityId: 'p013001_class_course_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.dataset.item
            return {
              actCode: params.pageData.info.actCode,
              classTypeCode: params.pageData.info.objectCode,
              classRankCode: infos && infos.objectCode,
              status: infos && infos.status
            }
          }
        }
      },
      // 取消申请
      {
        method: 'showWind',
        dataKeys: { activityName: '取消申请按钮', actionRank: '1', activityId: 'p013001001_submit_cannel', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('params', params)
            const infos = params.dataset.item
            return {
              actCode: params.pageData.info.actCode,
              classTypeCode: params.pageData.info.objectCode,
              classRankCode: infos && infos.objectCode
            }
          }
        }
      },
      // 取消申请-确认
      {
        method: 'dialogConfirm',
        dataKeys: { activityName: '确认取消申请', actionRank: '1', activityId: 'p013001001_submit_cannel_yes', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            console.log('====', params)
            return {
              actCode: params.pageData.info.actCode,
              classTypeCode: params.pageData.info.objectCode,
              classesCode: params.pageData.rankList[0].objectCode
            }
          }
        }
      }
    ]
  },

  // 轮廓美学-提交申请信息
  'pages/msAndlk/components/training/trainingDetail/signUp': {
    exposure: [
      {
        dataKeys: {}
      }
    ],
    comMethodTracks: [
      // 提交申请人信息
      {
        method: 'submit',
        dataKeys: { activityName: '提交申请人信息', activityId: 'p013001001_submit', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const infos = params.pageData.formData
            return {
              actCode: infos && infos.actCode,
              classRankCode: infos && infos.classRankCode,
              classTypeCode: infos && infos.classTypeCode
            }
          }
        }
      }
    ]
  },

  // 轮廓美学-专家课程合集列表
  'pages/msAndlk/components/list/tutorCourse': {
    comMethodTracks: [
      // 课程列表tab
      {
        method: 'changeTab',
        dataKeys: { activityName: '顶部导航', actionRank: '$INDEX', activityId: 'p013002_top_guide', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const info = params.args[0]
            return {
              actCode: info.actCode,
              courseCode: info.objectCode
            }
          }
        }
      },
      // 课程列表item
      {
        method: 'jumpToCourseDetails',
        dataKeys: { activityName: '课程卡片', actionRank: '$INDEX', activityId: 'p013002_expert_course_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const info = params.dataset.item
            return {
              actCode: params.query.actCode,
              topCode: params.query.code,
              courseCode: info.courseCode
            }
          }
        }
      }
    ]
  },

  // 轮廓美学-考试合集列表
  'pages/msAndlk/components/list/pxTestList': {
    comMethodTracks: [
      // 考试列表tab
      {
        method: 'actived',
        dataKeys: { activityName: '顶部导航', actionRank: '$INDEX', activityId: 'p013002_top_guide', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const info = params.pageData
            return {
              actCode: info.actCode,
              courseCode: info.code
            }
          }
        }
      },
      // 考试列表item
      {
        method: 'jumpToExamDetail',
        dataKeys: { activityName: '考试卡片', actionRank: '$INDEX', activityId: 'p013002_exam_card', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const info = params.dataset.item
            return {
              actCode: info.actCode,
              examCode: info.examCode,
              paperCode: info.paperCode
            }
          }
        }
      }
    ]
  },

  // 轮廓美学-考试结果-重新考试
  'pages/mine/product/examresult': {
    comMethodTracks: [
      // 考试列表tab
      {
        method: 'submit',
        dataKeys: { activityName: '重新考试', actionRank: 1, activityId: 'p013004_retest', activityContent: '' },
        dataFunctions: {
          activityContent: (params) => {
            const info = params.pageData.examInfo
            return {
              actCode: info.actCode,
              examiners: info.examiners,
              paperCode: info.paperCode
            }
          }
        }
      }
    ]
  },

  // 风格美学
  'pages-sub/activity/fengge/entry': {
    elementTracks: [
      {
        element: '.report-el-start-gender',
        dataKeys: { activityName: '开始分析', actionRank: 0, activityId: 'p015_start_gender' }
      }
    ]
  }
}

/**
 * 专门针对右上角分享给好友或分享到朋友圈的埋点配置
 *   比如你想在课程详情页分享的时候，上报当前课程的objectCode，则需要在这里配置
 */
export const topShareConfig = {
  'pages/detail/newDetail': {
    dataKeys: { activityContent: '$PAGE.courseReportObj' }
  }
}
