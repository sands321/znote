import $ from "jquery";
import zcolor from '@/util/zcolor.js';
window.zcolor=zcolor;
//debug
var _=require('lodash');
window._=_;
// window.cnamer=require('color-namer');
window.hcolor=require ('hex-colors-info');

var zutil={};
export default zutil;

zutil.parse_json=(v,def)=>{
    let ret;
    try {
        ret=JSON.parse(v);
    } catch (error) {
        return def;
    }
    return ret;
}

zutil.is_sameT=(v1,v2)=>{
    return typeof(v1)==typeof(v2);
}
zutil.is_simpT=(v)=>{
    return !zutil.is_sameT(v,{});
}

zutil.clone=(v)=>{
    if(zutil.is_simpT(v)){return v;}
    try {
        return JSON.parse(JSON.stringify(v));
    } catch (error) {
    }
}

zutil.split=function(str,cnt){
    var ret=[];
    if(!zutil.isStr(str) || !str){return ret;}
    var len=_.size(str);
    var i=0;
    while (i<len) {
        ret.push(str.substr(i,2));
        i=i+2;
    }
    return ret;
}

//-------------

// 6.525
zutil.usdtP=6.6;
zutil.usdt2cny=(v)=>{
    return v*zutil.usdtP;
}

zutil.pst=(v)=>{
    return v/Math.pow(10,18);
}

zutil.c_f3='#f3f3f3';

//----debug----

zutil.Day_MS=1000*60*60*24;

zutil.includes=function(strs_cm,str0){
    return strs_cm.split(',').includes(str0);
}

//----

//str包含arr.ele
String.prototype.zincludes=function(arr){
    for (const tmp of arr) {
        if(this.includes(tmp)){
            return true;
        }
    }
    return false;
}

//-----

//无尾0
zutil.toFixed=function(v,xiaoshu_cnt=2,no0=false){
    //undefined,null
    if(v==undefined){v=0;}
    if(typeof(v)=='string'){v=parseFloat(v);}
    v=v.toFixed(xiaoshu_cnt);
    if(no0){
        v=parseFloat(v);
    }
    return v;
}

zutil.mapToArr=function(obj,sort){
    var ret=[];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const element = obj[k];
            ret.push({'k':k,'v':element});
        }
    }
    if(sort){
        ret=zutil.sort(ret,'v');
    }
    return ret;
}

zutil.mapToArr1=function(obj,sort){
    var ret=[];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const element = obj[k];
            ret.push(element);
        }
    }
    if(sort){
        ret=zutil.sort(ret,'v');
    }
    return ret;
}


function compareFac(key,daoxu){
    return function(a,b){
        var aV=parseFloat(a[key]);
        var bV=parseFloat(b[key]);
        if(daoxu){
            return bV-aV;
        }else{
            return aV-bV;
        }
    };
}
function compareFac_str(key,daoxu){
    return function(a,b){
        if(a[key]==b[key]){return 0;}
        if(daoxu){
            return a[key]<=b[key]?1:-1;
        }else{
            return a[key]>=b[key]?1:-1;
        }
    };
}
// zutil.sort=function(arr,key){
//     return arr.sort(compareFac(key));
// }

zutil.sort=function(arr,key,daoxu=true){
    return arr.sort(compareFac(key,daoxu));
}
zutil.sortStr=function(arr,key,daoxu=true){
    return arr.sort(compareFac_str(key,daoxu));
}


//------str处理---------------

zutil.getIPs=function(str){
    return str.match(/(\d+.\d+\.\d+.\d+)/g);
}

zutil.fuckHdp=function(ip,p){
    if(!p)
        p=50070;
    var url='http://'+ip+':'+p+'/jmx';
    $.get(url,{},function(data){
        data=JSON.stringify(data);
        var nodeCnt=data.match(/"NumLiveDataNodes":(\d+)/g)[0].match(/(\d+)/g);
        var fileCnt=data.match(/"TotalFiles":(\d+)/g)[0].match(/(\d+)/g);
        console.log(nodeCnt+','+fileCnt);
    });
}

