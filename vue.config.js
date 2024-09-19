const path = require('path')
const webpack = require('webpack')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 获取命令行参数 http://nodejs.cn/api/process.html#process_process_argv
const argv = process.argv
const isReport = argv.includes('--report')

module.exports = {
  //   transpileDependencies: ['uview-ui'],
  css: {
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/static/assets/styles/variable.scss";
        @import "@/static/assets/styles/init.scss";
        @import "@/static/assets/styles/mixins.scss";
        @import "@/static/assets/styles/theme.scss";
        `
      }
    }
  },
  configureWebpack: (config) => {
    const plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"' + process.env.NODE_ENV + '"',
          SMS4_IV: '"' + process.env.SMS4_IV + '"',
          SMS4_KEY: '"' + process.env.SMS4_KEY + '"'
        }
      }),
      // 解决momentjs打包时把所有的语言都打进去导致包过大的问题
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn)$/),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // stylelint 校验
      new StyleLintPlugin({
        files: ['src/**/*.{vue,css,sass,scss}'],
        fix: true, // 是否自动修复，自动修复并不能修复全部问题，所以前期建议设置成false，自己手动解决
        cache: true
      })
    ]
    // webpack-bundle-analyzer
    if (isReport) {
      plugins.push(new BundleAnalyzerPlugin())
    }

    return {
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: {
              // loader: "vue-inset-loader"
              loader: path.resolve(__dirname, './node_modules/vue-inset-loader')
            }
          }
        ]
      },
      plugins: plugins
    }
  }
}
