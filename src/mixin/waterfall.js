export default {
  data() {
    return {
      imageProperty: 'coverImage',
      loading: true,
      leftColumnItems: [],
      rightColumnItems: [],
      columnHeights: [0, 0]
    }
  },
  props: {
    // 瀑布流列表
    list: {
      type: Array,
      require: true
    }
  },
  watch: {
    list: {
      handler(v) {
        if (v.length) {
          this.initializeLists()
        } else {
          this.loading = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async initializeLists() {
      this.loading = true
      this.leftColumnItems = []
      this.rightColumnItems = []
      this.columnHeights = [0, 0]
      const data = this.list
      const heightPromises = data.map((item) => {
        return this.loadImage(item[this.imageProperty])
          .then((info) => {
            item.title = item.title || item.contentTitle
            const titleHeight = item.title?.length >= 12 ? 60 : 42
            item.height = Math.round((180 / info.ImageWidth.value) * info.ImageHeight.value) + titleHeight

            return item
          })
          .catch(() => {
            item.height = 200
            return item
          })
      })
      // 等待所有图片高度加载完成
      const itemsWithHeight = await Promise.allSettled(heightPromises)
      itemsWithHeight.forEach((item, idx) => this.addToColumn(item.value, idx))
      setTimeout(() => {
        this.loading = false
      }, 100)
    },
    addToColumn(item, idx) {
      //   console.warn('this.columnHeights[0]', this.columnHeights[0])
      //   console.warn('this.columnHeights[1]', this.columnHeights[1])
      const targetColumn = Math.round(this.columnHeights[0]) <= Math.round(this.columnHeights[1]) ? 0 : 1
      //   console.warn(`第${idx + 1}个图片高度`, item.height, item.title)
      if (targetColumn === 0) {
        this.leftColumnItems.push(item)
        this.columnHeights[0] += item.height
      } else {
        this.rightColumnItems.push(item)
        this.columnHeights[1] += item.height
      }
    },

    loadImage(cover) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${cover}?x-oss-process=image/info`,
          success({ data }) {
            resolve(data)
          },
          fail() {
            reject()
          }
        })
      })
    }
  }
}
