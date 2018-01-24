var express = require('express')

var mongoose = require('mongoose')

var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

var app = express();

app.use(cookieParser())
app.use(bodyParser.json());

//bodyparser设置
app.use(bodyParser.urlencoded({
  extended: true
}));

//静态托管
var path = require('path');

var statics = path.resolve(__dirname, '..');
app.use('/static', express.static(statics + '/static/'));

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const frontRouter = require('./routers/front')
const rating = require('./routers/rating')
const comment = require('./routers/comment')

app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use('/front', frontRouter)
app.use('/rating', rating)
app.use('/comment', comment)

var ueditor = require("ueditor");


//编辑器配置
app.use("/ue", ueditor(path.join(__dirname, '../static'), function (req, res, next) {
  //客户端上传文件设置
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    var file_url = '/static/img/ueditor';//默认图片上传地址
    /*其他上传格式的地址*/
    if (ActionType === 'uploadfile') {
      file_url = '/file/ueditor/'; //附件
    }
    if (ActionType === 'uploadvideo') {
      file_url = '/video/ueditor/'; //视频
    }
    res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html');
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/static/ueditor/nodejs/config.json');
  }
}));

// 引入文件模块
const fs = require('fs')

//ssr 首屏加载
const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

const staticPath = require('../dist/vue-ssr-client-manifest.json')


app.use(express.static(path.resolve(__dirname, '../dist')))
// 因为是单页应用 所有请求都走/dist/index.html
app.get('*', function(req, res) {
  // const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  // res.send(html)
  const apphtml = new Vue({
    data: {
      url: req.url
    },
    template: ` <div id="app">
    <Headers></Headers>
    <Navs></Navs>
    <router-view></router-view>
    <Login></Login>
    <register></register>
    <bookcase></bookcase>
  </div>`
  })
//   let text = ''
//   const stream = renderer.renderToStream(apphtml)
//   stream.on('err', err => {
//     // handle error...
//     res.status(500).end('Internal Server Error')
//   })
//   res.write(`<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width,initial-scale=1.0">
//     <link rel="stylesheet" type="text/css" href="static/reset.css"/>
//     <link rel="stylesheet" type="text/css" href="static/style.css"/>
//     <link href="${staticPath["all"][4]}" rel="stylesheet">
//     <title>new_novel</title>
//   </head>
//   <body>`)
//   stream.on('html', data => {
//     res.write(`${data}`)
//   })
//   stream.on('end', () => {
//     res.write(`
//     <script type="text/javascript" src="${staticPath["initial"][0]}"></script>
//     <script type="text/javascript" src="${staticPath["initial"][1]}"></script>
//     <script type="text/javascript" src="${staticPath["initial"][2]}"></script>
//   </body>
// </html>`)
//     res.end()
//   })
  renderer.renderToString(apphtml, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="static/reset.css"/>
    <link rel="stylesheet" type="text/css" href="static/style.css"/>
    <link href="${staticPath["all"][4]}" rel="stylesheet">
    <title>new_novel</title>
  </head>
  <body>
    ${html}
    <script type="text/javascript" src="${staticPath["initial"][0]}"></script>
    <script type="text/javascript" src="${staticPath["initial"][1]}"></script>
    <script type="text/javascript" src="${staticPath["initial"][2]}"></script>
  </body>
</html>
    `)
  })
})

// var rootPath = path.resolve(__dirname, '..');
// app.use('/', express.static(rootPath + '/dist/'));
// app.use(express.static(path.resolve(__dirname, '../dist')))
// console.log(express.static(path.resolve('dist/index.html')))
// app.use('/', express.static(path.resolve('dist/index.html')))

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27022/books', function (err) {
  if (err) {
    console.log('数据库连接失败');
  } else {
    // console.log(path.join(__dirname, '../static/ueditor'))
    // console.log(staticPath["initial"][0]);
    console.log('数据库连接成功');
    app.listen(3002);
  }
});
