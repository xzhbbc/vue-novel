const moogoose = require('mongoose')

module.exports = moogoose.model('RatingStar',new moogoose.Schema({
  //书名
  _book: {
    type: moogoose.Schema.ObjectId,
    ref: 'Book'
  },
  //书籍类型
  category: {type: String, require: true},
  //用户id
  user_id: {type: String, require: true},
  //连接总评分表
  _allStart: {
    type: moogoose.Schema.ObjectId,
    ref: 'AllStar'
  },
  //评分
  point: {type: Number, require: true},
  //评论时间
  update: {type: Date, default: new Date().getTime()}
}))
