<template>
  <div @keyup.ctrl.83='onKU_save'>
    <div>
      <!-- search==== -->
      <div style="display:flex">
        <el-autocomplete
          id='etZone' 
          ref="etKw"
          class="inline-input"
          style="width:400px;display:inline-flex;"
          v-model="kw"
          @keyup.enter.native="onKD_etIn"
          @keyup.tab.native="etIn_onTab"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
        <div style="display:inline-flex;margin-left:30px;align-items:center">
          <el-button @click="onCl_t1">t1</el-button>
          <el-button @click="onCl_tes">t_es</el-button>
          <el-button @click="onCl_labels">labels</el-button>
          <!-- <el-button @click="onCl_load">load</el-button> -->
          <el-button @click="onCl_save">save</el-button>
          <span>
          &emsp;|&emsp;
          </span>
          <el-button @click="onCl_kg">KG</el-button>
        </div>
      </div>
      <!-- labels -->
      <div class="box_mt10" v-show='show_lbs'>
        <div>
          <span class='lb' @click='onCl_props_k' style='cursor:pointer;user-select:none'>属性:</span>
          <el-button size='mini' type='info' plain round>{{lb}}</el-button>
          <el-button v-for="tag in tags" :key="tag" size='mini' type='primary' plain round @click='onCl_tag'>{{tag}}</el-button>
          <!-- <el-button size='mini' plain round>+</el-button> -->
          <i class="el-icon-caret-right" :style="{'vertical-align':'middle','transform':'scale('+(tags_open?-1:1)+')'}"></i>
        </div>
        <div class="box_mt10">
          <span class='lb'>相关:</span>
          <el-button v-for="nd in nds_pa" :key="nd" size='mini' type='info' plain round @click='onCl_nd'>{{nd}}</el-button>
          <el-button v-for="nd in nds_sub" :key="nd" size='mini' type='primary' plain round @click='onCl_nd'>{{nd}}</el-button>
        </div>
        <div class="box_mt10">
          <span class='lb'>链接:</span>
          <el-button v-for="(it,i) in urls" :key="i" size='mini' type='primary' plain round
              @click="onCl_url(it.v)">{{it.k}}</el-button>
          <el-button size='mini' plain round @click='onCl_modUrls'>+</el-button>
        </div>
      </div>
    </div>
    <!-- ===== -->
    <el-input type="textarea" style="width:100%;margin-top:10px;" :rows="1" v-model="desc"></el-input>
    <!-- height:1024px -->
    <!-- @save='tbar_save' -->
    <mavon-editor
      ref='zmd_x'
      class="zmd"
      v-model="doc"
      style="margin-top:10px;width:100%;"
      v-show="1"
      :tabSize="4"
      defaultOpen="preview"
      :subfield="md_opt.subfield"
      fontSize="14px"
      @navigationToggle='tbar_navi'
    />
    <div id="viz" v-show="0"></div>

    <!-- dlgUrls===== -->
    <el-dialog
      title="链接"
      :visible.sync="dlgUrls_vi"
      width="50%">
      <div>
        <draggable v-model="urls_t" @start="drag=true" @end="drag=false">
          <el-row :gutter="20" v-for='(it,i) in urls_t' :key='i' align='middle' type='flex'>
            <el-col :span='6'><el-input placeholder="name" v-model="it.k"></el-input></el-col>
            <el-col :span='16'><el-input placeholder="url" v-model="it.v" @keyup.enter.native="onEn_url"></el-input></el-col>
            <el-col :span='2'><i class="el-icon-delete" style='font-size:24px' @click='dlgUrls_del(i)'></i></el-col>
          </el-row>
        </draggable>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click='dlgUrls_add'>添 加</el-button>
        <!-- <el-button @click="dlgUrls_vi = false">取 消</el-button> -->
        <el-button type="primary" @click="dlgUrls_onClOk" style="margin-left:30px">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import zneo4j from "../../util/zneo4j";
import zes from "../../util/zes.js";
import zone from "./zone.js";
import zautil from "../../util/zautil";
import zutil from "../../util/zutil";
import '../../assets/css/zapp.css';

import draggable from 'vuedraggable';
// import ScrollMagic from 'scrollmagic';
// import _ from 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js';

function showViz() {
  var config = {
    container_id: "viz",
    server_url: "bolt://localhost:7687",
    server_user: "neo4j",
    server_password: zneo4j.PWD,
    // labels: {
    // Character: {
    //   caption: "name",
    //   size: "pagerank",
    //   community: "community"
    // }
    // },
    relationships: {
      has: {
        thickness: "weight",
        caption: false
      }
    },
    initial_cypher: "MATCH (n)-[r]->(m) RETURN *"
  };
  // let viz = new NeoVis.default(config);
  let viz = new NeoVis(config);
  viz.render();
}