zutil.fuckPort=function(ips,p){
    var fuck_=function(tmpUrl,data){
        $.get(tmpUrl,data,function(data){
            console.log('fucked>>'+tmpUrl);
        });
    }
    if(!p)
        p=80;
    for(var k in ips){
        var row=ips[k];
        var tmpUrl='http://'+row+":"+p;
        var data={};
        fuck_(tmpUrl,data);
    }
}

zutil.isHttp=function(ports_c){
    for(var i in ports_c) {
        $.get('http://GZYD-LOGSERVER-BD05' + ports_c[i], {}, function (data) {});
    }
}

zutil.multiStr = function (fn) {
    return fn.toString().split('\n').slice(1, -1).join('\n') + '\n';
}

//------参数--------------------

zutil.getP=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    //debug,中文
    var search=decodeURI(window.location.search);
    var r = search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}

//----------------------

/**
 * 用于加载"相对资源",如:js/css
 * @param url
 * @returns {string|*} 如:'http://sub.artofapi.com:81/x/k.html'→'http://sub.artofapi.com'
 */
zutil.getUrlPre=function(url){
    var k=zutil.parseUrl(url);
    if(k.relative=='/'&url.substr(-1)!='/')
        url=url+'/';
    return url.substr(0,url.length-k.relative.length);
}

/**
 * 如:http://sub.artofapi.com/x/k.js?k1=v1&k2=v2&"
 * 1>path:"/x/k.js"、query:"?k1=v1&k2=v2&"
 * 2>relative:"/x/k.js?k1=v1&k2=v2&"
 * @param url
 * @returns {{source: *, protocol: *, host: (null|*|string), port: *, query: (null|*|string), params, file: *, hash: *, path: string, relative: *, segments: Array}}
 */
