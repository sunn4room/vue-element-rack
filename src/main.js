// -------------vue--------------
import Vue from "vue";
Vue.config.productionTip = false;

// ----------element-ui----------
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// ----------vue-router----------
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [];
const viewModules = require.context("./router", true, /\.vue$/);

function addRoute(fullpath, viewModule) {
  let cut = fullpath.split("/");
  if (cut.length == 1) {
    routes.push(createRoute(viewModule, "/" + fullpath));
  } else {
    let parent = routes.find((obj) => {
      if (obj.path == "/" + cut[0]) return obj;
    });
    for (let i = 1; i < cut.length - 1; i++) {
      parent = parent.find((obj) => {
        if (obj.path == cut[i]) return obj;
      });
    }
    if (parent.children == undefined) parent.children = [];
    parent.children.push(createRoute(viewModule, cut[cut.length - 1]));
  }
}

function createRoute(viewModule, path) {
  let route = {};
  if (viewModule.route !== undefined) {
    route = viewModule.route;
  }
  route.path = path;
  route.component = viewModule.default;
  return route;
}

const viewModuleKeys = viewModules.keys().sort();
viewModuleKeys
  .filter((key) => (/\/index\.vue$/.test(key) && key !== "./index.vue"))
  .forEach((key) => {
    addRoute(key.substring(2, key.length - 10), viewModules(key));
  });

viewModuleKeys
  .filter((key) => !(/\/index\.vue$/.test(key)))
  .forEach((key) => {
    addRoute(key.substring(2, key.length - 4), viewModules(key));
  });

const router = new VueRouter({
  mode: "history",
  routes,
})

// ----------------vuex----------------
import Vuex from "vuex";
Vue.use(Vuex);

import storeObj from "./store"
const storeModules = require.context("./store", true, /\.js$/);

function addStore(fullpath, storeModule) {
  let cut = fullpath.split("/");
  let parent = storeObj;
  for (let i = 0; i < cut.length - 1; i++) {
    parent = parent.modules[cut[i]];
  }
  if (parent.modules == undefined) parent.modules = {};
  parent.modules[cut[cut.length - 1]] = storeModule.default;
}

const storeModuleKeys = storeModules.keys().sort();
storeModuleKeys
  .filter((key) => /\/index\.js$/.test(key) && key !== "./index.js")
  .forEach((key) => {
    addStore(key.substring(2, key.length - 9), storeModules(key));
  });
storeModuleKeys
  .filter((key) => !(/\/index\.js$/.test(key)))
  .forEach((key) => {
    addStore(key.substring(2, key.length - 3), storeModules(key));
  });
const store = new Vuex.Store(storeObj);

// ----------------views---------------
import App from "./router";
import "./css/main.css"

// ------------------------------------
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
