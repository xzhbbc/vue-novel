const moogoose = require('mongoose')

module.exports = moogoose.model('Book', new moogoose.Schema({
  //书名
  name: {type: String, require: true},
  //书籍类型
  category: {type: String, require: true},
  //作者
  actor: {type: String, require: true},
  //书籍点击量
  clickNum: {type: Number, default: 0},
  //是否完本
  over: {type: Boolean, default: false},
  //书籍简介
  brief: {type: String, require: true},
  //封面
  img: {type: String, default: 'img/1.jpg'},
  //总字数
  bookNum: {type: Number, default: 0},
  //创建时间
  createTime: {type: Date, default: new Date().getTime()},
  //保存是谁录入
  user_id: {type: String, require: true}
}))
