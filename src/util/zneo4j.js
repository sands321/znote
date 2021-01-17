import neo4j from 'neo4j-driver'

/**
 * neo4j接口
 */
class zneo4j{
    
    /**
     * 前端仅支持globalThis,nodejs两者都支持
     */
    static zGlobal(){
        return global || globalThis;
    }

    /**
     * 连接neo4j,获取session
     */
    static se() {
        if(this.zGlobal().zse){return this.zGlobal().zse;}
        const dr = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', this.PWD));
        const se = dr.session();
        this.zGlobal().zse=se;
        return se;
    }
    
    static show_rst(tmp){
        console.log('cypher>>' + tmp.summary.statement.text);
        console.log(tmp.summary.updateStatistics._stats);
    }

    // --------

    static index_es(){
        return `with toInteger(rand()*1000) as tmp match (n) set n.t_es=tmp`;
    }

    // --------

    static get_all_lbs(){
        // return `match (n) with distinct labels(n)[0] as lbs with collect(lbs) as lbs return lbs`;
        return `call db.labels() yield label return collect(label) as lbs`;
    }

    static get_all_urls(){
        return `match (n) where exists(n.urls)  return n.name as name,n.urls as urls`;
    }

    // get_rel_nodes
    static get_nd_wRels(name){
        return `
        match (n{name:'${name}'}) with n
        optional match (n)-[r]->(n2) with collect(n2.name) as col1,n
        optional match (n)<-[r]-(n2) with collect(n2.name) as col2,col1,n return col1,col2,n`;
    }

    /**
     * 名字->node
     * @param {string} name 
     */
    static get_nd(name){
        return `match (n{name:'${name}'}) return n`;
    }
    
    /**
     * 关键字->node名列表
     * @param {string} kw 
     */
    static search_nds(kw){
        // return `match (n) where n.name=~'(?i).*${kw}.*' return n.name`;
        return `match (n) where n.name=~'(?i).*${kw}.*' with collect(n.name) as names return names`;
    }

    static set_prop(name,k,v){
        // '${v}'
        return `match (n{name:'${name}'}) set n.${k}=$doc`;
    }

    static add_nodes(lb,names){
        names=this.get_arr_str(names);
        return `unwind ${names} as nd
                create (:${lb}{name:nd})`
    }

    static add_nodes_rel(lb,names,domain){
        names=this.get_arr_str(names);
        return `unwind ${names} as nd
                match (n1{name:'${domain}'}) create (n2:${lb}{name:nd}) create (n1)-[r:has]->(n2)`;
    }

    static add_rel_nTo1(names,domain){
        names=this.get_arr_str(names);
        return `match (n1{name:'${domain}'}) match (n2) where n2.name in ${names} create (n1)-[r:has]->(n2)`;
    }
    
    static del_ids(ids){
        ids=this.get_arr_str(ids);
        var sql=`match (n) where id(n) in ${ids} detach delete n`;
        return sql;
    }

    static del_name(name){
        var sql=`match (n{name:'${name}'}) detach delete n`;
        return sql;
    }
    
    static del_dup_rels(domain){
        return `match (a{name:'${domain}'})-[r:has]->(b)
        with a,b,tail(collect(r)) as rr
        where size(rr)>0
        foreach (r in rr | delete r)`;
    }

    static del_rel(name){
        return `match (n{name:'${name}'})-[r]-() delete r`;
    }
    
    static add_const_lb(lbs){
        lbs=this.get_arr(lbs);
        var ret='';
        return `create constraint on (n:${lbs[0]}) assert n.name is unique`;
        // return `unwind ${lbs} as lb
        // create constraint on (n:lb) assert n.name is unique`;
    }

    static change_name(name_old,name_new){
        return `match (n{name:'${name_old}'}) set n.name='${name_new}'`;
    }

    //仅适于-单关系
    static change_rel_pa(nd_sub,nd_newPa){
        return `match (n1)-[r1]->(n2{name:'${nd_sub}'}),
                (n6) where n6.name='${nd_newPa}'
                create (n6)-[r2:has]->(n2)
                set r2=r1
                delete r1`;
    }

    static change_lb(name,lb_old,lb_new){
        return `match (n:${lb_old}{name:'${name}'}) remove n:${lb_old} set n:${lb_new} return n`;
    }

    static get_arr(v){
        if(typeof(v)!=typeof([])){v=[v];}
        return v;
    }

    static get_arr_str(v){
        if(typeof(v)!=typeof([])){v=[v];}
        return v=JSON.stringify(v);
    }

}
zneo4j.PWD='zhucheng798';

export default zneo4j;




