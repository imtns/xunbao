/**
 ************************** 常规配置项 **************************
 */
//接口请求成功status状态值
const ERR_Ok = 200
//接口请求失败status状态值
const ERR_NO = 0
//微信config注册配置信息请求接口地址
const WXCONFIG_URL = ['https://auth.vrupup.com/sanguo/auth/share.php?appid=wx7c3ed56f7f792d84&type=js',//[0：云聚客]
                      'https://auth.vrupup.com/sanguo/auth/share.php?appid=wx31dd8e9bcce66497&type=js',//[1：嘻游记]
                      'https://auth.vrupup.com/sanguo/auth/share.php?appid=wxa5e08871399cd731&type=js',//[2：云美]
                      'https://auth.vrupup.com/sanguo/auth/share.php?appid=wx38da89ddf8b76665&type=js',//[3：深圳网晨]
                      'https://iclubh5.gtmc.com.cn/homeservice/gqft/backend/share.php?type=js',//[4：客户]
                      'https://game.flyh5.cn/game/twolevel_autho/share.php?auth_appid=wx7c3ed56f7f792d84&isonlyopenid=true',//[5：旧云聚客]
                     ]
//微信config注册配置信息script地址
const WXCONFIG_SCRIPT_URL = 'http://game.flyh5.cn/game/twolevel_autho/share.php?auth_appid=wx7c3ed56f7f792d84&type=js&isonlyopenid=true'
//项目接口请求地址
const REQUEST_URL = 'http://game.flyh5.cn/game/wx7c3ed56f7f792d84/rdl_snowflower/public/index.php'
//后端授权链接（项目访问链接/分享链接）
const AUTH_URL = 'https://game.vrupup.com/sanguo/songyu/h5/web_test/index.php'
//获取用户信息请求地址
const GET_USER_INFO_URL = 'http://game.flyh5.cn/game/wx7c3ed56f7f792d84/rdl_tests/api.php?a=get_session'
//本地请求代理请求地址
const REQUEST_PROXY_URL = '/api'
//核弹系统接口请求地址短码code[如果是转移服务器项目，把此项设置为空]
const PROJECT_CONFIG_CODE = 'tJ4GXH2P2luArDVm0u9'
//静态资源地址(cdn)
const ASSETS_URL = 'https://img.vrupup.com/web/szq/ylzhennong/'
/**
 *
 ************************** 项目配置项 **************************
 */
/**
 * 默认分享配置信息（当核弹码为空时生效）
 */
const SHARECONFIG = {
  type: 0,//配置分享类型：0为即将废弃的老版本（可以监听分享动作），1为新版本（可以监听配置是否成功）
  hideMenuList: { pengyou: false, pengyouquan: false, qq: false, qqkongjian: false, fuzhi: false, shoucang: false, qqliulanqi: false, safariliulanqi: false },//批量隐藏功能按钮
  ShareUrl: AUTH_URL,
  Title: '[模板默认]专注vue',
  Desc: '[模板默认]vue是一套用于构建用户界面的渐进式JavaScript框架。',
  ShareImage: 'https://img.vrupup.com/web/szq/images/vue_01.jpg'
}
/**
 * 项目开关配置信息
 */
const PROJECT_CONFIG = {
  is_loading_page: false,//是否配置loading预加载页
  wx_jssdk_field: 0,//获取不同公众号的微信jssdk注册参数
  is_page_locking: true,//是否锁定页面上拉下拉滑动
  wx_jssdk_type: 1,//获取微信jssdk注册参数类型：0为加载script标签获取，1为请求接口形式获取
  is_data_statistics: true,//是否统计抵达页、点击分享、时长数据
  /*从后端链接授权后获取后台带过来的用户数据配置*/
  getUserInfo: {
    is_open: false,//是否加载页面后自动获取用户信息后存储到本地两种缓存中
    type: 1,//获取方式：1为从本地缓存或者url中获取，2为请求后端接口获取
    get_data_list: ['openid', 'token', 'nickname', 'avatar'],//从本地缓存或者url中获取的字段名列表(当type为1时生效)
    response: "res.data.data"//从后端接口请求返回的数据字段格式(当type为2时生效)
  },
  /*刷新页面后路由处理配置*/
  refresh_back_to_home: {
    is_open: false,//是否回到首页，hash模式路由默认刷新后停留在当前页
    home_url: '/'//首页的路由地址,也可以配置其它想跳转的路由地址
  },
  is_wx_share: true,//是否配置分享
  /*背景音乐配置*/
  is_background_music: {
    is_open: false,//是否开启背景音乐
    // type: 2,//播放形式：0为audio标签播放，1为当页面中有video标签时安卓机采用js方法播放，2为采用js方法播放
    music_src: ["https://game.flyh5.cn/resources/game/wechat/szq/gaoxiao/music.mp3"],//默认背景音乐mp3文件地址（当核弹短码为空时生效）
    constrols_btn_url: ['https://udstatic.imeik.com/pcUploads/1726654074725/music_01.png', 'https://udstatic.imeik.com/pcUploads/1726654078342/music_02.png']//播放暂停按钮icon图片路径，前者为播放状态后者为暂停状态
  },
  /*绿标配置*/
  vConsole: {
    is_open: 0,//是否开启绿标:0为永久不开启，1为永久开启，2为本地开发不开启线上永久开启，3为本地开发不开启线上在项目上线日期前开启，4为openid白名单开启
		is_open_pagespy: '',//是否开启pageSpy:为空则为不开启，为项目名字符串时为插件标题
    openWhiteConfig: {
      whiteList: ['oBXw5w_e0LLLRb4AW0KWVFyyq3bg', 'oBXw5wwfc8yUn6NG1HMdyaxpgh5g'],//绿标白名单，供项目上线后打开绿标使用（当is_open为4时生效,展示为红标）
      response: "openid",//本地缓存唯一标识的数据字段格式
      responsePosition: 0//唯一标识存储位置：0为sessionStorage，1为localStorage
    },
    green_label_title: "V 1.0.2"//浮标文字，一般用于版本号标明
  },
  is_offline_sign_out: false,//项目下线后是否在提示后关闭退出网页
  is_testing_user_id: false//是否检测本地缓存中的用户唯一标识
}
/**
 * 第三方密钥配置信息
 */
const SECRETKEY = {
  secretkey_qq_map: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ',//腾讯地图位置密钥
  secretkey_baidu_map: 'AqHbeO1DTPXX06zcMKTqhhOAHkyqnqxY',//百度地图位置密钥
  secretkey_amap_map: '36b7d67054e5dcd7d391ab517478ccfe',//高德地图位置密钥
  secretkey_juhe_phone_region: '40c2bcf1f7d2b93fe86254759ba95d6d',//聚合数据获取手机号归属地密钥
  secretkey_jisu_phone_region: '61c24049fd659e7f'//极速数据获取手机号归属地密钥
}

export {
  ERR_Ok,
  ERR_NO,
  ASSETS_URL,
  WXCONFIG_URL,
  WXCONFIG_SCRIPT_URL,
  REQUEST_URL,
  REQUEST_PROXY_URL,
  PROJECT_CONFIG_CODE,
  AUTH_URL,
  GET_USER_INFO_URL,
  PROJECT_CONFIG,
  SHARECONFIG,
  SECRETKEY
}
