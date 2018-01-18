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
const fs = require('fs');

app.use(express.static(path.resolve(__dirname, '../dist')))
// 因为是单页应用 所有请求都走/dist/index.html
app.get('*', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  res.send(html)
})

// app.use(function (req, res, next) {
//   if (req.url.startsWith('/user/') || req.url.startsWith('/book/') ||
//     req.url.startsWith('/front/') || req.url.startsWith('/rating/') ||
//     req.url.startsWith('/comment/') || req.url.startsWith('/ue/') ||
//     req.url.startsWith('/static/')) {
//     return next()
//   }
// })
//
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
    // console.log(statics);
    console.log('数据库连接成功');
    app.listen(3002);
  }
});
