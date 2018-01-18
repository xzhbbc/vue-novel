const moogoose = require('mongoose')

module.exports = moogoose.model('AllStar',new moogoose.Schema({
  //连接书籍
  _book: {
    type: moogoose.Schema.ObjectId,
    ref: 'Book'
  },
  //人数
  num: {type: Number, require: true, default: 1},
  //平均评分
  averPoint: {type: Number, require: true},
  //更新时间
  update: {type: Date, default: new Date().getTime()}
}))
