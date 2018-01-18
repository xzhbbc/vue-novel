const moogoose = require('mongoose')

module.exports = moogoose.model('Chapter',new moogoose.Schema({
  //书名
  name: {type: String, require: true},
  //书籍类型
  category: {type: String, require: true},
  //第几章节
  chapterNum: {type: Number, require: true},
  //每章字数
  fontNum: {type: Number, require: true},
  //章节名
  title: {type: String, require: true},
  //文章
  content: {type: String, require: true},
  //更新用户id
  user_id: {type: String, require: true},
  //书籍的id
  bookid: {type: String, require: true},
  //更新时间
  update: {type: Date, default: new Date().getTime()}
}))
