const express = require('express')
const router = express.Router()

//星级评分表
const RatingStar = require('../modelSchemas/ratingStar')

//书籍表
const Book = require('../modelSchemas/Book')

//统计评分表
const AllStar = require('../modelSchemas/AllStar')

//统计收藏数表
const collectNum = require('../modelSchemas/ColletBookRating')

//统计评论数表
const commentRating = require('../modelSchemas/commentRating')

router.post('/star', function (req, res) {
  const {category, _id, rating} = req.body
  // console.log(rating)
  const userid = req.cookies.userid

  if (userid) {
    if (category && _id) {
      RatingStar.findOne({category, bookid: _id, user_id: userid}, function (err, doc) {
        if (doc) {
          res.json({code: 1, meg: '你太热情了，不需要再做评论了!'})
        } else {
          AllStar.findOne({_book: _id}, function (err, doc) {
            if (!err) {
              if (doc) {
                var num = doc.num + 1
                var aver = (doc.num * doc.averPoint + rating) / num
                aver = Math.round(aver * 100) / 100
                var idPoint = doc._id
                var updatePoint = {
                  $set: {
                    num: num,
                    averPoint: aver
                  }
                }
                AllStar.update({_book: _id}, updatePoint, {multi: true}, function (err, doc) {
                  if (!err) {
                    var ratingTab = new RatingStar({
                      category: category,
                      _book: _id,
                      user_id: userid,
                      point: rating,
                      _allStart: idPoint
                    })
                    return ratingTab.save().then(function () {
                      res.json({code: 0, meg: '评论成功，谢谢支持！'})
                    })
                  } else {
                    return res.json({code: 1, meg: '服务器发生未知错误'})
                  }
                })
              } else {
                var saveStartPoint = new AllStar({
                  _book: _id,
                  averPoint: rating
                })
                saveStartPoint.save().then(function (doc) {
                  var ratingTab = new RatingStar({
                    category: category,
                    _book: _id,
                    user_id: userid,
                    point: rating,
                    _allStart: doc._id
                  })
                  return ratingTab.save().then(function () {
                    res.json({code: 0, meg: '评论成功，谢谢支持！'})
                  })
                })
              }
            } else {
              return res.json({code: 1, meg: '服务器发生未知错误'})
            }
          })

        }
      })
    }
  } else {
    res.json({code: 1, meg: '请登录再做评论!'})
  }
})

//点击
router.get('/click', function (req, res) {
  const category = req.query.category || ''
  var findCategory = {}
  if (category == '') {
    findCategory = {}
  } else {
    findCategory = {
      category: category
    }
  }
  Book.find({}, '_id name img clickNum category actor').where(findCategory).sort({
    clickNum: -1
  }).limit(10).then(function (doc) {
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//评分数
router.get('/ratingPoint', function (req, res) {
  const category = req.query.category || ''
  var findCategory = {}
  if (category == '') {
    findCategory = {}
  } else {
    findCategory = {
      category: category
    }
  }
  // '_book', '_id name img category actor'
  AllStar.find({}).populate({
    path: '_book',
    match: findCategory,
    select: '_id name img category actor',
    options: {
      limit: 10
    }
  }).sort({averPoint: -1}).then(function (doc) {
    doc = doc.filter(res => {
      if (res._book != null) {
        return doc
      }
    })
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//收藏数
router.get('/ratingCollect', function (req, res) {
  const category = req.query.category || ''
  var findCategory = {}
  if (category == '') {
    findCategory = {}
  } else {
    findCategory = {
      category: category
    }
  }

  collectNum.find({}).populate({
    path: '_book',
    match: findCategory,
    select: '_id name img category actor',
    options: {limit: 10}
  }).sort({
    num: -1
  }).then(function (doc) {
    doc = doc.filter(res => {
      if (res._book != null) {
        return doc
      }
    })
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//评论人数
router.get('/ratingComment', function (req, res) {
  const category = req.query.category || ''
  var findCategory = {}
  if (category == '') {
    findCategory = {}
  } else {
    findCategory = {
      category: category
    }
  }
  commentRating.find({}).populate({
    path: '_book',
    match: findCategory,
    select: '_id name img category actor',
    options: {limit: 10}
  }).sort({
    num: -1
  }).then(function (doc) {
    doc = doc.filter(res => {
      if (res._book != null) {
        return doc
      }
    })
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

// router.get('/test', function (req, res) {
//   commentRating.find({}).populate('_book', '_id name img category actor',{category: '玄幻'}).sort({
//     num: -1
//   }).limit(10).then(function (doc) {
//     if (doc) {
//       res.json({code: 0, data: doc})
//     } else {
//       res.json({code: 1, meg: '服务器发生未知错误'})
//     }
//   })
// })

module.exports = router
