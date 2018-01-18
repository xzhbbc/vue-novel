const moogoose = require('mongoose')

module.exports = moogoose.model('categoryBook',new moogoose.Schema({
  //书籍类型号
  num: {type: String, require: true},
  //书籍类型
  category: {type: String, require: true}
}))
