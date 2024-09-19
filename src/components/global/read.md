由于uni-app里，逻辑层和渲染层是分开的，所以APP.vue里面不能写template（https://uniapp.dcloud.io/collocation/App.html#applifecycle）

这就导致了一个问题，就没法写全局的组件，比如登录弹框，这就很难受了，不过好在有解决方案：https://ask.dcloud.net.cn/article/id-39345

所以遵照开发规范，以后有全局的组件，就可以在这里放在这里（记得在page.json里面的insetLoader的config里面加配置）

详细步骤请移步： http://10.0.1.106:8090/pages/viewpage.action?pageId=328001