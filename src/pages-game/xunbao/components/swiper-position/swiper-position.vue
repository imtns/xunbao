<template>
  <view @touchstart="touchStart" @touchend="touchEnd" @mousedown="mousedown" @mouseup="mouseup">
    <slot></slot>
  </view>
</template>
<script>
  export default {
    props: ['itemIndex'],
    data() {
      return {
        startTime: 0,//触摸时间
        startPositionX: 0,//手机端--开始触摸X方向初始值
        startPositionY: 0,//手机端--开始触摸Y方向初始值
        endPositionX: 0,//手机端--开始触摸X方向改变值
        endPositionY: 0,//手机端--开始触摸Y方向改变值
        pcStartSlideX: 0,//pc端--开始拖动X方向初始值
        pcStartSlideY: 0,//pc端--开始拖动Y方向初始值
        pcEndStartSlideX: 0,//pc端--开始拖动X方向改变值
        pcEndStartSlideY: 0,//pc端--开始拖动Y方向改变值
      }
    },
    methods: {
      //移动端--手指开始触摸
      touchStart(event) {
        this.startTime = Date.now()
        this.startPositionX = event.changedTouches[0].clientX
        this.startPositionY = event.changedTouches[0].clientY
      },
      //移动端--手指触摸完成
      touchEnd(event) {
        const endTime = Date.now()
        if (endTime - this.startTime > 2000) {
          return
        }
        let elePosition = {}
        this.endPositionX = event.changedTouches[0].clientX
        this.endPositionY = event.changedTouches[0].clientY
        let _absX = Math.abs(this.endPositionX - this.startPositionX), _absY = Math.abs(this.endPositionY - this.startPositionY)
        if (_absX > _absY && _absX > 10) {
          if (this.endPositionX - this.startPositionX > 0) {
            elePosition = { type: 0, index: this.itemIndex, status: 4, msg: '移动端向右滑动' }
          } else {
            elePosition = { type: 0, index: this.itemIndex, status: 3, msg: '移动端向左滑动' }
          }
        } else if (_absY > _absX && _absY > 10) {
          if (this.endPositionY - this.startPositionY > 0) {
            elePosition = { type: 0, index: this.itemIndex, status: 2, msg: '移动端向下滑动' }
          } else {
            elePosition = { type: 0, index: this.itemIndex, status: 1, msg: '移动端向上滑动' }
          }
        } else {
          return
        }
        this.$emit('slideCallback', elePosition)
      },
      //pc端--鼠标按下
      mousedown(event) {
        this.startTime = Date.now()
        this.pcStartSlideX = event.clientX
        this.pcStartSlideY = event.clientY
      },
      //pc端--鼠标松开
      mouseup(event) {
        const endTime = Date.now()
        if (endTime - this.startTime > 2000) {
          return
        }
        let elePosition = {}
        this.pcEndStartSlideX = event.clientX
        this.pcEndStartSlideY = event.clientY
        let _absX = Math.abs(this.pcEndStartSlideX - this.pcStartSlideX), _absY = Math.abs(this.pcEndStartSlideY - this.pcStartSlideY)
        if (_absX > _absY && _absX > 10) {
          if (this.pcEndStartSlideX - this.pcStartSlideX > 0) {
            elePosition = { type: 1, index: this.itemIndex, status: 4, msg: 'pc端向右滑动' }
          } else {
            elePosition = { type: 1, index: this.itemIndex, status: 3, msg: 'pc端向左滑动' }
          }
        } else if (_absY > _absX && _absY > 10) {
          if (this.pcEndStartSlideY - this.pcStartSlideY > 0) {
            elePosition = { type: 1, index: this.itemIndex, status: 2, msg: 'pc端向下滑动' }
          } else {
            elePosition = { type: 1, index: this.itemIndex, status: 1, msg: 'pc端向上滑动' }
          }
        } else {
          return
        }
        this.$emit('slideCallback', elePosition)
      }
    }
  }
</script>
