<template>
  <view>
    <view class="canvas-mask flex-cen">
      <view class="content riseShow">
        <image class="myCanvas" :src="posterImgUrl"></image>
        <view class="flex-aro">
          <view class="btn" @click="savePhoto">保存到手机相册</view>
        </view>
      </view>
    </view>
    <canvas canvas-id="myCanvas" id="myCanvas"></canvas>
    <!-- <showModal showModalOption="{{showModalOption}}" bindoperation="operation"></showModal> -->
  </view>
</template>

<script>
import tool from '@/pages-game/xunbao/js/tool.js'
export default {
  data() {
    return {
      showModalOption: {
        isShow: false,
        type: 0,
        title: '访问手机相册',
        test: '小程序将访问您的手机相册，将生成的海报保存到您的手机相册。',
        cancelText: '取消',
        confirmText: '确定',
        color_confirm: '#0BB20C'
      },
      posterImgUrl: '',
      isIos: 0
    }
  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // this.setData({ userInfo: wx.getStorageSync("userInfo") || {} })
      // tool.getImageInfo('https://riseyanxuan-prod.cn-bj.ufileos.com/test%2F1671446697071?UCloudPublicKey=TOKEN_3bbbc167-b224-4fe2-896a-840ee16891af&Signature=%2BipnCYWPaeDAVkoGuTKDECHJ0JU%3D&Expires=1721512105').then(res => {
      //   console.log("【获取图片信息成功】", res)
      //   tool.showModal("获取图片信息成功", res.errMsg)
      // }).catch(err => {
      //   console.log("【获取图片信息失败】", err)
      //   tool.showModal("获取图片信息失败", err.errMsg)
      // })
      // return
      this.getSharePoster()
      // tool.getSystemInfo().then(res => {
      //   this.setData({ isIos: res.model.includes("iPhone") ? 1 : 2})
      // })
    },
    //获取分享海报
    getSharePoster() {
      var _this = this
      tool.loading('海报生成中', 'loading')
      this.canvasLoading = setTimeout(() => {
        if (!this.posterImgUrl) {
          tool.loading_h()
          tool.alert('海报生成失败，请稍后再试')
        }
      }, 15000)
      tool
        .canvasImg({
          canvasId: 'myCanvas',
          canvasSize: '574*1022',
          // canvasSize: '1022*574',
          scale: 1,
          imgList: [
            { url: 'https://img.vrupup.com/web/szq/images/poster_02.png', drawW: 574, drawH: 1022, imgX: 0, imgY: 0 },
            // { url: "https://img.vrupup.com/web/szq/images/poster_02s.png", drawW: 1022, drawH: 574, imgX: 0, imgY: 0 },
            // { url: "https://img.vrupup.com/web/szq/images/shuiyin.png", imgX: 10, position: 3, syScale: 0.4, syScales: 0.3 },
            { url: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets/district/code.jpg', drawW: 91, drawH: 91, imgX: 452, imgY: 876 }
            // { url: "https://riseyanxuan-prod.cn-bj.ufileos.com/test%2F1671446697071?UCloudPublicKey=TOKEN_3bbbc167-b224-4fe2-896a-840ee16891af&Signature=%2BipnCYWPaeDAVkoGuTKDECHJ0JU%3D&Expires=1721512105", drawW: 91, drawH: 91, imgX: 452, imgY: 876 }
            // { url: "https://riseyanxuan-prod.cn-bj.ufileos.com/test%2F1671446207810?UCloudPublicKey=TOKEN_3bbbc167-b224-4fe2-896a-840ee16891af&Signature=Des%2BZDz8IoVnnpNkF%2FlC653GSZk%3D&Expires=1721511616", drawW: 91, drawH: 91, imgX: 452, imgY: 876 }
            // { url: "https://fun-flow.cn-bj.ufileos.com/test%2F1672303722497?UCloudPublicKey=TOKEN_0389d875-4c9f-4ba8-b94a-dddb53e76a07&Signature=75timwtfr7bBHIEac01MZSg1OZc%3D&Expires=1722369130", drawW: 91, drawH: 91, imgX: 452, imgY: 876 }
          ],
          textList: [
            { string: '中国太平人寿222', color: '#FFEEE9', fontSize: '23', fontFamily: 'ygyxsziti2', textAlign: 'left', bold: false, textX: 0, textY: 0 },
            { string: '中国太平人寿333', color: '#FFEEE9', fontSize: '23', fontFamily: 'Arial', textAlign: 'center', bold: false, textX: 287, textY: 340 },
            { string: '这是一些文字可以居中', color: '#FF9B5F', fontSize: '23', fontFamily: 'Arial', textAlign: 'center', bold: false, textX: 287, textY: 500 },
            {
              string: '一份份捐赠如星火燎原之势，点亮孩子的希望，爱润童心，助力成长！特发此证，感恩您的爱心义举！',
              color: '#60294E',
              fontSize: '22',
              fontFamily: 'Arial',
              fontStyle: 'italic',
              bold: false,
              textX: 130,
              textY: 545,
              wrap: 15,
              lineHeight: 34
            },
            { string: '长按识别二维码，马上进入体验', color: '#fff', fontSize: '13', fontFamily: 'Arial', bold: false, textX: 364, textY: 977 }
          ]
        })
        .then((res) => {
          console.log('res', res)
          tool.loading_h()
          _this.isPosterOk = true
          _this.posterImgUrl = res
          // _this.setData({
          //   isPosterOk: true,
          //   posterImgUrl: res
          // })
        })
    },
    //保存到相册
    savePhoto() {
      tool.loading('海报保存中', 'loading')
      this.isSettingScope()
    },
    //判断是否授权访问手机相册
    isSettingScope() {
      let _self = this
      auth.isSettingScope('scope.writePhotosAlbum').then((res) => {
        console.log('res', res)
        if (res.status == 0) {
          tool.loading_h()
          _self.showHideModal()
        } else {
          _self.saveImageToPhotosAlbum(this.posterImgUrl)
        }
      })
    },
    //将canvas生成的临时海报图片保存到手机相册
    saveImageToPhotosAlbum(imgUrl) {
      let _this = this
      wx.saveImageToPhotosAlbum({
        filePath: imgUrl,
        success(res) {
          setTimeout(() => {
            tool.alert('已保存到手机相册')
            this.canvasHidden = false
            this.isShare = true
            // _this.setData({
            //   canvasHidden: false,
            //   isShare: true
            // })
          }, 600)
        },
        fail() {
          tool.alert('保存失败')
        },
        complete() {
          tool.loading_h()
        }
      })
    },
    //点击自定义Modal弹框上的确定按钮
    operation(e) {
      if (e.detail.confirm) {
        auth.openSetting((res) => {
          //用户自行从设置勾选授权后
          if (res.authSetting['scope.writePhotosAlbum'] && this.posterImgUrl) {
            this.saveImageToPhotosAlbum(this.posterImgUrl)
          }
        })
      }
      this.showHideModal()
    },
    //打开、关闭自定义Modal弹框
    showHideModal() {
      let _showModalOption = this.showModalOption
      _showModalOption.isShow = !_showModalOption.isShow
      this.showModalOption = _showModalOption
      // this.setData({ showModalOption: _showModalOption })
    }
  }
}
</script>

<style>
.canvas-mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.canvas-mask .content {
  margin: auto;
  width: 574rpx;
  transform-style: preserve-3d;
  perspective: 2000rpx;
}
.canvas-mask .content .myCanvas {
  width: 100%;
  height: 1022rpx;
  background-color: #fff;
  position: relative;
  z-index: 500;
}
.canvas-mask .content .btn {
  width: 60%;
  height: 62rpx;
  background-color: #e53333;
  color: #fff;
  font-size: 26rpx;
  border-radius: 62rpx;
  text-align: center;
  line-height: 62rpx;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50rpx;
  font-family: 'ygyxsziti2';
}
.share-box {
  position: relative;
}
.share-box .btn-share {
  width: 100%;
  height: 100%;
  position: absolute;
  background: transparent;
  border: 0;
}
.share-box .btn-share::after {
  border: 0 !important;
}
#myCanvas {
  width: 574px;
  height: 1022px;
  position: fixed;
  left: 100%;
  top: 0;
}
</style>
