import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import './assets/css/base.css'

//消息提示框
import "element-plus/theme-chalk/el-message.css"
import "element-plus/theme-chalk/el-message-box.css"

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//挂载全局
import echarts from './plugins/echarts'
//方法1
app.config.globalProperties.$echarts = echarts

//方法2
app.provide('$echarts', echarts)

import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'//需要新加的代码
app.use(ElementPlus, { locale })//需要改变的地方，加入locale

//导入pinia
import { createPinia } from 'pinia'
app.use(createPinia())

//导入面包屑组件
// import Breadcrumb from '@/components/Breadcrumb'
// app.component('Breadcrumb', Breadcrumb)

app.use(router).mount('#app')
