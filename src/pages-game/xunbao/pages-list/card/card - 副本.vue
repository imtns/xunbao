<template>
  <view class="card">
    <view class="cardceng">
      <view class="award1" @click="fhui">
        <image :src="`${ASSETSURL}ad_18.png`"></image>
        <!-- <u-navbar class="custom-navbar" title=" " autoBack bgColor="transparent" height="88rpx" placeholder></u-navbar> -->
      </view>
      <view class="card1 oh">
        <view class="card11 le">
          <image :src="`${ASSETSURL}card/card1.png`"></image>
          <text>x{{ compositionCount }}</text>
        </view>
        <view class="card12 ri" @click="pai_h">
          <image :src="`${ASSETSURL}card/card2.png`"></image>
        </view>
      </view>
      <view class="card2 oh">
        <view class="card21 le" @click="syz">
          <image :src="`${ASSETSURL}card/card3.png`"></image>
        </view>
        <view class="card22 le">
          <u-swiper :autoplay="false" :current="current" :list="list3" height="337" style="width: 100%" @change="swiper"></u-swiper>
        </view>
        <view class="card23 ri" @click="xyz">
          <image :src="`${ASSETSURL}card/card4.png`"></image>
        </view>
      </view>
      <view class="card3">
        <view class="card31 tc" v-if="list[0].hqu > 0 && list[1].hqu > 0 && list[2].hqu > 0 && list[3].hqu > 0" @click="compound">
          <image :src="`${ASSETSURL}card/card61.png`"></image>
        </view>
        <view v-else>
          <view class="card31 tc" @click="compound1_sq">
            <image :src="`${ASSETSURL}card/card5.png`"></image>
          </view>

          <view class="card32"> (卡片数量不足，无法合成) </view>
        </view>
      </view>
      <view class="card4">
        <view class="card4ceng oh">
          <!-- <u-scroll-list indicatorActiveColor="#ffb300" indicator='false'> -->
          <view class="card41 le" v-for="(item, index) in list" :key="index">
            <view class="card411">
              <image :src="`${ASSETSURL}card/card6.png`"></image>
              <text>{{ item.id }}</text>
            </view>

            <view class="card412">
              <image :src="item.img"></image>
            </view>
            <view class="card413">
              <view class="mceng" v-show="item.hqu == 0"></view>
              <image :src="`${ASSETSURL}card/card8${index}.png`"></image>
            </view>
          </view>
          <!-- </u-scroll-list> -->
        </view>
      </view>

      <u-popup :show="show" mode="center" @close="close" @open="open">
        <view class="compound_ceng" v-show="compound1 == 1">
          <view class="compound1">
            <view class="compound11 tc">
              <image :src="`${ASSETSURL}card/compound1.png`" mode="widthFix"></image>
            </view>
            <view class="compound12 oh">
              <view class="compound121 le" @click="show = false">
                <image :src="`${ASSETSURL}card/compound2.png`"></image>
              </view>
              <view class="compound122 le">
                <image :src="`${ASSETSURL}card/compound3.png`"></image>
              </view>
            </view>
          </view>
        </view>

        <view class="compound_ceng" v-show="compound1 == 0">
          <view class="compound1">
            <view class="compound13 tc">
              <image :src="`${ASSETSURL}card/compound4.png`" mode="widthFix"></image>
            </view>
            <view class="compound14"> 恭喜你获得集卡奖励，集卡套数排行榜前3名即可获得最高奖励——<text>宝藏金条项链</text>，快去集卡合成冲榜吧！ </view>
            <view class="compound15" @click="show = false">
              <image :src="`${ASSETSURL}card/compound5.png`" mode="widthFix"></image>
            </view>
          </view>
        </view>

        <view class="compound_ceng" v-show="compound1 == 2">
          <view class="compound1">
            <view class="compound16" @click="show = false">
              <image :src="`${ASSETSURL}card/compound6.png`" mode="widthFix"></image>
            </view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import api from '@/pages-game/xunbao/api/api'
