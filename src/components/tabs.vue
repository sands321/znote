<template>
    <div>
        <el-menu mode="horizontal" :default-active="curMenuI"
        @select="onSelMenu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b" style="margin-bottom:1rem">
            <el-menu-item index="0">ZNote</el-menu-item>
        </el-menu>
        <zone v-show="curMenuI==0"/>
    </div>
</template>
<script>

var onlyAd=1;

import Vue from "vue";
import $ from "jquery";
import axios from "axios";
import zutil from "@/util/zutil.js";
import zone from './zone/zone.vue';

export default {
    components:{
      zone
    },
    methods:{
        onClick_search(){
            getTars_lagou(this.value,this.page);
        },
        onSelMenu(index,path){
            console.log("debug>>menu:"+index+",path:"+path);
            this.curMenuI=index+"";
        }
    },
    mounted(){
        console.log('debug>>mounted:');
        console.log(this);
    },
    data(){
        return {
            curMenuI:0+"",
            value:0,
            list:[],
            page:1
        }
    }
}

</script>

