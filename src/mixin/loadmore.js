export default {
  data() {
    return {
      params: {
        page: 1,
        limit: 1000
      },
      list: [],
      totalCount: 0,
      finish: false,
      loadmore: false
    }
  },
  methods: {
    getWorksVote() {
      // 获取列表

      this.api(Object.assign(this.params, { [this.searchKey]: this.search })).then((result) => {
        setTimeout(() => {
          this.list = [...this.list, ...result.list]
          if (this.params.page === 1) {
            this.totalCount = result.totalCount
          }
          this.loading = false
          this.finish = this.totalCount === this.list.length

          this.loadmore = false
          uni.hideLoading()
        }, 200)
      })
    }
  },
  onReachBottom() {
    console.log('reach-bottom::::::')
    if (this.finish || this.loadmore) return
    this.params.page = this.params.page + 1
    this.loadmore = true
    this.getWorksVote()
  }
}
