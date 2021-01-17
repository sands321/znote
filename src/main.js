// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/css/bootstrap.css"
import "./assets/css/bootstrap-theme.css"
import "./util/compat"
// import marked from 'marked'
// window.marked=marked
window._=require('lodash');
import mavonEditor from 'mavon-editor'
Vue.use(mavonEditor);
window.mavonEditor=mavonEditor;
import 'mavon-editor/dist/css/index.css';
let md=mavonEditor.markdownIt;
md.options.highlight=(ct,lang)=>{
  let ret=md.utils.escapeHtml(ct);
  ret=ret.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank">$1</a>');
  return ret;
};
// import './assets/css/zapp.css'
// import NeoVis from 'neovis.js';
import NeoVis from 'neovis.js/dist/neovis.js';
window.NeoVis=NeoVis;

Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.use(ElementUI)

/* eslint-disable no-new */
window.zvue=new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