import tool from '@/pages-game/js/tool'
export default {
  data() {
    return {
      show: false,
      current: 1, //当前轮播图下标
      compound1: 2, //中奖012
      myCard: null,
      compositionCount: 0, //数量

      list: [
        {
          id: 0,
          type: 'qs_card', //qs_card 全身宝藏卡 yy_card 营养宝藏卡 xjb_card 性价比宝藏卡 bd_card 百搭宝藏卡
          hqu: 0, // 0未获得 1获得
          name: '全身宝藏卡',
          img: 'https://cdn.vrupup.com/s/116/ka_1.png'
        },
        {
          id: 0,
          type: 'yy_card',
          hqu: 0,
          name: '营养宝藏卡',
          img: 'https://cdn.vrupup.com/s/116/ka_2.png'
        },
        {
          id: 0,
          type: 'xjb_card',
          hqu: 0,
          name: '性价比宝藏卡',
          img: 'https://cdn.vrupup.com/s/116/ka_3.png'
        },
        {
          id: 0,
          type: 'bd_card',
          hqu: 0,
          name: '百搭宝藏卡',
          img: 'https://cdn.vrupup.com/s/116/ka_4.png'
        }
      ],
      list3: ['https://cdn.vrupup.com/s/116/ka_1.png', 'https://cdn.vrupup.com/s/116/ka_2.png', 'https://cdn.vrupup.com/s/116/ka_3.png', 'https://cdn.vrupup.com/s/116/ka_4.png']
    }
  },
  onShow() {
    this.htxb_myCard()
    // this.htxb_cardDetail()
  },
  methods: {
    compound1_sq() {
      this.show = true
      this.current = 2
    },
    compound() {
      api
        .mergeCard()
        .then((res) => {
          console.log(res.data, '合成')
          if (res.data.first) {
            this.show = true
            this.compound1 = 1
          } else {
            this.show = true
            this.compound1 = 0
          }
          this.htxb_myCard()
        })
        .catch((err) => {})
    },
    // 卡详情
    htxb_cardDetail() {
      api
        .htxb_cardDetail()
        .then((res) => {
          console.log(res.data, '卡详情')
        })
        .catch((err) => {})
    },
    // 查询我的卡片
    htxb_myCard() {
      api
        .htxb_myCard()
        .then((res) => {
          console.log(res.data, '查询我的卡片')
          // this.list = res.data.card
          // for (var i = 0; i < res.data.card.length; i++) {
          //qs_card 全身宝藏卡 yy_card 营养宝藏卡 xjb_card 性价比宝藏卡 bd_card 百搭宝藏卡
          // }
          if (res.data.card[0].cardCount > 0) {
            this.list[0].hqu = 1
          } else {
            this.list[0].hqu = 0
          }
          if (res.data.card[1].cardCount > 0) {
            this.list[1].hqu = 1
          } else {
            this.list[1].hqu = 0
          }
          if (res.data.card[2].cardCount > 0) {
            this.list[2].hqu = 1
          } else {
            this.list[2].hqu = 0
          }
          if (res.data.card[3].cardCount > 0) {
            this.list[3].hqu = 1
          } else {
            this.list[3].hqu = 0
          }
          this.list[0].id = res.data.card[0].cardCount
          this.list[1].id = res.data.card[1].cardCount
          this.list[2].id = res.data.card[2].cardCount
          this.list[3].id = res.data.card[3].cardCount

          this.compositionCount = res.data.compositionCount
        })
        .catch((err) => {})
    },
    pai_h() {
      tool.jump_nav('/xunbao/pages-list/ranking_list/ranking_list')
    },
    syz() {
      console.log(1)
      if (this.current == 3) {
        // this.current = 0
      } else {
        this.current = this.current + 1
      }
    },
    xyz() {
      console.log(1)
      if (this.current == 0) {
        // this.current = 3
      } else {
        this.current = this.current - 1
      }
    },
    swiper(e) {
      console.log(e.current)
      this.current = e.current
    },
    fhui() {
      tool.jump_back()
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  height: 100vh;
  padding-top: 0rpx;
  background: #fea500;

  .mceng {
    position: absolute;
    top: 30rpx;
    width: 144rpx;
    height: 214rpx;
    background: #000;
    opacity: 0.7;
  }

  .cardceng {
    height: 100vh;
    background: url('https://cdn.vrupup.com/s/116/card_bj1.jpg') no-repeat #fea500;
    background-size: 100% 1480rpx;

    .award1 {
      position: relative;

      image {
        position: absolute;
        top: 86rpx;
        left: 36rpx;
        width: 52rpx;
        height: 52rpx;
      }
    }

    .card1 {
      padding-top: 262rpx;

      .card11 {
        position: relative;

        text {
          position: absolute;
          top: -1rpx;
          left: 87rpx;
          color: #fff;
          font-weight: 800;
          font-size: 25rpx;
          font-family: 'Alibaba PuHuiTi';
          line-height: 81rpx;
          -webkit-text-stroke: 2rpx #fff;
          text-stroke: 2rpx #fff;
        }

        image {
          width: 131rpx;
          height: 64rpx;
        }
      }

      .card12 {
        image {
          width: 132rpx;
          height: 62rpx;
        }
      }
    }

    .card2 {
      padding: 35rpx 60rpx;

      .card21 {
        margin-top: 280rpx;

        image {
          width: 60rpx;
          height: 60rpx;
        }
      }

      .card22 {
        width: 451rpx;
        margin: 0 31rpx;

        image {
          width: 372rpx;
          height: 553rpx;
        }
      }

      .card23 {
        margin-top: 280rpx;

        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }

    .card3 {
      .card32 {
        color: #646158;
        font-weight: 500;
        font-size: 17rpx;
        font-family: 'Alibaba PuHuiTi';
        line-height: 29rpx;
        text-align: center;
      }

      image {
        width: 283rpx;
        height: 85rpx;
      }
    }

    .card4 {
      position: fixed;
      bottom: 0;
      width: 100vw;
      height: 395rpx;
      background: url('https://cdn.vrupup.com/s/116/card_bj1_1.png') no-repeat #fea500;
      background-size: 100% 100%;
      .card4ceng {
        position: fixed;
        bottom: 64rpx;
        left: 67rpx;

        .card41:nth-child(4n) {
          // margin-right: 0rpx;
        }

        .card41 {
          position: relative;
          margin-right: 17rpx;

          .card411 {
            position: relative;
            top: 26rpx;
            left: 122rpx;
            z-index: 999;

            text {
              position: absolute;
              top: 1rpx;
              left: 0;
              z-index: 999;
              width: 30rpx;
              height: 30rpx;
              color: #080808;
              font-weight: 500;
              font-size: 18rpx;
              font-family: 'Alibaba PuHuiTi';
              line-height: 30rpx;
              text-align: center;
              background: #fea500;
              border-radius: 120rpx;
            }

            image {
              width: 28.5rpx;
              height: 28.5rpx;
            }
          }

          .card412 {
            image {
              width: 144rpx;
              height: 214rpx;
            }
          }

          .card413 {
            margin-top: 8rpx;
            text-align: center;

            image {
              width: 121rpx;
              height: 32rpx;
            }
          }
        }
      }
    }
  }
}
.compound_ceng {
  .compound1 {
    position: relative;
    .compound11 {
      image {
        width: 450rpx;
      }
    }

    .compound12 {
      .compound121 {
        image {
          width: 273rpx;
          height: 94rpx;
        }
      }
      .compound122 {
        margin-left: 20rpx;
        image {
          width: 273rpx;
          height: 94rpx;
        }
      }
    }
    .compound13 {
      image {
        width: 578rpx;
        height: 758rpx;
      }
    }
    .compound14 {
      position: absolute;
      top: 311rpx;
      left: 94rpx;
      width: 388rpx;
      height: 181rpx;
      color: #000;
      font-weight: 500;
      font-size: 29rpx;
      font-family: 'Alibaba PuHuiTi';
      line-height: 45rpx;
      text {
        color: #fa7700;
      }
    }
    .compound15 {
      position: absolute;
      top: 551rpx;
      left: 144rpx;
      text-align: center;
      image {
        width: 273rpx;
        height: 94rpx;
      }
    }
    .compound16 {
      image {
        width: 442rpx;
        height: 232rpx;
      }
    }
  }
}
</style>
<style>
.u-popup__content {
  background: none;
}

.u-popup__content {
  background: none !important;
}
</style>
