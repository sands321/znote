
var zautil = {};
export default zautil;

// zautil.toast = (v1, v2) => {
//     zvue.$notify({ title: v1, message: v2 });
// }

//添加链接>>[]()
zautil.add_urls=(v)=>{
    v=v.split('&emsp;');
    let ret=[];
    v.map((it)=>{
        it=it.trim();
        if(!it){return;}
        let k=it.match(/\[.+?\]/g)[0];
        k=k.substr(1,k.length-2)
        let v=it.match(/\(.+?\)/g)[0];
        v=v.substr(1,v.length-2)
        ret.push({k,v});
    });
    ret.forEach((it)=>{
        zone.urls.push(it);
    });
    console.log(ret);
}

// --------

zautil.show_confirm = (msg) => {
    return zvue.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning'
    });
}

zautil.showLsObs=(ls)=>{
    let ret=[];
    ls.map((it)=>{
        let ks=Object.keys(it);
        let obj={};
        ks.map((k)=>{
            obj[k]=it[k];
        });
        ret.push(obj);
    });
    console.log(ret);
}

// --------

zautil.toast = (msg) => {
    zvue.$message(msg);
}

zautil.toast_ok = (msg) => {
    if (!msg) { msg = '操作成功' }
    zvue.$message({ message: msg, type: 'success' });
}

zautil.toast_err = (msg) => {
    if (!msg) { msg = '操作成功' }
    zvue.$message({ message: msg, type: 'error' });
}

zautil.toast_warn = (msg) => {
    zvue.$message.warning(msg);
}


// --------

zautil.notify = (v1, v2) => {
    if (!v2) {
        v2 = v1;
        v1 = '提示';
    }
    zvue.$notify({ title: v1, message: v2, type: 'warning' });
}

zautil.notify_ok = (v1, v2) => {
    // if(!v1){v1='操作成功';}
    if (!v2) {
        v2 = v1;
        v1 = '提示';
    }
    if (!v2) { v2 = '操作成功' }
    zvue.$notify({ title: v1, message: v2, type: 'success' });
}

zautil.notify_err = (v1, v2) => {
    if (!v2) {
        v2 = v1;
        v1 = '提示';
    }
    if (!v2) { v2 = '操作失败' }
    zvue.$notify({ title: v1, message: v2, type: 'error' });
}





