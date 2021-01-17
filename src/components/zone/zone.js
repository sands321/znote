import zutil from "../../util/zutil";
import zneo4j from "../../util/zneo4j";
import zautil from "../../util/zautil";

class zone {

    static cur_nd;

    static add_node(tag,ls,pa){
        if(typeof(ls)==typeof('')){
            ls=[ls]
        }
        var se = zneo4j.se();
        var sql = zneo4j.add_nodes_rel(tag,ls,pa);
        se.run(sql).then((rst) => {
            window.tmp = rst;
            zneo4j.show_rst(rst);
            // console.log(tmp.records[0].get('lbs'));
            zautil.toast_ok();
        }).catch(err => {
            console.error(err);
            zautil.toast_err(err);
        });
    }

    /**
     * 测试neo4j接口
     */
    static f1() {
        var se = zneo4j.se();
        var sql = '';
        // sql=zneo4j.index_es();
        // sql=zneo4j.get_all_lbs();
        // sql=zneo4j.add_const_lb('node');
        // sql=zneo4j.add_nodes('node','group');
        // sql = zneo4j.add_nodes_rel('tool', ['elasticsearch-sql-cli'], 'elasticsearch');
        sql = zneo4j.add_nodes_rel('lib', ['t11'], 't1');
        // sql = zneo4j.add_rel_nTo1(['economics'], 'science');
        // sql=zneo4j.change_name('android.lib','ad.lib');
        // sql=zneo4j.change_rel_pa('espresso','ad.test');
        // sql=zneo4j.change_lb('semver','semver','lang');
        // sql=zneo4j.del_dup_rels('amdjs');
        // sql=zneo4j.del_rel('oh-my-zsh');
        // sql = zneo4j.del_ids([556]);
        // sql = zneo4j.del_name('leaderf');
        //x
        // zautil.toast(sql);
        // return;
        se.run(sql).then((rst) => {
            window.tmp = rst;
            zneo4j.show_rst(rst);
            // console.log(tmp.records[0].get('lbs'));
            zautil.toast_ok();
        }).catch(err => {
            console.error(err);
            zautil.toast_err(err);
        });
    }

    static get_node(ctx) {
        let nd_name=ctx.kw;
        // get_nd
        let sql = zneo4j.get_nd_wRels(nd_name);
        zneo4j.se().run(sql).then(rst => {
            this.cur_nd=null;
            zneo4j.show_rst(rst);
            window.tmp = rst;
            let hasNd=!zutil.isEmpty(tmp.records);
            ctx.show_lbs=hasNd;
            // ctx.desc='';
            //未找到
            if (!hasNd) {
                zautil.toast('NO>>' + nd_name);
                return;
            }
            let rec=rst.records[0];
            let nd = rec.get('n');
            nd.pa=rec.get('col2');
            nd.sub=rec.get('col1');
            let props = nd.properties;
            nd.props=Object.keys(props);
            this.cur_nd=nd;
            // x
            let lbs=nd.labels.toString();
            // j_etDesc.val(props.desc);
            ctx.nd_id=nd.identity.low;
            ctx.nd_name=props.name;
            // ---
            ctx.lb=lbs;
            let props_ex=['name','urls','uuid','t_es'];
            ctx.tags=zutil.arrRemove_ls(nd.props,props_ex);
            ctx.nds_pa=nd.pa;
            ctx.nds_sub=nd.sub;
            //---
            ctx.desc = props.desc;
            ctx.doc = props.doc;
            // ---
            ctx.urls=zutil.parse_json(props.urls,[]);
            console.log(props);
            zautil.toast_ok('load>>'+nd_name);
        });
    }

    static do_save(ctx) {
        let save_in = () => {
            console.log('save_in>>');
            console.log(ctx);
            if(!doc){doc='';}
            if(!desc){desc='';}
            let sql = `match (n{name:'${name}'}) set n.doc=$doc,n.desc=$desc`;
            zneo4j.se().run(sql, { doc: doc, desc: desc }).then(rst => {
                zautil.toast_ok(`保存>>${name}`);
                window.tmp = rst;
                zneo4j.show_rst(rst);
            }).catch(err => {
                console.error(err);
                zautil.toast_err(err);
            });
        }
        //x
        let name=ctx.kw;
        let desc = ctx.desc;
        let doc = ctx.doc;
        if (!doc) {
            zautil.show_confirm('doc为空').then(() => {
                save_in();
            });
            return;
        }
        save_in();
    }

    static set_urls(ctx){
        let urls=ctx.urls_t;
        urls=urls.filter(x=>x.k && x.v);
        let sql = `match (n) where id(n)=${ctx.nd_id} set n.urls=$urls`;
        zneo4j.se().run(sql, { urls:JSON.stringify(urls)}).then(rst => {
            ctx.dlgUrls_vi=false;
            ctx.urls=urls;
            zautil.toast_ok(`保存>>${ctx.kw}.urls`);
            zneo4j.show_rst(rst);
        }).catch(err => {
            zautil.toast_err(err);
        });
    }

    // --------

    static getTotalCnt(){
        zneo4j.se().run(`match (n) return count(n) as cnt`).then(rst=>{
            let cnt=rst.records[0].get('cnt').low;
            console.log(`total>>${cnt}`);
        }).catch(err=>{
            zautil.toast_err(err);
        });
    }


}

export default zone;



