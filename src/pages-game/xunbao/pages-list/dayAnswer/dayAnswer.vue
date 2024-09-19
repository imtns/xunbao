<template>
  <view class="page" :style="{ 'background-image': `url(${ASSETSURL}bg.png)` }" @click="showPrize = false">
    <!-- <u-navbar title=" " @leftClick="leftClick" leftIconSize="54rpx" :leftIcon="ASSETSURL + 'ad_18.png'" :fixed="false" bgColor="transparent"></u-navbar> -->
    <view class="index" :style="{ 'background-image': `url(${ASSETSURL}dayAnswer/bg.png)` }">
      <view class="title">
        {{ detail.subject }}
      </view>
      <block v-for="(item, index) in detail.optionJson" :key="index">
        <!-- @click="cur = index" -->
        <view class="add_cur0" :class="{ add_cur1: dq_cw == 2 || dq_cw == 1 }">
          <view class="option" @click="index_cur(index)" :class="{ cur: cur == index }">
            {{ item }}
            <image class="star" :src="`${ASSETSURL}dayAnswer/0.png`" mode="widthFix"></image>
            <image class="optionImg" :src="`${ASSETSURL}dayAnswer/${index + 1}.png`" mode="widthFix"> </image>
            <image class="star add1" :src="`${ASSETSURL}dayAnswer/dd.png`" mode="widthFix" v-if="dq_zq == index"></image>
            <image class="star add2" :src="`${ASSETSURL}dayAnswer/cc.png`" mode="widthFix" v-else></image>
            <!-- v-show="dq_cw == 2" -->
          </view>
        </view>
      </block>
      <image :src="`${ASSETSURL}dayAnswer/confirm.png`" @click="sub" class="confirm" mode="widthFix"></image>
    </view>
    <u-popup :show="show" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" @click="show = false">
      <view class="flex-cen-col">
        <image :src="`${ASSETSURL}dayAnswer/error.png`" class="error" mode="widthFix"></image>
        <image :src="`${ASSETSURL}dayAnswer/cancel.png`" @click="fhui" class="cancel"></image>
      </view>
    </u-popup>
    <dy-prize ref="dyPrize2" :show="showPrize" :item="prizeDetail" @close="showPrize = false"></dy-prize>
  </view>
</template>

<script>
import api from '@/pages-game/xunbao/api/api.js'
import tool from '@/pages-game/xunbao/js/tool.js'
import dyPrize from '@/pages-game/xunbao/components/dy-prize.vue'
export default {
  components: {
    dyPrize
  },
  data() {
    return {
      show: false,
      detail: '', //答题详情
      showPrize: false,
      prizeDetail: {}, //奖品详情
      cur: null,
      dq_cw: null, //当前是否错误2错误1正确
      dq_zq: null //当前正确daan
    }
  },
  onLoad() {
    this.getqueryQuestion()
  },
  methods: {
    index_cur(e) {
      if (this.dq_cw == 1 || this.dq_cw == 2) return tool.alert('已答题 请勿重复答题')
      this.cur = e
    },
    fhui() {
      this.show = false
    },
    // 提交答案
    async sub() {
      if (this.dq_cw == 1 || this.dq_cw == 2) return tool.alert('已答题 请勿重复答题')
      let answer = this.detail.optionJson[this.cur]
      console.log(answer, 'answer')
      if (!answer) return tool.alert('请选择答案')
      if (this.detail.answer && this.detail.answer != answer) {
        this.show = true
        return
      }
      let dataJson = {
        questionCode: this.detail.questionCode,
        answer: answer
      }
      let { code, data, msg } = await api.submitQuestion({
        ...dataJson
      })
      this.dq_cw = 1
      for (var i = 0; i < this.detail.optionJson.length; i++) {
        console.log(data, this.detail.optionJson[i], data.correctAnswern, this.cur, 'data56')
        if (data.answerResult == 'success') {
          console.log(i, '777')
          this.dq_zq = this.cur
          // someClickEvent() 全局埋点
        } else if (data.answerResult == 'fail' && this.detail.optionJson[i] == data.correctAnswer) {
          this.dq_zq = i
        }
      }
      if (data.answerResult == 'fail') {
        this.show = true
        this.dq_cw = 2
        return
      } else if (data.prizeType == 'jiangli') {
        tool.jump_nav('/pages-game/xunbao/pages-list/advertising/advertising')
        return
      } else {
      }
      this.prizeDetail = data
      if (res1.data.prizeType == 'kapian') {
        // someClickEvent()  全局埋点
      }
      this.showPrize = true
      this.$nextTick(() => {
        this.$refs.dyPrize2.play2()
      })
    },
    // 获取题目
    async getqueryQuestion() {
      let { code, data, msg } = await api.queryQuestion()
      if (code != 200) return tool.alert(msg)
      this.detail = JSON.parse(data)
    }
  }
}
</script>

<style lang="scss">
.add_cur0 {
  .add2 {
    opacity: 0;
  }

  .add1 {
    opacity: 0;
  }
}

.add_cur1 {
  .add1 {
    opacity: 1;
    width: 57rpx !important;
    height: 41rpx !important;
    top: 42rpx !important;
    left: 399rpx !important;
  }

  .add2 {
    opacity: 1 !important;
    width: 41rpx !important;
    height: 41rpx !important;
    top: 43rpx !important;
    left: 415rpx !important;
  }

  .cur {
    .add2 {
      opacity: 1 !important;
      width: 41rpx !important;
      height: 41rpx !important;
      top: 43rpx !important;
      left: 415rpx !important;
    }

    background-color: #ffb300;

    .add1 {
      width: 57rpx;
      height: 41rpx;
      top: 42rpx;
      left: 399rpx;
    }
  }
}

.index {
  width: 712rpx;
  height: 1065rpx;
  background-size: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-repeat: no-repeat;
  z-index: 1;
  padding: 187rpx 80rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-weight: 600;
    font-size: 28rpx;
    color: #000000;
    line-height: 48rpx;
    letter-spacing: 1rpx;
    margin-bottom: 20rpx;
  }

  .option {
    width: 445rpx;
    height: 78rpx;
    line-height: 74rpx;
    text-align: center;
    background-color: #ffe3a0;
    border: 1rpx solid #000;
    border-radius: 60rpx;
    position: relative;
    margin: 24rpx 0 0;
    font-weight: 500;
    font-size: 26rpx;
    color: #000000;

    .star {
      width: 26rpx;
      height: 22rpx;
      background-size: 100%;
      position: absolute;
      top: -12rpx;
      left: 30rpx;
      z-index: 2;
    }

    .optionImg {
      width: 50rpx;
      height: 48rpx;
      background-size: 100%;
      position: absolute;
      top: 50%;
      left: -16rpx;
      transform: translateY(-50%);
      z-index: 2;
    }
  }

  .confirm {
    width: 284rpx;
    height: 86rpx;
    margin-top: 70rpx;
    position: fixed;
    bottom: 110rpx;
  }

  .cur {
    background-color: #ffb300;
    // .add1{
    // 	opacity: 1;
    // 	width: 57rpx;
    // 	height: 41rpx;
    // 	    top: 42rpx;
    // 	    left: 399rpx;
    // }
    // .add2{
    // 	opacity: 1;
    // 	width: 41rpx;
    // 	height: 41rpx;
    // 	    top: 43rpx;
    // 	    left: 415rpx;
    // }
  }
}

.error {
  width: 442rpx;
  height: 232rpx;
}

.cancel {
  width: 283rpx;
  height: 85rpx;
  margin-top: 124rpx;
}
</style>
