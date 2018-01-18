var express = require('express');
var router = express.Router();
const utils = require('utility');

const User = require('../modelSchemas/User')

//查找(管理员查找，还未添加功能)
router.get('/', function (req, res) {
  User.find({}, {'pwd': 0, '__v': 0}, function (err, doc) {
    return res.json({code: 0, data: doc})
  })
})

//注册
router.post('/sendUser', function (req, res) {
  var {user, pass, sex, email} = req.body
  User.findOne({user}, function (err, doc) {
    if (!err) {
      if (!doc) {
        var userMeg = new User({
          user, pwd: md5Pwd(pass), sex, mail: email
        })
        return userMeg.save().then(function () {
          res.json({code: 0, meg: '已经成功注册，欢迎使用！'})
        })
      } else {
        return res.json({code: 1, meg: '已经存在该名用户，请换用户名'})
      }
    } else {
      return res.json({code: 1, meg: '未能正确得接受信息'})
    }
  })
})

//登录
router.post('/loginUser', function (req, res) {
  var {user, checkPass} = req.body
  // console.log(user, checkPass)
  User.findOne({user, pwd: md5Pwd(checkPass)}, {'pwd': 0, '__v': 0}, function (err, doc) {
    if (!err) {
      if (!doc) {
        // console.log(doc)
        return res.json({code: 1, msg: '用户名或者密码错误'})
      } else {
        res.cookie('userid', doc._id)
        return res.json({code: 0, data: doc})
      }
    } else {
      return res.json({code: 1, meg: '数据库存在未知问题'})
    }
  })
})

//修改用户名(管理员操作)
router.post('/fixUserAdmin', function (req, res) {
  var {user, pass, sex, mail, oldPass, _id} = req.body
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  // console.log(req.body)
  User.findOne({_id: userid}, function (err, doc) {
    if (!err) {
      if (doc) {
        if (doc.isAdmin) {
          return true;
        } else {
          res.json({code: 1, meg: '你不是管理员，无法执行该操作'})
        }
      } else {
        res.json({code: 1, meg: '您还未登录'})
      }
    } else {
      res.json({code: 1, meg: '服务器出现未知错误'})
    }
  }).then(function (isTrue) {
    if (isTrue) {
      if (oldPass == '') {
        User.findOneAndUpdate({_id, user}, {sex, mail}, function (err, doc) {
          if (!err) {
            if (doc) {
              return res.json({code: 0, meg: '该用户修改成功'})
            } else {
              return res.json({code: 1, meg: '用户获取不正确'})
            }
          } else {
            return res.json({code: 1, meg: '服务器出现未知错误'})
          }
        })
      } else {
        // console.log('我在这里')
        User.findOneAndUpdate({user, pwd: md5Pwd(oldPass)}, {pwd: pass, sex: sex, mail}, function (err, doc) {
          if (!err) {
            if (doc) {
              res.json({code: 0, meg: '该用户修改成功'})
            } else {
              res.json({code: 1, meg: '旧密码输入不正确'})
            }
          } else {
            res.json({code: 1, meg: '服务器出现未知错误'})
          }
        })
      }
    }
  })
})

function md5Pwd(pwd) {
  const salt = 'is_good_365489189@!351%^#@%^^'
  return utils.md5(utils.md5(pwd + salt))
}

module.exports = router
