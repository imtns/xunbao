<!--上滑加载更多-->
<template>
  <view style="width: 100%">
    <x-spin v-if="loading"></x-spin>

    <scroll-view :show-scrollbar="false" :scroll-top="scrollTop" class="load-more" :enable-back-to-top="true" :scroll-y="true" @scrolltolower="bindScrollToLower">
      <!--顶部插槽-->
      <slot name="top" :list="searchList"></slot>

      <!-- 内容区 -->
      <view class="list-area">
        <!-- 内容 -->
        <slot name="list"  />

        <!-- loading -->
        <!-- 加载更多 -->
        <view v-if="searchLoading" class="no-data">正在加载更多...</view>
        <!--空状态-->
        <template v-if="!searchLoading && !loading">
          <div v-if="!searchList.length" class="list-status">
            <slot name="empty">
              <image class="list-empty" :style="{ width: empty.width, height: empty.height }" :src="empty.icon || 'https://udstatic.imeik.com/pcUploads/1676888946096/icon_zanwuneirong%402x.png'">
              </image>
              <view class="no-data">{{ empty.text || '暂无数据～' }}</view>
            </slot>
          </div>
          <view v-else class="no-data no-more">- 到底了 -</view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'LoadMore',
  components: {},
  props: {
    // 初始值
    api: {
      type: Function,
      default: () => {}
    },
    // 接口请求参数
    params: {
      type: Object,
      default: () => {}
    },
    // 空状态
    empty: {
      type: Object,
      default: () => ({
        icon: '',
        text: '暂无数据～'
      })
    }
  },
  data() {
    return {
      scrollTop: 0,
      searchList: [],
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      searchLoading: false,
      dynamicApi: null
    }
  },
  methods: {
    // 更新列表
    freshList(dapi, callBack, bloon) {
      // 可以在此方法里手动传入api，因为如果父组件里的api变化后，该组件里不能跟着变，不知道为啥
      if (dapi) {
        this.dynamicApi = dapi
      }
      this.loading = bloon
      this.page = 1
      this.searchList = []
      this.scrollTop = 0

      this.getList(callBack)
    },

    // 加载分页
    bindScrollToLower() {
      if (this.searchList.length < this.total) {
        this.searchLoading = true
        this.page++

        this.getList()
      } else {
        this.searchLoading = false
      }
    },

    // 获取列表
    getList(callBack) {
      const params = {
        page: this.page,
        limit: this.limit
      }

      // loading
      if (this.page === 1) {
        this.loading = true
      } else {
        this.searchLoading = true
      }

      ;(this.dynamicApi || this.api)(Object.assign(this.params, params))
        .then((res) => {
          const org = this.page === 1 ? [] : [...this.searchList]
          this.searchList = [...org, ...(res.list ? res.list : res || [])]
          this.total = res.totalCount
          this.searchLoading = false
          this.loading = false
          console.log('hahahahahahaha')
          this.$emit('arr', this.searchList)
          // 曝光
          this.$nextTick(() => {
            this.initExport()
          })
          callBack && callBack()
        })
        .catch(() => {
          this.loading = false
          this.searchLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.load-more {
  box-sizing: border-box;
  height: 100%;

  .list-area {
    height: 100%;

    .list-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #fff;

      image {
        width: 312rpx;
        height: 240rpx;
      }
    }

    .no-data {
      padding: 24rpx 24rpx 0;
      color: rgba(0, 0, 0, 45%);
      font-weight: 400;
      font-size: 28rpx;
      line-height: 40rpx;
    }

    .no-more {
      padding-bottom: 24rpx;
      text-align: center;
    }
  }
}
</style>
