<template>
  <view>
    <u-popup :show="show" @click="close" mode="center" :safeAreaInsetBottom="false" bgColor="transparent" @close="close" :overlayOpacity="0.8" :closeOnClickOverlay="true">
      <view class="prizeBox">
        <!-- kong -->
        <view class="noPrize" v-if="item.prizeType == 'kong' && seus == 1" style="margin-right: 40rpx; margin-top: -200rpx">
          <u-image :src="ASSETSURL + 'img/nothing.png'" width="459rpx" height="437rpx"></u-image>
          <view class="nothingText">
            {{ getRandomSentence() }}
          </view>
        </view>
        <!-- 没有奖品 -->
        <view class="noPrize" v-else-if="item.prizeType == 'kong'">
          <u-image :src="ASSETSURL + 'noPrize.png'" width="540rpx" height="674rpx"></u-image>
          <view class="close" @click="close">
            <u-icon :name="ASSETSURL + 'close.png'" color="#fff" size="60rpx"></u-icon>
          </view>
        </view>

        <!-- 卡片奖品 -->
        <view class="cardPrize flex-cen-col" v-else-if="item.prizeType == 'kapian'">
          <view class="back" @click="close" style="opacity: 0">
            <u-icon :name="ASSETSURL + 'ad_18.png'" color="#fff" size="54rpx"></u-icon>
          </view>
          <view class="title">
            获得
            <text v-if="item.card.cardType == 'qs_card'">全身宝藏</text>
            <text v-if="item.card.cardType == 'yy_card'">营养宝藏卡</text>
            <text v-if="item.card.cardType == 'xjb_card'">性价比宝藏卡</text>
            <text v-if="item.card.cardType == 'bd_card'">百搭宝藏卡</text>
            卡片
            <text>x1</text>
          </view>
          <!-- 卡片翻转动画 -->
          <view class="bgGx" v-if="bgGxShow">
            <sequenceEffect ref="bgGx" :sequenceList="bgGx2"></sequenceEffect>
          </view>
          <view class="fect" style="width: 474rpx; height: 702rpx; z-index: -1" v-show="item.card.cardType == 'bd_card'">
            <!-- <sequenceEffect ref="showfect1" :sequenceList="starList" @loadOk="loadOk('showfect1')">
						</sequenceEffect> -->
            <card-flip ref="showfect1" :option="starList"></card-flip>
          </view>
          <view class="fect" style="width: 474rpx; height: 702rpx; z-index: -1" v-show="item.card.cardType == 'qs_card'">
            <card-flip ref="showfect2" :option="starList2"></card-flip>
          </view>
          <view class="fect" style="width: 474rpx; height: 702rpx; z-index: -1" v-show="item.card.cardType == 'yy_card'">
            <card-flip ref="showfect3" :option="starList3"></card-flip>
          </view>
          <view class="fect" style="width: 474rpx; height: 702rpx; z-index: -1" v-show="item.card.cardType == 'xjb_card'">
            <card-flip ref="showfect4" :option="starList4"></card-flip>
          </view>
          <view class="btnBox flex-bet">
            <!-- 再来一次 -->
            <image v-if="(item.canTimes && item.canTimes > 0) || itemcard" :src="ASSETSURL + 'img/zlyc.png'" @click="getZlyq"> </image>
            <image v-else :src="ASSETSURL + 'back.png'" @click="back"></image>
            <button type="primary" open-type="share" @click="getShare" style="background: none; border: none; border-radius: 0; line-height: 0">
              <image :src="ASSETSURL + 'share.png'"></image>
            </button>
          </view>
        </view>
        <!-- 实物奖品  惊喜掉落 -->
        <view class="flex-cen-col" v-else-if="item.prizeType == 'jiangli'">
          <view class="bgGx">
            <sequenceEffect ref="bgGx" :sequenceList="bgGx2"></sequenceEffect>
          </view>
          <image class="img" :src="ASSETSURL + 'img/diaoLuoJiangLI.png'" mode="aspectFit"></image>
          <view class="xcolone" @click="close">
            <image :src="ASSETSURL + 'img/Xclone.png'"></image>
          </view>
        </view>
        <!-- 实物奖品  宝藏大奖 -->
        <!-- <view class="flex-cen-col" v-else-if="item.prizeType == 'kapian'">
					<u-image :src="ASSETSURL + 'prizeTitle.png'" width="425rpx" height="103rpx"></u-image>
					<image :src="item.prizeImage" class="prizeImg"></image>
					<view class="btnBox flex-bet" style="margin-top: -60rpx;">
						<image :src="ASSETSURL + 'share.png'"></image>
						<image :src="ASSETSURL + 'back.png'" @click="back"></image>
					</view>
				</view> -->
      </view>
    </u-popup>
  </view>
</template>

