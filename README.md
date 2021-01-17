# ZNote

🖖 图谱式笔记系统，旨在提高个人笔记的使用率！



## 解决问题

- 笔记记了太多，但使用率太低。

- 每次查询知识点时，总搜出一堆东西，需要二次筛选，结果还不一定能找到。

  故常常宁愿直接百度也不愿从自己的笔记系统里检索。



## 特点

- 基于neo4j图数据库存储笔记信息，将知识点拆到足够细，并作为一个知识节点。利用图数据库的关系属性将节点串联起来。
- 定制Markdown，使笔记信息密度更加紧凑，更符合工具型文档的特性。传统Markdown样式比较漂亮，但也更加粗犷，更适合给别人阅读，而非提升个人效率。



## 配置及运行

1. 安装nodejs、neo4j、nginx

2. zneo4j.js中修改zneo4j.PWD为neo4j的密码

3. 启动neo4j

4. npm install，下载相关相关依赖

5. nginx配置ZNote反向代理：

   ```
   upstream node_8080{
   	server localhost:8080;
   }
   location /znote/{
   	proxy_pass http://node_8080;
   }
   ```

6. npm run dev

7. 即可访问ZNote：http://localhost/znote/#/



## 相关文章

1. [知乎：有哪些让你相见恨晚的记笔记方法？](https://www.zhihu.com/question/324766011/answer/837760201)
2. [知乎：开发一个云笔记软件，需要用到哪些技术？](https://www.zhihu.com/question/367070357/answer/981337565)



**联系方式-微信：zhucheng798**



