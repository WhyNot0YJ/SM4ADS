import { createApp } from 'vue'
import App from './App.vue'
// css样式重置
import './assets/css/reset.css'

const app = createApp(App)
//引入vue-router
import router from "./router"
app.use(router)

//引入el-icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//引入pinia
import pinia from './stores'
app.use(pinia)
app.mount('#app')
