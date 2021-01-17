<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
//debug
import neo4j from 'neo4j-driver'
window.neo4j=neo4j;
import $ from "jquery";
window.$=$;
//debug
// import Editor from "tui-editor";
// window.Editor=Editor;
import zutil from "./util/zutil";
window.zutil=zutil;
import zautil from "./util/zautil";
window.zautil=zautil;
window.fs=require('fs');
import md5 from 'js-md5';
window.md5=md5;
//---


export default {
  name: 'app'
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  margin: 50px;
  margin-top:0px;
  color: #2c3e50;
  font-size:medium;
}
</style>
