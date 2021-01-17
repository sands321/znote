
import zutil from "./zutil";
import Axios from "axios";
import { inflate } from "zlib";

class zes {

  static base_es = 'http://localhost:9200';
  // static idx = 't1';
  static idx_neo4j = 'neo4j';
  static idx = 'neo4j';

  /**
   * 测试es相关接口
   */
  static testEs() {
    let req;
    // --------
    // req = this.exec();
    // --------
    // req = this.adde_temp();
    // req=this.add_idx('t1');
    // req=this.del_idx('t1');
    // req=this.change_set();
    // req=this.open_idx(1);
    // --------
    // req = this.add_tempSe('tempse1');
    // req = this.del_tempSe('tempse1');
    // req = this.render_tempSe();
    // req = this.search_byTemp('tempse1');
    // --------
    // req=this.del_idx('t1');
    // req = this.bulk();
    // req = this.bulk_add();
    // --------
    // req = this.add_doc({'name':'angularjs','doc': '今天天气真不错'});
    // req = this.add_doc({'name':'angularjs','doc': '明天你打算干嘛'});
    // req = this.update_doc('67GV-mwBhtpgEKbslr4_');
    // req=this.del_doc('57HP92wBhtpgEKbsNL4y');
    // --------
    // req=this.search_kv('doc','今天');
    // req=this.search_scfd();
    req = this.search();
    // --------
    // req = this.vali_explain('t1',{'name':'js'});
    // req = this.ana('nice to meet you','english');
    // req = this.ana_idx_field('doc','nice to meet you');
    // req = this.ana_id_field('6LHR92wBhtpgEKbsdr57','doc');
    // req = this.ana_tok('nice to meet you');
    // --------
    req.then((rst) => {
      window.tmp = rst;
      let conf = rst.config;
      console.log(`req>>${conf.method}>>${conf.url}`);
      if (conf.params) { console.log('req.params>>' + JSON.stringify(conf.params)) };
      if (conf.data) { console.log('req.data>>' + conf.data); }
      //x
      let tmp = rst.data;
      tmp = JSON.stringify(tmp, '', 2);
      console.log('rst>>');
      console.log(tmp);
    }).catch((e) => {
      window.tmp = e;
      console.log(JSON.stringify(e.response.data, '', 2));
    });
  }

  // --------

  static exec() {
    let p = {
      "script": {
        "source": "params.count / params.total",
        // "source":"doc",
        "params": {
          "count": 100.0,
          "total": 1000.0
        }
      }
    };
    let url = `${this.base_es}/_scripts/painless/_execute`;
    return Axios.post(url, p);
  }

  // --------

  static render_tempSe(tempID = '') {
    let hasTempID = Boolean(tempID);
    let source = {
      "query": {
        "terms": "{{#toJson}}statuses{{/toJson}}"
      }
    };
    let p = {
      "source": hasTempID ? '' : source,
      "params": {
        "statuses": {
          "status": ["pending", "published"]
        }
      }
    };
    let tmp = hasTempID ? ('/' + tempID) : '';
    let url = `${this.base_es}/_render/template${tmp}`;
    return Axios.post(url, p);
  }

  static search_byTemp(tempID) {
    let p = {
      "id": tempID,
      "params": {
        "doc": "今天"
      },
      // "explain":true,
      // "profile":true
    };
    let url = `${this.base_es}/_search/template`;
    return Axios.post(url, p);
  }

  static add_tempSe(tempID) {
    let p = {
      "script": {
        "lang": "mustache",
        "source": {
          "query": {
            "match": {
              "doc": "{{doc}}"
            }
          }
        }
      }
    };
    let url = `${this.base_es}/_scripts/${tempID}`;
    return Axios.post(url, p);
  }

  static del_tempSe(tempID) {
    let url = `${this.base_es}/_scripts/${tempID}`;
    return Axios.delete(url);
  }

  // --------

