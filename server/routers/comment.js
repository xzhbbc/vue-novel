var express = require('express');
var router = express.Router();

//评论表
const Comment = require('../modelSchemas/Comment')

//统计评论表
const commentRating = require('../modelSchemas/commentRating')

router.get('/getMeg', function (req, res) {
  var bookid = req.query.bookid

  //记录总页数
  var allpagenum = 0
  //设置每页显示多少条
  var page = 3
  //获取当前页数
  var NowPage = req.query.NowPage || 1
  var countsPage = (NowPage - 1) * page

  var data = {
    page: 0,
    CommentMeg: []
  }

  Comment.find({
    _book: bookid
  }).count().then(function (count) {
    if (count <= 0) {
      return res.json({code: 0, data: 0})
    }
    allpagenum = Math.ceil(count / page)
    data.page = allpagenum
    return Comment.find({_book: bookid}).sort({
      createTime: -1
    }).limit(page).skip(countsPage).populate('_user', 'user')
  }).then(function (content) {
    data.CommentMeg = content;
    res.json({code: 0, data: data})
  })
})

router.post('/com', function (req, res) {
  const {bookid, content} = req.body
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }

  commentRating.findOne({_book: bookid}, function (err, doc) {
    if (!err) {
      if (doc) {
        var num = doc.num + 1
        var id = doc._id
        commentRating.update({_book: bookid}, {$set: {num: num}}).then(function (doc) {
          if (doc) {
            var comment = new Comment({
              content,
              _user: userid,
              _book: bookid,
              _rating: id
            });
            return comment.save().then(function () {
              res.json({code: 0, meg: '评论成功，谢谢您的评论！'})
            })
          } else {
            res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      } else {
        var CommentRating = new commentRating({num: 1, _book: bookid})
        CommentRating.save().then(function (doc) {
          var comment = new Comment({
            content,
            _user: userid,
            _book: bookid,
            _rating: doc._id
          });
          return comment.save().then(function () {
            res.json({code: 0, meg: '评论成功，谢谢您的评论！'})
          })
        })
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//后台信息获取
router.get('/getCommentMeg', function (req, res) {
  Comment.find({}).populate('_user _book','user name category').then(function (doc) {
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

router.post('/deleteComment', function (req, res) {
  const _id = req.body.id

  Comment.findOne({_id}).populate('_rating').then(function (doc) {
    var num = doc._rating.num -1;
    var id = doc._rating._id
    if (doc) {
      if (num <= 0) {
        Comment.remove({_id},function (err, doc) {
          if (!err) {
            if (doc.result.ok) {
              commentRating.remove({_id: id}, function (err, doc) {
                if (!err) {
                  if (doc) {
                    res.json({code: 0, meg: '删除成功'})
                  } else {
                    res.json({code: 1,meg: '删除失败'})
                  }
                } else {
                  res.json({code: 1, meg: '服务器发生未知错误'})
                }
              })
            } else {
              res.json({code: 1, meg: '服务器发生未知错误'})
            }
          } else {
            res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      } else {
        Comment.remove({_id},function (err, doc) {
          if (!err) {
            // console.log(doc)
            if (doc.result.ok) {
              commentRating.update({_id: id},{$set: {
                num: num
              }}).then(function (doc) {
                // console.log(doc)
                if (doc.ok) {
                  res.json({code: 0,meg: '删除成功'})
                } else {
                  res.json({code: 1,meg: '删除失败'})
                }
              })
            } else {
              res.json({code: 1, meg: '服务器发生未知错误'})
            }
          } else {
            res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      }
    } else {
      res.json({code: 1,meg: '获取该评论失败'})
    }
  })
})

module.exports = router
