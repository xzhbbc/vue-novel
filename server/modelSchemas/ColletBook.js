const moogoose = require('mongoose')

module.exports = moogoose.model('Collet', new moogoose.Schema({
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
  //连接统计收藏人数
  _collectNum: {
    type: moogoose.Schema.ObjectId,
    ref: 'CollectBookRating'
  }
}))