  static adde_temp() {
    let p = {
      "index_patterns": ["neo4j", "t1"],
      "settings": {
        "analysis": {
          "normalizer": {
            "norm_lc": {
              "type": "custom",
              "char_filter": [],
              "filter": ["lowercase", "asciifolding"]
            }
          },
          "analyzer": {
            "ana1": { "tokenizer": "tok1" },
          },
          "tokenizer": {
            "tok1": {
              "type": "ngram",
              "min_gram": 2,
              "max_gram": 3,
              "token_chars": ["letter", "digit"]
            }
          }
        }
      },
      "mappings": {
        "properties": {
          "t_es": { "enabled": "false" },
          "name": {
            "type": "keyword",
            "normalizer": "norm_lc"
          },
          "desc": {
            "type": "text",
            "analyzer": "ik_max_word",
            "search_analyzer": "ik_smart"
          },
          "doc": {
            "type": "text",
            "analyzer": "ik_max_word",
            "search_analyzer": "ik_smart"
          }
        }
      }
    }
    let url = `${this.base_es}/_template/temp_zone`;
    return Axios.put(url, p);
  }

  static add_idx(idxX) {
    let p = {
      "settings": {
      },
      "mappings": {
      }
    };
    let url = `${this.base_es}/${idxX}`;
    return Axios.put(url, p);
  }

  static del_idx(idxX) {
    let url = `${this.base_es}/${idxX}`;
    return Axios.delete(url);
  }

  static change_set() {
    let p = {
      "analysis": {
      },
      "mappings": {
      }
    };
    let url = `${this.base_es}/${this.idx}/_settings`;
    return Axios.put(url, p);
  }

  static del_doc(id) {
    let url = `${this.base_es}/${this.idx}/_doc/${id}`;
    return Axios.delete(url);
  }

  static add_doc(doc) {
    let url = `${this.base_es}/${this.idx}/_doc`;
    return Axios.post(url, doc);
  }

  static bulk() {
    let p = [
      { "index": { "_index": `${this.idx}` } },
      { "name": "so_good" }
    ];
    let tar = '';
    p.forEach(ele => {
      tar = tar + JSON.stringify(ele) + '\n';
    });
    p = tar;
    let url = `${this.base_es}/_bulk`;
    return Axios.post(url, p, { 'headers': { 'Content-Type': 'application/x-ndjson' } });
  }

  static bulk_add() {
    let meta = { "index": { "_index": `${this.idx}` } };
    meta = JSON.stringify(meta);
    let p = [
      { "name": "good" },
      { "name": "so_good" },
      { "name": "right" },
      { "name": "angularjs" },
      { "name": "js" },
      { "name": "JSX" },
    ];
    let tar = '';
    p.forEach(ele => {
      tar = tar + meta + '\n' + JSON.stringify(ele) + '\n';
    });
    p = tar;
    console.log(p);
    let url = `${this.base_es}/_bulk`;
    return Axios.post(url, p, { 'headers': { 'Content-Type': 'application/x-ndjson' } });
  }

  static update_doc(id) {
    let p = {
      "script": {
        "source": "ctx._source.counter += params.count",
        "lang": "painless",
        "params": {
          "count": 4
        }
      }
    };
    // ctx._source
    p = { "script": "Debug.explain(doc.name)" };
    let url = `${this.base_es}/${this.idx}/_update/${id}`;
    return Axios.post(url, p);
  }

