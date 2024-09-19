<template>
	<view class="load-more flex-cen-col" :class="{'not': loadMoreType == 0}" :style="{'padding': (loadMoreType == 0 ? padding.split(',')[1] : padding.split(',')[0])+' 0'}">
	  <view class="img" v-if="loadMoreType == 0">
	    <text v-if="!iconfontType" class="iconfont" :class="[iconfontTypes ? iconfont[0] : iconfont]" :style="{fontSize:iconfontSize,color:iconfontColor}"></text>
	    <image v-else :src="iconfontTypes ? iconfont[0] : iconfont" :class="['iconfont', iconfont]" :style="{width:iconfontSize,background:iconfontColor,marginBottom:margin}"></image>
	  </view>
	  <view class="p" :style="{fontSize:textSize,'color':textColor}">{{textList[loadMoreType]}}</view>
	</view>
</template>

<script>
	export default {
		name:"load-more",
    props: {
      iconfont: {//字体图标或者图片
        type: [String, Array],
        default: 'icon-xiaoxihezi-kong'
      },
      margin: {//图标、图标离提示文字的距离
        type: String,
        default: '0'
      },
      padding: {//整体上下距离:数组第一项为纯文字时上下间距，数组第二项为有图标、图片时的上下间距
        type: [String, Array],
        default:'20px,80rpx'
      },
      loadMoreType: {//加载状态：0为暂无数据，1为加载中，2为没有更多
        type: [String, Number],
        default: 1
      },
      textList: {//提示文字
        type: Array,
        default: () => ['暂无数据', '加载中...', '- 网晨科技 -']
      }
    },
		data() {
			return {
				iconfontSize: '180rpx',//默认字体图标、图片大小
        iconfontColor: 'green',//默认字体图标颜色
        textSize: '28rpx',//默认提示文字大小
        textColor: '#333',//默认提示文字颜色
        iconfontType: '',
        iconfontTypes: '',
        iconfontSize: '',
        iconfontColor: '',
        textSize: '',
        textColor: '',
			}
		},
    mounted() {
      let _iconfont = this.iconfont, _iconfontType, _iconfontTypes,  _textList_three = this.textList[3] || '',  _textList_four = this.textList[4] || ''
      if (typeof (_iconfont) == 'string') {
        _iconfontType = this.isIncludes(_iconfont, '.')
        _iconfontTypes = 0
      } else if (typeof (_iconfont) == 'object') {
        _iconfontType = this.isIncludes(_iconfont[0], '.')
        _iconfontTypes = 1
      }
      this.iconfontType = _iconfontType
      this.iconfontTypes = _iconfontTypes
      this.iconfontSize = _iconfont[1].includes('rpx') ? _iconfont[1] : (_iconfont[2].includes('rpx') ? _iconfont[2] : this.iconfontSize)
      this.iconfontColor = !_iconfont[1].includes('rpx') ? _iconfont[1] : (!_iconfontType ? (!_iconfont[2].includes('rpx') ? _iconfont[2] : this.iconfontColor) : 'none')
      this.textSize = _textList_three.includes('rpx') ? _textList_three : (_textList_four.includes('rpx') ? _textList_four : this.textSize)
      this.textColor = !_textList_three.includes('rpx') ? _textList_three : (!_textList_four.includes('rpx') ? _textList_four : this.textColor)
      // this.setData({
      //   iconfontType: _iconfontType,
      //   iconfontTypes: _iconfontTypes,
      //   iconfontSize: _iconfont[1].includes('rpx') ? _iconfont[1] : (_iconfont[2].includes('rpx') ? _iconfont[2] : this.iconfontSize),
      //   iconfontColor: !_iconfont[1].includes('rpx') ? _iconfont[1] : (!_iconfontType ? (!_iconfont[2].includes('rpx') ? _iconfont[2] : this.iconfontColor) : 'none'),
      //   textSize: _textList_three.includes('rpx') ? _textList_three : (_textList_four.includes('rpx') ? _textList_four : this.textSize),
      //   textColor: !_textList_three.includes('rpx') ? _textList_three : (!_textList_four.includes('rpx') ? _textList_four : this.textColor),
      // })
    },
    methods: {
      isIncludes (val, str) {
        return val.includes(str)
      }
    }
	}
</script>

<style scoped lang="stylus">
  @import '../../static/css/base.styl'
  .load-more
    .iconfont
      font-size 130rpx
      color $THEME_COLOR
    .p
      font-size 28rpx
    &.not
      background #fff
      border-radius 10rpx
      margin-top: 20rpx
</style>
<style scoped>
  @media screen and (min-width:750px) {
    .load-more .p{font-size: 20px;}
    .load-more .iconfont{font-size: 90px;}
    .load-more.not{border-radius: 10px;}
  }
</style>