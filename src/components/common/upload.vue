<template>
  <view class="ik-upload-wrap">
    <view class="ik-upload-inner">
      <slot name="list">
        <view v-for="(item, index) in fileList" v-if="fileList && fileList.length" :key="index" class="done">
          <image v-if="uploadType!=='file'" mode="aspectFill" :src="item" @click="previewFile(index)"></image>
          <image v-else mode="aspectFill" src="https://udstatic.imeik.com/pcUploads/1669284588429/fileholder.png"></image>
          <image class="icon" src="@/static/assets/images/close-circle-fill.png" @click.stop="deleteFile(index)" />
        </view>
      </slot>
      <slot v-if="fileList.length < max">
        <view class="preview-holder">
          <view class="preview" :class="uploading?'mask':''">
            <ik-loading v-if="uploading" :loading="uploading"></ik-loading>
            <view v-else @click="uploadFile">
              <uni-icons class="icon" type="plusempty" size="20"></uni-icons>
              <view>{{ placeholder }}</view>
            </view>
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
import AliOss from '../../utils/aliOssSts.js'
export default {
  name: 'upload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    uploadType: {
      type: String,
      default: 'image' // video image file
    },
    placeholder: {
      type: String,
      default: '点击上传'
    },
    inputValue: {
      type: [String, Array],
      default: () => []
    },
    max: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      uploading: false,
      fileList: [],
      videoList: [] // 上传视频时，最后返回出去的值
    }
  },
  watch: {
    inputValue: {
      handler(val) {
        // 这里暂时只上传图片的时候回填吧，视频待定
        if (val && this.uploadType === 'image') {
          this.fileList = [].concat(val)
        }

        this.$nextTick(() => {
          if (val && this.uploadType === 'file') {
            this.fileList = [].concat(val)
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    // 上传文件
    uploadFile() {
      const _this = this

      // 禁用状态
      if (_this.disabled) { return }

      // 视频上传
      if (this.uploadType === 'video') {
        // chooseMedia 只支持微信小程序，所以这里加兼容判断
        // #ifdef MP-WEIXIN
        uni.chooseMedia({
          count: 1,
          mediaType: ['video'],
          sourceType: ['album', 'camera'],
          maxDuration: 30,
          success(res) {
            res = res.tempFiles[0] // 取第一个
            console.log('chooseMedia', res)
            _this.uploadVideo(res)
          }
        })
        // #endif
        // #ifndef MP-WEIXIN
        uni.chooseVideo({
          sourceType: ['album', 'camera'],
          // maxDuration: 600,
          compressed: true,
          camera: 'back',
          success(res) {
            console.log('chooseVideo', res)
            _this.uploadVideo(res)
          }
        })
        // #endif
        return
      }

      // 文件上传
      if (this.uploadType === 'file') {
        wx.chooseMessageFile({
          count: 1,
          type: 'all',
          success(res) {
            _this.uploadAllTypeFile(res)
          }
        })
        return
      }

      // 图片上传
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFilePaths;

          // 上传到阿里云
          const savePath = 'image'
          const filePath = res.tempFiles[0].path
          _this.uploading = true
          _this.$emit('loading', true)
          AliOss.upload(filePath, savePath, (res) => {
            if (res) {
              console.log('图片上传成功', res)
              _this.fileList.push(res)
              _this.updateModel()
              _this.uploading = false
              _this.$emit('loading', false)
            } else {
              console.log('图片上传失败，请稍后重试')
              _this.uploading = false
              _this.$emit('loading', false)
            }
          })
        }
      })
    },

    // 上传视频
    uploadVideo(res) {
      // 上传成功返回数据示例
      // cookies: []
      // data: ""
      // errMsg: "uploadFile:ok"
      // header: {Server: "AliyunOSS", Date: "Fri, 06 May 2022 06:45:20 GMT", Content-Length: "0", Connection: "keep-alive", x-oss-request-id: "6274C3FCED63F03136DD17FE", …}
      // statusCode: 200

      // 上传到阿里云
      // {url: res.tempFilePath, coverUrl: res.thumbTempFilePath}
      this.uploading = true
      this.$emit('loading', true)
      const savePath = 'video'
      const coverUrl = res.thumbTempFilePath
      const filePath = res.tempFilePath
      AliOss.upload(filePath, savePath, (res) => {
        if (res) {
          console.log('视频上传成功', res)
          this.videoList.push(res)
          this.fileList.push(coverUrl) // 封面图
          this.updateModel()
          this.uploading = false
          this.$emit('loading', false)
        } else {
          console.log('视频上传失败，请稍后重试')
          this.uploading = false
          this.$emit('loading', false)
        }
      })
    },

    uploadAllTypeFile(res) {
      const savePath = 'file'
      const file = res.tempFiles[0]
      const filePath = file.path
      // 文件上传大小小于10M
      if (file.size > 10 * 1024 * 1024) {
        setTimeout(() => {
          uni.showToast({
            title: '请上传不大于10M的文件',
            icon: 'none'
          })
        }, 500)
        return
      }
      this.uploading = true
      this.$emit('loading', true)
      AliOss.upload(filePath, savePath, (res) => {
        if (res) {
          console.log('文件上传成功', res)
          this.fileList.push(res)
          this.updateModel()
          this.uploading = false
          this.$emit('loading', false)
        } else {
          console.log('文件上传失败，请稍后重试')
          this.uploading = false
          this.$emit('loading', false)
        }
      })
    },

    // 删除文件
    deleteFile(index) {
      this.fileList.splice(index, 1)
      // 上传视频时，同步删除videoList
      if (this.uploadType === 'video') {
        this.videoList.splice(index, 1)
      }

      this.updateModel()
    },

    // 更新绑定的model值
    updateModel() {
      let res = [].concat(this.fileList)
      // 上传视频时，取videoList
      if (this.uploadType === 'video') {
        res = [].concat(this.videoList)
      }

      // 单张上传的时候直接返回url
      if (this.max === 1) {
        res = res[0] || ''
      }

      this.$emit('input', res)
      this.$emit('change', res)
    },

    // 预览
    previewFile(index) {
      uni.previewImage({
        current: index,
        urls: this.fileList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ik-upload-wrap {
  .ik-upload-inner {
    // display: flex;
    .done {
      position: relative;
      display: inline-block;
      float: left;
      width: 160rpx;
      height: 160rpx;
      margin-top: 12rpx;
      margin-right: 32rpx;
      margin-bottom: 12rpx;
      // border: 2rpx solid #DCDFE6;
      border-radius: 24rpx;

      .icon {
        position: absolute;
        top: -12rpx;
        right: -12rpx;
        width: 32rpx;
        height: 32rpx;
      }

      image {
        max-width: 100%;
        max-height: 100%;
        border-radius: 24rpx;
      }
    }

    .preview-holder {
      display: inline-block;
      float: left;
      width: 160rpx;
      height: 160rpx;
      margin-top: 12rpx;
      margin-right: 32rpx;
      margin-bottom: 12rpx;

      .preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 160rpx;
        height: 160rpx;
        border: 2rpx dashed #DCDFE6;
        border-radius: 24rpx;

        &.mask {
          background: rgb(0 0 0 / 10%);
        }

        .icon {
          display: inline-block;
          width: 44rpx;
          height: 44rpx;

          // border: 2rpx dashed #DCDFE6;
          margin: 14rpx 0;
          line-height: 44rpx;
          text-align: center;
        }

        view {
          color: rgb(0 0 0 / 45%);
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          text-align: center;
        }
      }
    }
  }
}
</style>
