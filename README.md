# vue-novel

> A Vue.js project

## Build Setup

``` bash
## Build Setup

``` bash
# 前端项目已经打包完成

# 项目上线地址：http://120.77.209.3:3002/#/

# 该项目开启地址为： server/app.js 端口：3002
node app 或 nodemon app.js

# moogodb数据库导出在：server/db  端口：27022

# 加入服务器首屏渲染ssr  （2018 1.24号更新）

导入代码:
mongoimport -h 127.0.0.1:27022 -d books(数据库名) -c 表名 --file json导出数据路径
```
