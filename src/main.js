// -------------vue--------------
import Vue from "vue"
Vue.config.productionTip = false

// ----------element-ui----------
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)

// ----------vue-router----------
import VueRouter from "vue-router"
Vue.use(VueRouter)

const viewModules = require.context("./view", true, /\.vue$/);
const routes = [];
if (viewModules.keys().indexOf("./index.vue") < 0)
  routes.push(createRoute(require('@/component/defaultIndex.vue'), "/"))
else
  routes.push(createRoute(viewModules("./index.vue"), "/"))

function addRoute(fullpath, viewModule) {
  let cut = fullpath.split("/")
  let parent = routes[0]
  for (let i = 0; i < cut.length - 1; i++) {
    if (parent.children == undefined) parent.children = []
    let findResult = parent.children.find((obj) => {
      let trans = cut[i][0] == '~' ? cut[i].substring(1) + '/:' + cut[i].substring(1) : cut[i]
      if (obj.path == trans) return obj
    })
    if (findResult == undefined) {
      const defaultRoute = createRoute(require('@/component/defaultIndex.vue'), cut[i])
      parent.children.push(defaultRoute)
      parent = defaultRoute
    } else {
      parent = findResult
    }
  }
  if (parent.children == undefined) parent.children = []
  parent.children.push(createRoute(viewModule, cut[cut.length - 1]))
}

function createRoute(viewModule, path) {
  let route = {}
  if (viewModule.route !== undefined) {
    route = viewModule.route
  }
  route.path = path[0] == '~' ? path.substring(1) + '/:' + path.substring(1) : path
  route.component = viewModule.default
  return route
}

const viewModuleKeys = viewModules.keys().sort()
viewModuleKeys
  .filter((key) => (/\/index\.vue$/.test(key) && key !== "./index.vue"))
  .forEach((key) => {
    addRoute(key.substring(2, key.length - 10), viewModules(key));
  })

viewModuleKeys
  .filter((key) => !(/\/index\.vue$/.test(key)))
  .forEach((key) => {
    addRoute(key.substring(2, key.length - 4), viewModules(key));
  })

routes.push({
  path: "/*",
  redirect: "/error/404"
})

const router = new VueRouter({
  mode: "history",
  routes,
})

// ----------------vuex----------------
import Vuex from "vuex"
Vue.use(Vuex);

const storeModules = require.context("./store", true, /\.js$/);
const storeObj = storeModules.keys().indexOf("./index.js") < 0 ? {} : storeModules("./index.js").default

function addStore(fullpath, storeModule) {
  let cut = fullpath.split("/")
  let parent = storeObj
  for (let i = 0; i < cut.length - 1; i++) {
    if (parent.modules == undefined) parent.modules = {}
    if (parent.modules[cut[i]] == undefined) parent.modules[cut[i]] = {}
    parent = parent.modules[cut[i]]
  }
  if (parent.modules == undefined) parent.modules = {}
  parent.modules[cut[cut.length - 1]] = storeModule.default
}

const storeModuleKeys = storeModules.keys().sort()
storeModuleKeys
  .filter((key) => /\/index\.js$/.test(key) && key !== "./index.js")
  .forEach((key) => {
    addStore(key.substring(2, key.length - 9), storeModules(key))
  });
storeModuleKeys
  .filter((key) => !(/\/index\.js$/.test(key)))
  .forEach((key) => {
    addStore(key.substring(2, key.length - 3), storeModules(key))
  })

const store = new Vuex.Store(storeObj);

// ----------------views---------------
import App from "./App.vue";
import "./css/main.css"

// ------------------------------------
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
