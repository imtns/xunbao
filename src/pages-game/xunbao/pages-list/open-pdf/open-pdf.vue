<template>
  <div class="body">
    <!-- <my-header :title="pageTitle"></my-header> -->
    <!-- pdf查看组件 -->
    <div class="pdf-preview-box">
      <!-- <pdf-preview :pdfUrl="pdfUrl" @pdfLoadedOk="pdfLoadedOk"></pdf-preview> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import MyHeader from "components/header.vue"
// import PdfPreview from "base/PdfPreview.vue"
export default {
  name: "",
  data() {
    return {
      pageTitle: "预览pdf文件",//页面标题
      // pdfUrl: 'https://wlmvp-cos.weiling.cn/1/16686975767HszMhD.pdf'
      // pdfUrl: 'https://img.vrupup.com/web/szq/images/pdf_08.pdf'
      pdfUrl: 'https://img.flyh5.cn/java/image/1687792061781.pdf'
    }
  },
  mounted() {
    document.getElementsByTagName('body')[0].style.overflow = 'auto'
  },
  methods: {
    //子组件回调-pdf加载完成
    pdfLoadedOk({ pdfTotalNum }) {
      console.log("【组件回调--pdf组件--总页码】", pdfTotalNum)
    }
  },
  components: {
    // MyHeader,
    // PdfPreview
  }
}
</script>

<style scoped>

</style>