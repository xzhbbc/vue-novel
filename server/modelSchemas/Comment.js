const moogoose = require('mongoose')

module.exports = moogoose.model('Comment', new moogoose.Schema({
  //书名
  content: {type: String, require: true},
  //创建时间
  createTime: {type: Date, default: new Date().getTime()},
  //连接用户
  _user: {
    type: moogoose.Schema.ObjectId,
    ref: 'User'
  },
  //连接书籍
  _book: {
    type: moogoose.Schema.ObjectId,
    ref: 'Book'
  },
  //关联统计评论表
  _rating: {
    type: moogoose.Schema.ObjectId,
    ref: 'commentRating'
  }
}))
