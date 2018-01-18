const mongoose = require('mongoose')

//编辑推荐书籍表
module.exports = mongoose.model('EditorCoBook', new mongoose.Schema({
  //推荐书籍类型
  category: {type: String, require: true},
  //推荐书籍
  recommendBook: {type: String, require: true},
  //书籍作者
  actor: {type: String, require: true},
  //推荐简介
  recommendText: {type: String, require: true},
  //推荐书籍封面
  recommendImg: {type: String, require: true},
  //书籍id
  bookid: {type: String, require: true},
  //推荐时间
  editor_time: {type: Date, default: new Date().getTime()},
  //置顶推荐
  up: {type: Number, default: 0}
}))