let me = {
  onCl_tes(){
    zes.t1();
  },
  // tbar--------
  tbar_navi(){
        console.log('debug>>tbar_navi');
        $('.scrollmagic-pin-spacer').show();
  },
  // dlgUrls---
  onCl_props_k(){
    console.log('debug>>x');
    let props_ex=['name','urls','uuid','t_es'];
    let tmp=zone.cur_nd.props;
    this.tags_open=!this.tags_open;
    // 关闭
    if(!this.tags_open){
      tmp=zutil.arrRemove_ls(tmp,props_ex);
    }
    this.tags=tmp;
  },
  onCl_modUrls(){
    this.dlgUrls_vi=true;
    let tmpLs=zutil.clone(this.urls);
    // x
    // if(zutil.isEmpty(tmpLs)){tmpLs.push({});}
    tmpLs.push({});
    this.urls_t=tmpLs;
  },
  dlgUrls_onClOk(){
    zone.set_urls(this);
  },
  dlgUrls_add(){
    this.urls_t.push({k:'',v:''});
    console.log('debug>>dlgUrls_add');
  },
  dlgUrls_del(i){
    zutil.arrRemove(this.urls_t,i);
  },
  onEn_url(){
    zone.set_urls(this);
  },
  // ---
  onCl_url(url){
    window.open(url);
  },
  onCl_tag(e){
    window.tmp=e;
    console.log('debug>>onCl_tag');
  },
  onCl_nd(e){
    window.ze=e;
    let nd=e.target.innerText;
    console.log('xdebug>>'+nd);
    this.kw=nd;
    this.onKD_etIn();
  },
  onTab(e) {
    if (e.keyCode === 9) {
      let tar = tmpE.target;
      let text = tar.value;
      //x
      let originalSelectionStart = event.target.selectionStart,
        textStart = text.slice(0, originalSelectionStart),
        textEnd = text.slice(originalSelectionStart);
      tar.value = `${textStart}\t${textEnd}`;
      event.target.selectionEnd = event.target.selectionStart =
        originalSelectionStart + 1;
    }
  },
  onCl_labels() {
    zneo4j
      .se()
      .run(zneo4j.get_all_lbs())
      .then(rst => {
        let tmp = rst.records[0].get("lbs");
        zautil.show_confirm(tmp);
        console.log(tmp);
      });
  },
  onCl_t1() {
    zone.f1();
    // showViz();
  },
  onCl_load() {
    zone.get_node(this);
  },
  onCl_save() {
    console.log(this);
    zone.do_save(this);
  },
  onCl_kg(){
    window.open('http://localhost:7474/browser/');
  },
  // 获取-节点
  onKD_etIn() {
    console.log('debug>>onEt');
    this.$refs.etKw.suggestions = [];
    zone.get_node(this);
  },
  etIn_onTab(){
    console.log(`debug>>etIn_onTab`);
  },
  //---
  onCh_etIn() {
    console.log("debug>>onCh_etIn");
  },
  querySearch_x(kw, cb){
    // window.tmp=cb;
    //防止请求时-跳动
    cb([]);
    if (zutil.len(kw) < 2) {return;}
    zes.zo_search(kw).then((rst)=>{
      // x
      window.tmp = rst;
      let conf = rst.config;
      console.log(`req>>${conf.method}>>${conf.url}`);
      if (conf.params) { console.log('req.params>>' + JSON.stringify(conf.params)) };
      if (conf.data) { console.log('req.data>>' + conf.data); }
      // x
      let tmp = rst.data;
      tmp=zes.get_hits(tmp);
      let ls=[];
      tmp.forEach(ele => {
        ls.push({value:ele.name});
      });
      // tmp=ls;
      // tmp = JSON.stringify(tmp, '', 2);
      console.log(`kw>>${kw}:${ls.length}`);
      cb(ls);
    }).catch((e) => {
      window.tmp = e;
      console.log(JSON.stringify(e.response.data, '', 2));
    });
    
  },
  querySearch(kw, cb) {
    // window.tmp=cb;
    //防止请求时-跳动
    cb([]);
    if (zutil.len(kw) < 2) {return;}
    let sql = zneo4j.search_nds(kw);
    console.log("querySearch>>" + sql);
    zneo4j.se().run(sql).then(rst => {
        // if (zutil.isEmpty(rst.records)) {return;}
        let tmp = rst.records[0].get("names");
        let tmp1 = tmp.sort((a, b) => {
          let i0 = a.indexOf(kw);
          let i1 = b.indexOf(kw);
          if (i0 < i1) {return -1;}
          if (i0 > i1) {return 1;}
          if (a.length < b.length) {return -1;}
          if (a.length > b.length) {return 1;}
          if (a < b) {return -1;}
          if (a > b) {return 1;}
          return 0;
        });
        console.log(tmp1);
        let tmpX = [];
        tmp.map(it => tmpX.push({ value: it }));
        cb(tmpX);
      });
  },
  handleSelect(item) {
    console.log('debug>>sel_x');
  }
};