zutil.parseUrl=function(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

//-------------------数据类型----------------------------------------------

zutil.parseInt=function(v,def){
    if(!def)
        def=0;
    v=parseInt(v);
    if(isNaN(v))
        v=def;
    return v;
}

zutil.len=function(strOrArr){
    return !strOrArr?0:strOrArr.length;
}

zutil.isEmpty=function(strOrArr){
    return zutil.len(strOrArr)==0;
}

zutil.rand=(len)=>{
    return Math.round(Math.random()*len);
}
zutil.randB=(arr)=>{
    if(zutil.isEmpty(arr)){return null;}
    return arr[zutil.rand(arr.length)];
}

/**
 * 如:["hello","nimei"]→"wothefuck_hello",则匹配
 */
 zutil.matchArrPart=function(arr,str){
     if(zutil.isEmpty(arr)||!str)
        return false;
    for(var k in arr){
        var v=arr[k];
        if(str.indexOf(v)>=0){
            return true;
        }
    }
    return false;
}

zutil.contains=(arr_str,v)=>{
    if(!arr_str){return false;}
    return arr_str.split(',').indexOf(v)>=0;
}

//---------------------------------------------------------------------------

/**
 * 监听回车,onkeydown中调用其
 * @param 事件,注:ie/chrome中event为全局,firefox需回调(调用中单词必须为event)
 * @param cb
 */
function onEnter(event,cb) {
    if (event.keyCode == 13){
        var type=typeof(cb);
        if(type=='function')
            cb();
        else if(type=='string')
            eval(cb);
    }
}

zutil.isEnter=(event)=>{
    return event.keyCode == 13;
}

zutil.eval=function(str) {
    return eval('(' + str + ')');
}

//ret:true(ok),false(报错)
zutil.checkRet=function(data) {
    // if (!data.ret) {
    //     //alert(data.data);
    //     alert(data.msg);
    //     return false;
    // }
    // return true;
    

    if (data.ret != 1) {
        //alert(data.data);
        alert(data.msg);
        return false;
    }
    return true;
}

/**
 * @param jSel 即select
 * @param data 取其key
 * @param cb(key)
 */
zutil.addOptions=function(jSel,data){
    jSel.empty();
    var isArr=zutil.isArray(data);
    for(var k in data){
        var tmpV=isArr?data[k]:k;
        var tmpOpt=$('<option value="'+tmpV+'">'+tmpV+'</option>');
        jSel.append(tmpOpt);
    }
}

/**
 * 添加-列表项
 * @param jLv
 * @param data
 * @param pDisplay
 * @param optIemp {jTemp,pjDis}
 * @param cb(e,index)
 * @item <li index='3'>dis</li>
 */
zutil.addLIs=function(jLv,data,pDisplay,cb,jTemp){
    jLv.empty();
    var newItem=function(k){
        var tmpV=data[k];
        var tmpDis=tmpV[pDisplay];
        var tmpOpt;
        if(jTemp) {
            tmpOpt=zutil.renderHb(jTemp,tmpV);
            tmpOpt.attr('index',k);
        }
        else
            tmpOpt = $('<li index="' + k + '">' + tmpDis + '</li>');
        tmpOpt.click(function(e){
            if(cb)
                cb(e,k);
        });
        return tmpOpt;
    };
    for(var k in data)
        jLv.append(newItem(k));
}

//-------------UI--------------------------------------------------------

function toast(msg) {
    $().toastmessage('showNoticeToast', msg);
}

//-------------数据处理-----------------------------

zutil.filterObjs=function(arrObjs,arrFieldNames){
    var ret=[];
    for(var i in arrObjs){
        if(!arrObjs.hasOwnProperty(i)){continue;}
        var obj=arrObjs[i];
        if(obj==null)
            return;
        var tmpObj={};
        var toAdd=true;
        for(var j in arrFieldNames){
            var k=arrFieldNames[j];
            if(arrFieldNames.indexOf(k)>=0)
                tmpObj[k]=obj[k];

            //debug
            //if(k=='data'){
            if(k=='data_x'){
                //memcached:curr_items <数字>
                var tmp_k="used_memory:";
                var t_=obj[k].match(eval("/"+tmp_k+"([0-9]+)/g"));
                if(t_)
                    t_=t_[0];
                t_=t_?t_:"";
                t_=t_.replace(tmp_k,'');
                //mem:5000
                if(t_<=1*1000*1000*50)
                    toAdd=false;
                //debug
                t_=(t_/(1000*1000)).toFixed(2);
                tmpObj[k]=t_;
            }
        }
        if(toAdd)
            ret.push(tmpObj);
    };
    return ret;
}

zutil.filterObj=function(obj,arrFieldNames){
    var tmpObj={};
    for(var j in arrFieldNames) {
        var k = arrFieldNames[j];
        if (obj[k]!=undefined)
            tmpObj[k] = obj[k];
        else
            tmpObj[k]='';
    }
    return tmpObj;
}

//取证
zutil.getReadableSize=function (v) {
    var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'ZB'];
    var prev = 0, i = 0;
    while (Math.floor(v) > 0 && i < UNITS.length) {
        prev = v;
        v /= 1024;
        i += 1;
    }
    if (i > 0 && i < UNITS.length) {
        v = prev;
        i -= 1;
    }
    return Math.round(v * 100) / 100 + ' ' + UNITS[i];
}

zutil.num2mod=function(v) {
    var symbols = [ '---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx' ];
    var vInt = parseInt(v, 8);
    var sticky = (vInt & (1 << 9)) != 0;

    var res = "";
    for (var i = 0; i < 3; ++i) {
        res = symbols[(v % 10)] + res;
        v = Math.floor(v / 10);
    }

    if (sticky) {
        var otherExec = (vInt & 1) == 1;
        res = res.substr(0, res.length - 1) + (otherExec ? 't' : 'T');
    }

    return res;
}

//-------------handlebars--------------------------------------------------------

/**
 *
 * @param jItem
 * @param data
 * @returns jDom
 */
zutil.renderHb=function(jTemp,data){
    var temp=Handlebars.compile(jTemp.html());
    return $(temp(data));
}

zutil.getFileIcon_cls=function(jIcon,isDir,isImg){
    var typeCls=isDir?"glyphicon glyphicon-folder-open":"glyphicon glyphicon-file";
    if(isImg)
        typeCls="glyphicon glyphicon-picture";
    return typeCls;
}

zutil.isImg=function(fileName){
    var ImgExs=["BMP","PNG","GIF","JPG","JPEG"];

    var extStart=fileName.lastIndexOf('.');
    var ext=fileName.substring(extStart+1,fileName.length).toUpperCase();
    return ImgExs.indexOf(ext)>=0;
}

//-------------bs-------------------------------------------------------

/**
 * @param str
 * @param cbClick
 * @returns jDom
 */
