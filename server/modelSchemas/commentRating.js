const moogoose = require('mongoose')

module.exports = moogoose.model('commentRating',new moogoose.Schema({
  //人数
  num: {type: Number, require: true},
  //关联书籍表
  _book: {
    type: moogoose.Schema.ObjectId,
    ref: 'Book'
  }
}))
