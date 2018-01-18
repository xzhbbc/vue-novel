const mongoose = require('mongoose')

//用户表结构
module.exports = mongoose.model('User', new mongoose.Schema({
  //用户名
  user: {type: String, require: true},
  //密码
  pwd: {type: String, require: true},
  //头像
  avatar: String,
  //性别
  sex: {type: String, require: true},
  //邮箱
  mail: {type: String},
  isAdmin: {type: Boolean, default: false},
  create_time: {type: Number, default: new Date().getTime()},
  latest_time: {type: Number}
}))
