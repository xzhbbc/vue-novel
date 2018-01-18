const moogoose = require('mongoose')

module.exports = moogoose.model('Carousel', new moogoose.Schema({
  //标题
  title: {type: String, require: true},
  //图片路径
  img: {type: String, require: true}
}))