function newMenuItem(str,cbClick){
    var jMenuItem=$("<li role='presentation'><a role='menuitem'>"+str+"</a></li>");
    jMenuItem.click(cbClick);
    return jMenuItem;
}

zutil.isStr=function(v){
    return typeof(v)=='string';
}

zutil.isFloat=function(v){
	return parseInt(v)==parseFloat(v);
}

zutil.isArray=function(obj){
    return obj instanceof Array;
}

zutil.getArray=function(v){
    if(zutil.isArray(v))
        return v;
    return v.split(',');
}

zutil.arrAdd=function(arr,index,v){
    if(!Array.isArray(arr))
        return;
    arr.splice(index,0,v);
}

zutil.arrRemove=function(arr,index){
    if(!Array.isArray(arr))
        return;
    arr.splice(index,1);
}

zutil.arrRemove_ls=function(arr,sub){
    if(!(Array.isArray(arr) && Array.isArray(sub)))
        return;
    let ret=[];
    arr.forEach(ele => {
        let tmp=sub.indexOf(ele);
        if(tmp<0){ret.push(ele);}
    });
    return ret;
}

zutil.arrReplace=function(arr,index,v){
    if(!Array.isArray(arr))
        return;
    arr.splice(index,1,v);
}

//---------数据处理--------------------

zutil.strrev=function(str) {
    var str2 = "";
    for (var i = 0; i < str.length; i++) {
        str2 += str.charAt(str.length - i - 1);
    }
    return str2;
}

//-------------ui-------------------------------------------------

zutil.json_format=function(txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */
    if(typeof(txt)=='object')
        txt=JSON.stringify(txt);

    var indentChar = '    ';
    if(/^\s*$/.test(txt)){
        alert('数据为空,无法格式化! ');
        return;
    }
    try{var data=eval('('+txt+')');}
    catch(e){
        alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
        return;
    };
    var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;

    var notify=function(name,value,isLast,indent/*缩进*/,formObj){
        nodeCount++;/*节点计数*/
        for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
        tab=compress?'':tab;/*压缩模式忽略缩进*/
        maxDepth=++indent;/*缩进递增并记录*/
        if(value&&value.constructor==Array){/*处理数组*/
            draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
            for (var i=0;i<value.length;i++)
                notify(i,value[i],i==value.length-1,indent,false);
            draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
        }else   if(value&&typeof value=='object'){/*处理对象*/
            draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
            var len=0,i=0;
            for(var key in value)len++;
            for(var key in value)notify(key,value[key],++i==len,indent,true);
            draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
        }else{
            if(typeof value=='string')value='"'+value+'"';
            draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
        };
    };
    var isLast=true,indent=0;
    notify('',data,isLast,indent,false);
    return draw.join('');
}

// zutil.genTag_=function(text,href,target){
    
// }

zutil.genTag_a=function(text,href,target,color){
    if(text==null)
        text='';
    if(!target)
        target='_blank';
    if(!href)
        href=text;
    var cl_str="";
    if(color){
        cl_str='style="color:'+color+'"';
    }
    return '<a href="'+href+'" target="'+target+'"'+cl_str+'>'+text+'</a>';
}

zutil.genTag_a_ev=function(text,ev_str,index){
    return '<a onclick="'+ev_str+'" zindex='+index+'>'+text+'</a>';
}

zutil.iconW_def=30;
zutil.genTag_img=function(src,href,w){
    if(!w)w=zutil.iconW_def;
    if(!href)
        return '<img src="'+src+'" width="'+w+'">';
    else
        return '<a href="'+href+'" target="_blank"><img src="'+src+'" width="'+w+'"></a>';
}

zutil.formatTime_m=function(v){
    // yyyyMMdd_hh:mm
    return new Date(v).format('yyyyMMdd_hh:mm');
}

/**
 * @param jForm
 * @param list 1>[{k1:v1},...],2>{k1:v1,...}
 * @param cbRenderCell(key,row,index)
 * @param cbLine(row,jTrRow)
 * 如:cbRenderLine(fdKey,row,index);
 */
