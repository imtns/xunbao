// 参照 https://ext.dcloud.net.cn/plugin?id=4443#detail

/**
 * 需求场景：业务里有些页面依赖于某些接口返回的数据，比如数据字典：dictionaryTree
 * 方案分析：按照以往vue项目的经验，我们要么：一、会在App.vue的created钩子函数中加上同步请求，等接口返回后再渲染页面；要么：二、会用vuex，然后在页面里用computed计算属性；
 * 现状分析：对于上述中的方案一，查了uni-app的文档，发现其App.vue里的onLaunched钩子并不支持同步，遂放弃一
 *         对于上述中的方案二，可以使用，但是需要在使用到的页面里都用computed属性，并且有种场景得额外处理：
 *             （获取课程列表，需要给接口传个默认的分类id，而分类id依赖数据字典dictionaryTree，我们需要用计算属性获取默认分类id，然后watch该id，最后调用接口）
 * 思考进阶：那么我们有没有什么更优雅的方案解决呢？查了uni网站，直到发现了插件 spa-custom-hooks
 *         上面文章里的解决思路是自定义全局钩子，结合vuex使用，获取字典dictionaryTree后存储到vuex，然后会触发vue页面里对应的自定义钩子，也就不会有方案二里的尴尬用法了
 *
 * 注：经实验，spa-custom-hooks查看需要结合vuex使用，用globalData的话触发不了自定义钩子
 *
 * 实践步骤：
 *      一、安装 spa-custom-hooks 和 vuex
 *      ```bash
 *      npm i spa-custom-hooks vuex --save-dev
 *      ```
 *      二、编写store
 *      参照 ./store/store.js
 *      三、编写自定义钩子
 *      参照 ./store/hooks.js
 *      四、main.js里引入spa-custom-hooks和vuex
 *      ```bash
 *      import store from './store/store';
 *      import hooks from './store/hooks';
 *      import CustomHook from 'spa-custom-hooks';
 *		```bash
 *		export default {
 *			'DictionaryTree': {
 *				name: 'DictionaryTree',
 *				watchKey: 'dictionaryTree',
 *				hit: false,
 *				deep: true,
 *				onUpdate(val) {
 *					return !!val;
 *				}
 *			}
 *		}
 *		```
 *      Vue.use(CustomHook , hooks, store);
 *      ```
 *      五、在接口返回数据后改变vuex的值(比如 dictionaryTree)
 *      六、在页面中使用(以 dictionaryTree 为例)
 *      ```bash
 *      onDictionaryTree() {
 *          console.log('获取到数据字典了')
 *       }
 *      ```
 */

const DictionaryTree = {
  name: 'DictionaryTree',
  watchKey: 'dictionaryTree',
  hit: false,
  deep: true,
  onUpdate(val) {
    return !!val
  }
}

export default {
  DictionaryTree
}