//监听-事件
function addKbLs(ctx) {
  document.onkeydown = function(e) {    
      window.tmp=e;
      let key = e.key;   
      // metaKey
      let cmd=e.ctrlKey;
      let meta=e.metaKey;
      // console.log('debug>>'+key+','+e.metakey);
      if (key=='p' && cmd) {
          e.preventDefault();
          ctx.md_opt.subfield=!ctx.md_opt.subfield;
          console.log('debug>>addKbLs');
      }else if(key=='s' && meta){
          e.preventDefault();
          ctx.onCl_save();
          console.log(`debug>>key.doSave`);
      }
  };
}

// --------

export default {
  components:{
    draggable
  },
  mounted(){
    console.log('zone>>mounted'); 
    addKbLs(this);
    window.zone=this;
    window.zonejs=zone;
    zone.get_node(this);
    // x
    let j_zmd=$('.zmd');
    let j_bar=$('.v-note-op');
    let jNav=$('.v-note-navigation-wrapper');
    jNav.addClass('zNav');
    // x
    $('.v-note-navigation-content').delegate('h4','click',(e)=>{
      window.tmpE=e;
      let tmpId=e.currentTarget.querySelector('a').id;
      window.open('#'+tmpId,'_self');
      console.log('debug>>x');
    });
    // .mord.mathit
    // .v-note-show,.v-show-content
    $('.v-note-show').delegate('.mord.mathit','mouseover',(e)=>{
      window.tmpE=e;
      let tar=e.currentTarget;
      console.log('debug>>in');
    });

    document.addEventListener('scroll',(e)=>{
      let off=j_zmd.offset().top-window.pageYOffset;
      let is_over=off<=0;
      // jNav.css('position',is_over?'fixed':'static');
      // j_bar.offset().top=0;
      // $('.v-show-content').css('overflow',is_over?'scroll':'hidden');
      // if(is_over){e.preventDefault();}
      // e.preventDefault();
      // console.log(off);
    },true);

    // x
    let ctrl = new ScrollMagic.Controller();
    window.ctrl=ctrl;
    let sc1 = new ScrollMagic.Scene()
        .triggerHook(0)
        .triggerElement('.v-note-op')
        // .setClassToggle('.v-note-op', 'cls1')
        .setPin('.v-note-op')
        // .setPin("#divPa")
        .addTo(ctrl);
    // x
    let sc2 = new ScrollMagic.Scene()
        .triggerHook(0)
        .triggerElement('.v-note-op')
        // .setClassToggle('.v-note-op', 'cls1')
        .setPin('.v-note-navigation-wrapper')
        // .setPin("#divPa")
        .addTo(ctrl);
    // x
    // sc1.addIndicators();
    // sc2.addIndicators();
  },
  methods: me,
  data() {
    return {
      nd_name:'',
      nd_id:-1,
      in1: "",
      d1: "ok",
      desc: "",
      // md------
      doc: "",
      md_opt: {
        subfield: false
      },
      // ------
      // t1
      kw: "t1",
      kw_hints: [],
      show_lbs:0,
      lb:'',
      tags:[],
      tags_open:false,
      tags_arrow_scale:-1,
      nds_pa:[],
      nds_sub:[],
      // dlgUrls----
      dlgUrls_vi:false,
      urls_t:[],
      urls:[]
    };
  }
};
</script>

<style>
#viz {
  width: 900px;
  height: 700px;
  border: 1px solid lightgray;
  margin-top: 10px;
  font: 22pt arial;
}

.lb{
  font-size:13px;
  margin-right:5px;
}
.box_mt10{
  margin-top: 10px;
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}

/* .v-note-navigation-wrapper{ */
.zNav{
  transition:none !important
}

</style>

<style scoped>
.mavonEditor1 {
  width: 100%;
  height: 100%;
}
</style>





