zutil.showList=function(jForm,list,cbRenderCell,cbLine,listIgnore) {
    var tbCmd_hd=$('<thead style="100%"></thead>');
    var tbCmd_bd = $('<tbody style="100%"></tbody>');
    //empty
    tbCmd_hd.empty();
    tbCmd_bd.empty();
    //head
    var trHd=$("<tr><th>Index</th></tr>");
    tbCmd_hd.append(trHd);
    //list
    //list.forEach(function (row,index) {
    for(var index in list) {
        if(!list.hasOwnProperty(index)){continue;}
        // console.log(`debug>>${index}`);
        var row=list[index];
        var trRow = $("<tr></tr>");
        //index
        var tmpTd = $("<td>" + index + "</td>");
        trRow.append(tmpTd);

        //元素-非键值对
        if(typeof(row)!='object') {
            var tmpTd = $("<td>" + row + "</td>");
            trRow.append(tmpTd);
            tbCmd_bd.append(trRow);
            continue;
        }
        if(cbLine){
            cbLine(row,trRow);
        }
        //field
        for (var fdKey in row) {
            // if(!row.hasOwnProperty(fdKey)){continue;}
            //debug
            if(listIgnore&&listIgnore.includes(fdKey)){continue;}
            //head
            if (index == 0) {
                var tmpTh = $("<th>" + fdKey + "</th>");
                trHd.append(tmpTh);
            }
            //record
            var fd = row[fdKey];
            if (fd == null)
                fd = '';
            //debug---
            var tmp_ = '';
            if (cbRenderCell)
                tmp_ = cbRenderCell(fdKey, row, index);
            if (tmp_)
                fd = tmp_;
            //----------
            var tmpTd = $("<td>" + fd + "</td>");
            trRow.append(tmpTd);
        }
        tbCmd_bd.append(trRow);
    };
    //});
    jForm.empty();
    jForm.append(tbCmd_hd);
    jForm.append(tbCmd_bd)
}

//如:13.9
zutil.getPercent=function(newV,oldV){
    return zutil.toFixed((newV-oldV)/oldV*100);
}

zutil.getPercentD=function(newV,oldV){
    return zutil.toFixed(newV/oldV*100);
}

//per:如20
zutil.addPercent=function(v,per){
    return v*(1+per/100);
}

zutil.showList_byKey=function(jForm,list,keys,cbRenderCell,cbLine,listIgnore) {
    var tbCmd_hd=$('<thead style="100%"></thead>');
    var tbCmd_bd = $('<tbody style="100%"></tbody>');
    //empty
    tbCmd_hd.empty();
    tbCmd_bd.empty();
    //head
    var trHd=$("<tr><th>Index</th></tr>");
    tbCmd_hd.append(trHd);
    //list
    //list.forEach(function (row,index) {
    for(var index in list) {
        var row=list[index];
        var trRow = $("<tr></tr>");
        //index
        var tmpTd = $("<td>" + index + "</td>");
        trRow.append(tmpTd);

        //元素-非键值对
        if(typeof(row)!='object') {
            var tmpTd = $("<td>" + row + "</td>");
            trRow.append(tmpTd);
            tbCmd_bd.append(trRow);
            continue;
        }
        if(cbLine){
            cbLine(row,trRow);
        }
        //field
        for (var keyI in keys) {
            var fdKey=keys[keyI];
            //debug
            if(listIgnore&&listIgnore.includes(fdKey)){continue;}
            //head
            if (index == 0) {
                var tmpTh = $("<th>" + fdKey + "</th>");
                trHd.append(tmpTh);
            }
            //record
            var fd = row[fdKey];
            if (fd == null)
                fd = '';
            //debug---
            var tmp_ = '';
            if (cbRenderCell)
                tmp_ = cbRenderCell(fdKey, row, index);
            if (tmp_)
                fd = tmp_;
            //----------
            var tmpTd = $("<td>" + fd + "</td>");
            trRow.append(tmpTd);
        }
        tbCmd_bd.append(trRow);
    };
    //});
    jForm.empty();
    jForm.append(tbCmd_hd);
    jForm.append(tbCmd_bd)
}

//-----------------------------------------------------------------

zutil.drawLine=function(ct,x0,y0,x1,y1){
    ct.beginPath();
    ct.moveTo(x0,y0);
    ct.lineTo(x1,y1);
    ct.stroke();
}




