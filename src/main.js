// -------------vue--------------
import Vue from 'vue'
Vue.config.productionTip = false

// ----------element-ui----------
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// ----------vue-router----------
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = []
const viewModules = require.context("./views", true, /\.vue$/)

function addRoute(fullpath, viewModule) { 
  let cut = fullpath.split("/")    
  if (cut.length == 1) {    
    routes.push(createRoute(viewModule, "/"+fullpath))    
  } else {       
    let parent = routes.find(obj => {    
      if (obj.path == "/"+cut[0]) return obj    
    })
    for (let i = 1; i < cut.length-1; i++) {
      parent = parent.find(obj => {
        if (obj.path == cut[i]) return obj
      })
    }
    if (parent.children == undefined) parent.children = []    
    parent.children.push(createRoute(viewModule, cut[cut.length-1]))    
  }
}
    
function createRoute(viewModule, path) {    
  let route = {}      
  if (viewModule.route !== undefined) {    
    route = viewModule.route    
  }    
  route.path = path    
  route.component = viewModule.default    
  return route    
}

const viewModuleKeys = viewModules.keys().sort()
viewModuleKeys.filter(key => {
  if (/\/index\.vue$/.test(key) && key !== "./index.vue")
    return true
  else
    return false
}).forEach(key => {
  addRoute(key.substring(2, key.length-10), viewModules(key))
})

viewModuleKeys.filter(key => {
  if (/\/index\.vue$/.test(key))
    return false
  else
    return true
}).forEach(key => {
  addRoute(key.substring(2, key.length-4), viewModules(key))
})

console.log(routes)

const router = new VueRouter({
  mode: 'history',
  routes
})

// ----------------vuex----------------
import Vuex from 'vuex'
Vue.use(Vuex)

const storeModules = require.context("./store", true, /\.js$/)
const storeObj = storeModules.keys().sort().reduce((storeObj, key) => {
  console.log(storeObj, key)
}, {})
const store = new Vuex.Store(storeObj)

// ----------------views---------------
import views from './views'

// ------------------------------------
new Vue({
  router,
  store,
  render: h => h(views),
}).$mount('#app')