  static search(kw) {
    // kw = 'JS';
    kw = 'visualdl';
    kw = kw.toLowerCase();
    let sort = {
      "_script": {
        "type": "number",
        "script": {
          "lang": "painless",
          "source": "doc['name'].value.length() * params.factor",
          // "source":"Debug.explain(doc.name.value)",
          "params": {
            "factor": 1.1
          }
        },
        "order": "asc"
      }
    };
    let script_fields = {
      "sc_f1": {
        "script": { "source": "doc.name" }
      },
      "_source": {
        "script": { "source": "params._source" }
      }
    };
    // --------
    let score_x = `(1-doc.name.value.indexOf("${kw}")*1.0/doc.name.value.length())+1.0/doc.name.value.length()`;
    let script_score = {
      "query": {
        // wildcard
        "match": {
          // "name": `*${kw}*`,
          "desc": `*${kw}*`
        }
      },
      "script": {
        "source": `${score_x}`,
        // "source": `Debug.explain(${score_x})`,
        "params": {}
      }
    };
    let p = {
      // "profile":true,
      // "explain":true,
      "query": {
        // "match": {
        //   "name": {"query": "JS"}
        // },
        "bool": {
          "should": [
            {
              "wildcard": {
                "name": `*${kw}*`,
              }
            },
            {
              "match": {
                "desc": kw,
              }
            }
          ]
        }
        // xx
        // "script_score": script_score
      },
      // sort
      // "sort": {"_score":{"order":"asc"}},
      // script_fields
      "script_fields": {},
      "_source": ["name", "desc"],
      "highlight": {
        "force_source":false,
        "number_of_fragments": 3,
        "fragment_size": 150,
        "fields": {
          // "pre_tags" : ["<tag1>"],
          // "post_tags" : ["</tag1>"],
          "name": {},
          "desc":{} //{ "pre_tags": ["<em>"], "post_tags": ["</em>"] }
        }
      }
    };
    let url = `${this.base_es}/${this.idx}/_search`;
    return Axios.post(url, p);
  }

  static explain_de() {
    let p = {
      "query": {
        "script": {
          // doc.name
          "script": "Debug.explain(ctx._source)"
        }
      }
    };
    let url = `${this.base_es}/${this.idx}/_explain/67GV-mwBhtpgEKbslr4_`;
    return Axios.post(url, p);
  }

  static search_scfd() {
    let p = {
      "script_fields": {
        "fd1": {
          "script": {
            "lang": "expression",
            "source": "doc['name']",
            "params": {
              "p1": 3
            }
          }
        }
      }
    };
    let url = `${this.base_es}/${this.idx}/_search`;
    return Axios.post(url, p);
  }

  static search_kv(k, v) {
    let match = {};
    match[k] = {
      "query": v
    }
    let p = {
      "profile": true,
      "query": {
        "match": match
      }
    };
    let url = `${this.base_es}/${this.idx}/_search`;
    return Axios.post(url, p);
  }

  static open_idx(to_open) {
    let tmp = to_open ? '_open' : '_close';
    let url = `${this.base_es}/${this.idx}/${tmp}`;
    return Axios.post(url);
  }

  // --------

  static ana(text, analyzer = 'standard') {
    let p = {
      "text": text,
      "analyzer": analyzer
    }
    let url = `${this.base_es}/_analyze`;
    return Axios.post(url, p);
  }

  static ana_idx_field(field, text) {
    let p = {
      "field": field,
      "text": text
    }
    let url = `${this.base_es}/${this.idx}/_analyze`;
    return Axios.post(url, p);
  }

  static ana_id_field(id, field) {
    let p = {
      "fields": field
    }
    let url = `${this.base_es}/${this.idx}/_doc/${id}/_termvectors`;
    return Axios.get(url, { params: p });
  }

  static ana_tok(text, tokenizer = 'standard') {
    let p = {
      "text": text,
      "tokenizer": tokenizer
    }
    let url = `${this.base_es}/_analyze`;
    return Axios.post(url, p);
  }

  static vali_explain(idxX, match) {
    let p = {
      "query": {
        "match": match
      }
    };
    let url = `${this.base_es}/${idxX}/_validate/query?explain`;
    return Axios.post(url, p);
  }

  // --------

  static get_hits(rst) {
    let ret = [];
    rst = rst.hits.hits;
    rst.forEach(ele => {
      ret.push(ele._source);
    });
    return ret;
  }

  // --------

  static zo_search(kw) {
    let score_x = `(1-doc.name.value.indexOf("${kw}")*1.0/doc.name.value.length())+1.0/doc.name.value.length()`;
    let p = {
      "query": {
        "script_score": {
          "query": {
            "wildcard": {
              "name": `*${kw}*`
            }
          },
          "script": {
            "source": `${score_x}`
          }
        }
      },
      "_source": ["name"],
      "size": 20
    };
    let url = `${this.base_es}/${this.idx_neo4j}/_search`;
    return Axios.post(url, p);
  }





}

export default zes;


