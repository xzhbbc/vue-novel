const moogoose = require('mongoose')

module.exports = moogoose.model('CollectBookRating', new moogoose.Schema({
  //连接书籍
  _book: {
    type: moogoose.Schema.ObjectId,
    ref: 'Book'
  },
  //收藏人数
  num: {type: Number, require: true}
}))
