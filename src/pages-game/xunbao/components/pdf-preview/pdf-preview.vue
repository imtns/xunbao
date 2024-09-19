<template>
  <div class="pdf-preview">
    <!-- 插件查看区域 -->
    <div class="pdf-wrap" :class="{ 'on': types == 2 }">
      <!-- :style="scaleFun"  -->
      <vue-pdf-embed v-if="pdfUrl" :source="pdfUrl" class="vue-pdf-embed" :scale="scale"
        :page="types == 1 ? 0 : pageNum" @loaded="loaded" @progress="progress" />
    </div>
    <!-- 图片查看区域 -->
    <div class="pdf-view">
      <img v-for="(item, index) in pdfImgList" :key="index" :src="item" alt="">
    </div>
    <!-- 控制栏 -->
    <!-- <div class="controls">
      <div class="page-tool-item" @click="lastPage">上一页</div>
      <div class="page-tool-item" @click="nextPage">下一页</div>
      <div class="page-tool-item">{{ pageNum }}/{{ numPages }}</div>
      <div class="page-tool-item" @click="pageZoomOut">放大</div>
      <div class="page-tool-item" @click="pageZoomIn">缩小</div>
    </div> -->
  </div>
</template>
<script>
// import { reactive, onMounted, toRefs, watch, computed, inject } from "vue";
import * as tool from 'static/js/tool'
import Pdf from 'vue-pdf'
console.log("PdfPdfPdf", Pdf)
// import VuePdfEmbed from "vue-pdf-embed";
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
console.log('VuePdfEmbed', VuePdfEmbed)
export default {
  name: "HomeView",
  props: {
    //pdf文件地址
    pdfUrl: {
      type: String,
      required: true
    }
  },
  components: {
    VuePdfEmbed
  },
  mounted() {
    this.pdfPreviewInit(this.pdfUrl)
  },
  data() {
    return {
      types: 1,//模式，1为画布模式，2为图片模式
      pdfImgList: [],//pdf生成的图片集合
      // pdfUrl: 'https://img.vrupup.com/clue/202211/21_1669011974637b1a0620e0f.pdf',// 预览pdf文件地址
      pageNum: 1,// 当前页面
      scale: 1.5, // 缩放比例
      numPages: 0, // 总页数
      isLoadedOk: false,//是否加载完成
      loadingInitNum: 0,//获取总页码和加载完成进度，为2时代表都已完成，方向进行回调
    }
  },
  methods: {
    //pdf查看器初始化,获取总页码
    pdfPreviewInit(pdfUrl) {
      this.pdfUrl = pdfUrl
      let loadingTask = Pdf.createLoadingTask(this.pdfUrl)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages || pdf._pdfinfo.numPages
        // console.log("【总页码】", this.numPages)
        this.loadingInitNum++
      }).catch(err => {
        console.error('pdf 加载失败', err);
      })
    },
    //加载完成
    loaded() {
      tool.loading_h()
      if (this.types == 1) {
        this.loadingInitNum++
        console.log("【canvas模式加载完成】")
      }
    },
    //加载进度
    progress(e) {
      // console.log("progress", e)
      // console.log("progress", parseInt(e.loaded * 100 / e.total))
      if (this.types == 1) tool.loading(`加载中${parseInt(e.loaded * 100 / e.total)}%`)
      if (parseInt(e.loaded * 100 / e.total) == 100) {
        if (!this.isLoadedOk && this.types == 2) {
          this.isLoadedOk = true
          setTimeout(() => { this.autoPdfToImgList() }, 500)
          // setTimeout(() => { this.autoPdfToImgList() }, 800)
        }
      }
    },
    //上一页
    lastPage() {
      if (this.pageNum > 1) {
        --this.pageNum
      }
    },
    //下一页
    nextPage() {
      // console.log("下一页", this.pageNum)
      // let _canvas = document.querySelector('.pdf-wrap canvas'), _num = 1
      // console.log('_canvas', _canvas)
      if (this.pageNum < this.numPages) {
        ++this.pageNum
        if (this.numPages) tool.loading(`加载中${parseInt(this.pageNum * 100 / this.numPages)}%`)
        setTimeout(() => { this.autoPdfToImgList() }, 800)
      } else {
        this.loadingInitNum++
        tool.loading_h()
        console.log('【图片模式加载完成】')
      }
    },
    //pdf转图片
    autoPdfToImgList() {
      let _this = this
      function nextToImg() {
        let _canvas = document.querySelector('.pdf-wrap canvas')
        // if (!_canvas) setTimeout(() => { nextToImg() }, 50)
        // console.log('_canvas', _canvas)
        let _img = _canvas.toDataURL("image/png")
        // console.log('_img', _this.pageNum, _img.slice(0, 20))
        _this.pdfImgList.push(_img)
        _this.nextPage()
        // setTimeout(() => {
        //     this.nextPage()
        //   }, 3000)
        return
        if (this.pageNum < this.numPages) {
          console.log("【this.pageNum】", this.pageNum)
          setTimeout(() => {
            this.pageNum += 1
            // setTimeout(() => { nextToImg() }, 1000)
          }, 3000)
        } else {
          console.log("加载完成")
        }
      }
      nextToImg()
    },
    pageZoomOut() {
      if (this.scale < 2) {
        this.scale += 0.1
      }
    },
    pageZoomIn() {
      if (this.scale > 1) {
        this.scale -= 0.1
      }
    }
  },
  watch: {
    'loadingInitNum': {
      handler(newValue, oldValue) {
        if (newValue == 2) this.$emit('pdfLoadedOk', { pdfTotalNum: this.numPages })
      }
    }
  }
};
</script>
<style scoped>
.pdf-preview {
  position: relative;
  /* height: 100vh; */
  box-sizing: border-box;
  background-color: e9e9e9;
}

/* .pdf-wrap {
  overflow-y: auto;
} */

.vue-pdf-embed {
  text-align: center;
  width: 100%;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  box-sizing: border-box;
}

.page-tool {
  position: absolute;
  bottom: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  background: rgb(66, 66, 66);
  color: white;
  border-radius: 19px;
  z-index: 100;
  cursor: pointer;
  margin-left: 50%;
  transform: translateX(-50%);
}

.page-tool-item {
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
}

.pdf-wrap.on {
  position: fixed;
  left: 100%;
  top: 0;
}</style>