<script>
import api from '@/pages-game/xunbao/api/api'
import cardFlip from '@/pages-game/xunbao/components/card-flip/card-flip.vue'
export default {
  name: 'dy-prize',
  components: {
    cardFlip
  },
  props: {
    seus: {
      String,
      default: null
    },
    // 奖品类型 0 没有奖品  1 卡片 2 留资
    show: {
      type: [Object, Boolean],
      default: false
    },
    item: {
      type: [Object, Boolean],
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      bgGxShow: false,
      starList: {
        imgList: ['https://img.vrupup.com/s/116/img/zpc1.png', 'https://img.vrupup.com/s/116/img/bd1.png'], //正反图片
        speed: 1, //翻转速率，单位：s
        borderRadius: 20, //卡牌圆角，单位：rpx
        direction: 1 //翻转方向，1：正翻，2：反翻
      },
      starList2: {
        imgList: ['https://img.vrupup.com/s/116/img/zpc1.png', 'https://img.vrupup.com/s/116/img/qs.png'], //正反图片
        speed: 1, //翻转速率，单位：s
        borderRadius: 20, //卡牌圆角，单位：rpx
        direction: 1 //翻转方向，1：正翻，2：反翻
      },
      starList3: {
        imgList: ['https://img.vrupup.com/s/116/img/zpc1.png', 'https://img.vrupup.com/s/116/img/xjb.png'], //正反图片
        speed: 1, //翻转速率，单位：s
        borderRadius: 20, //卡牌圆角，单位：rpx
        direction: 1 //翻转方向，1：正翻，2：反翻
      },
      starList4: {
        imgList: ['https://img.vrupup.com/s/116/img/zpc1.png', 'https://img.vrupup.com/s/116/img/yy.png'], //正反图片
        speed: 1, //翻转速率，单位：s
        borderRadius: 20, //卡牌圆角，单位：rpx
        direction: 1 //翻转方向，1：正翻，2：反翻
      },
      bgGx2: {
        url: `https://cdn.vrupup.com/s/116/bgGx/1.png`,
        num: 60,
        initIndex: 1,
        speed: 68,
        loop: true,
        autoplay: true
      },
      _kpTypeIndex: null //翻牌索引
    }
  },
  methods: {
    //随机出现一句话
    getRandomSentence() {
      const sentences = [
        '嗨体滋养，满满能量',
        '完美搭配，效果翻倍',
        '一起嗨体，全身活力',
        '嗨体一下，活力高效',
        '嗨体——真皮层宝藏',
        '肌肤营养靠嗨体',
        '全身活力、全身能量',
        '肌肤活力选嗨体',
        '嗨体滋养，满满能量',
        '嗨体，赶走肌肤焦虑',
        '活力全开靠嗨体',
        '我们都是嗨星人'
      ]
      const randomIndex = Math.floor(Math.random() * sentences.length)
      return sentences[randomIndex]
    },
    loadOk(e) {
      this.bgGxShow = true
      console.log(e, '--------')
      // setTimeout(() => {
      // 	this.$refs[e].play(15).then(() => {
      // 		console.log('序列完成----');
      // 	})
      // })
    },
    //播放
    play2() {
      this.bgGxShow = true
      let _kpType = ['', 'bd_card', 'qs_card', 'yy_card', 'xjb_card']
      this._kpTypeIndex = _kpType.findIndex((item) => item == this.item.card.cardType)
      setTimeout(() => {
        this.$refs[`showfect${this._kpTypeIndex}`].play()
        this.share()
      }, 300)
    },

    getbgGx() {
      console.log('序列完成getbgGx')
      this.$refs.bgGx.play()
    },
    //分享喜悦
    share() {
      api.shareActivity().then((res) => {
        if (res.code == 200) {
          this.$store.commit('storeShareCode', res.data.shareCode)
          console.log(this.$store.state.shareCode, '-------shareCode-------')
        }
      })
    },
    //分享 埋点
    getShare() {
      // someClickEvent()  全局埋点
    },
    back() {
      console.log('fhui')
      if (this.item.card) {
        this.item.card.cardType = -1
      }
      this.resetKpType()
      this.$emit('close')
      uni.navigateBack()
    },
    close() {
      // this.show = false
      if (this.item.card) {
        this.item.card.cardType = -1
      }
      this.resetKpType()
      this.$emit('close')
    },
    //在来一次
    getZlyq() {
      this.resetKpType()
      this.$emit('getZlyq')
    },
    //重置翻牌
    resetKpType() {
      if (this.$refs[`showfect${this._kpTypeIndex}`]) {
        this.$refs[`showfect${this._kpTypeIndex}`].reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fect ::v-deep .currency {
  top: 54% !important;
}

.bgGx {
  z-index: -1;
}

.noPrize {
  position: relative;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }

  .nothingText {
    position: absolute;
    left: 0%;
    top: 0%;
    font-size: 32rpx;
    font-weight: 700;
    padding: 265rpx 50rpx 100rpx 89rpx;
    text-align: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}

.cardPrize {
  width: 100vw;
  height: 100vh;
  margin-top: -60rpx;
  position: relative;

  .back {
    position: absolute;
    top: 60rpx;
    left: 34rpx;
  }

  .title {
    font-weight: bold;
    font-size: 38rpx;
    color: #ffffff;
    // margin-bottom: 28rpx;
    position: absolute;
    top: 16%;

    text {
      color: #fa7700;
    }
  }

  .star {
    width: 750rpx;
    height: 953rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
}

.flex-cen-col {
  width: 100vw;
  height: 100vh;
  position: relative;

  .bgGx {
    z-index: -1;
  }

  .img {
    width: 70%;
    height: 100%;
  }

  .xcolone {
    position: absolute;
    top: 15%;
    right: 15%;
    width: 60rpx;
    height: 60rpx;
    z-index: 6666;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.btnBox {
  width: 590rpx;
  margin-top: 50rpx;

  image {
    width: 273rpx;

    height: 94rpx;
  }
}

.prizeImg {
  width: 750rpx;
  height: 837rpx;
}
</style>
