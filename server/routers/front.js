const express = require('express')
const router = express.Router()

//编辑推荐书籍表结构
const Editor = require('../modelSchemas/EditorCoBook')

//书籍类别表结构
const category = require('../modelSchemas/categoryBook')

//轮播图表结构
const Carousel = require('../modelSchemas/Carousel')

//书籍创建表结构
const Book = require('../modelSchemas/Book')

//星级评分表
const RatingStar = require('../modelSchemas/ratingStar')

//章节表
const Chapter = require('../modelSchemas/Chater')

//统计评分表
const AllStar = require('../modelSchemas/AllStar')

//收藏表
const CollectBook = require('../modelSchemas/ColletBook')

//上传文件操作
var fs = require('fs')
var forms = require('formidable')

//保存轮播图
router.post('/saveCarouselImg', function (req, res) {
  var form = new forms.IncomingForm() //创建上传表单
  form.uploadDir = '../static/img/carousel' //设置上传目录
  form.keepExtensions = true //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024 //文件大小

  form.parse(req, function (err, fields, files) {
    var {title} = fields
    if (title) {
      if (err) {
        res.locals.error = err;
        res.render('index', {
          title: TITLE
        })
        return
      }

      var extName = 'png' //后缀名
      switch (files.file.type) {
        case 'image/pjpeg':
          extName = 'jpg'
          break
        case 'image/jpeg':
          extName = 'jpg';
          break
        case 'image/png':
          extName = 'png'
          break
        case 'image/x-png':
          extName = 'png'
          break
      }

      if (extName.length == 0) {
        res.locals.error = '只支持png和jpg格式图片';
        return
      }
      //显示地址；
      var showUrl = files.file.path;

      Carousel.findOne({title}, function (err, doc) {
        if (!err) {
          if (doc) {
            fs.unlink(showUrl, function () {
            }) // 删除文件
            res.json({code: 1, meg: '已存在该推荐，请勿重复上传'})
          } else {
            //存储
            var carousel = new Carousel({
              title,
              img: showUrl
            });

            return carousel.save().then(function () {
              res.json({code: 0, meg: '已经上传到服务器'})
            })
          }
        } else {
          res.json({code: 1, meg: '数据库出错'})
        }
      })
    } else {
      res.json({code: 1, meg: '未能正确获取信息'})
    }
  })
})


//获取轮播图
router.get('/getCarouselImg', function (req, res) {
  Carousel.find({}, function (err, doc) {
    if (!err) {
      if (doc) {
        // console.log(doc)
        var filter = doc.map(res => {
          res.img = res.img.replace(/\\/g, "/").split('../')[1]
          return res
        })
        res.json({code: 0, data: filter})
      } else {
        res.json({code: 1, meg: '未获取到信息，可能您还没录入信息'})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})


//获取编辑推荐
router.get('/EditorImg', function (req, res) {
  Editor.find({up: 1}, function (err, doc) {
    if (!err) {
      if (doc) {
        // console.log(doc)
        var filter = doc.map(res => {
          res.recommendImg = res.recommendImg.replace(/\\/g, "/").split('../')[1]
          return res
        })
        res.json({code: 0, data: filter})
      } else {
        res.json({code: 1, meg: '未获取到信息，可能您还没录入信息'})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  }).limit(9)
})

//栏目获取
router.get('/getCategory', function (req, res) {
  category.find({}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, data: doc})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})


//所有书籍接口
router.get('/getAllBook', function (req, res) {
  Book.find({}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, data: doc})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//分页器
router.get('/getAllBookPage', function (req, res) {
  //记录总页数
  var allpagenum = 0
  //设置每页显示多少条
  var page = 10
  //获取当前页数
  var NowPage = req.query.NowPage || 1
  var countsPage = (NowPage - 1) * 10


  var category = req.query.category || ''
  if (category === 'all') {
    category = ''
  }
  // console.log(req.query)
  //返回值
  var data = {
    page: 0,
    bookMeg: []
  }


  //获取时间
  var checkDay = req.query.day || 0;

  //时间安排
  // {"$and":[{"createTime":{"$gt":"2015-5-21 0:0:0"}},{"createTime":{"$lt":"2015-5-22 0:0:0"}}]}
  //3天内
  var nowDay = Date.parse(new Date())
  var newDate = new Date()
  var times = ''
  if (checkDay == 0) {
    times = 0
  }
  if (checkDay == 3) {
    var time = nowDay / 1000 - 3 * (24 * 60 * 60)
    var threeDay = newDate.setTime(time * 1000)
    times = newDate.toISOString()
  }
  if (checkDay == 7) {
    var time = nowDay / 1000 - 7 * (24 * 60 * 60)
    var sevenDay = newDate.setTime(time * 1000)
    times = newDate.toISOString()
  }
  if (checkDay == 15) {
    var time = nowDay / 1000 - 15 * (24 * 60 * 60)
    var halfMonth = newDate.setTime(time * 1000)
    times = newDate.toISOString()
  }
  if (checkDay == 30) {
    var time = nowDay / 1000 - 30 * (24 * 60 * 60)
    var Month = newDate.setTime(time * 1000)
    times = newDate.toISOString()
  }
  if (category != '') {
    Book.find({category}).where('createTime').gt(times).count().then(function (count) {
      // console.log(count)
      allpagenum = Math.ceil(count / page)
      data.page = allpagenum
      return Book.find({category}).where('createTime').gt(times).limit(page).skip(countsPage)
      // res.json({'code':0,data: data})
    }).then(function (content) {
      data.bookMeg = content;
      res.json({code: 0, data: data})
    })
  } else {
    Book.find({}).where('createTime').gt(times).count().then(function (count) {
      // console.log(count)
      allpagenum = Math.ceil(count / page)
      data.page = allpagenum
      return Book.find({}).where('createTime').gt(times).limit(page).skip(countsPage)
      // res.json({'code':0,data: data})
    }).then(function (content) {
      data.bookMeg = content;
      res.json({code: 0, data: data})
    })
    // Book.find({"createTime":{"$gt":threeDay}}).then(function (doc) {
    //   res.json({code: 0,data: doc})
    // })
  }


})

//获取某本书籍信息
router.get('/getOneBookMeg', function (req, res) {
  var id = req.query.id || ''
  const userid = req.cookies.userid
  if (userid) {
    var point = 0
    var sum = 0
    var len = 0
    var av_point = 0
    Chapter.find({bookid: id}, 'fontNum', function (err, doc) {
      if (!err) {
        if (doc) {
          return doc
        } else {
          return 0;
        }
      } else {
        return res.json({code: 1, meg: '服务器发生未知错误'})
      }
    }).then(function (doc) {
      if (doc) {
        for (var x in doc) {
          sum = sum + doc[x].fontNum
        }
      } else {
        sum = 0;
      }
      RatingStar.findOne({_book: id, user_id: userid}).populate('_book _allStart').then(function (doc) {
        if (doc) {
          res.json({
            code: 0,
            data: doc._book,
            point: doc.point,
            fontNum: sum / 10000,
            average: doc._allStart.averPoint,
            num: doc._allStart.num
          })
          // point = doc.point;
        } else {
          AllStar.findOne({_book: id}).populate('_book').exec(function (err, doc) {
            if (!err) {
              // console.log(doc)
              if (doc) {
                return res.json({
                  code: 0,
                  data: doc._book,
                  fontNum: sum / 10000,
                  point: 0,
                  num: doc.num,
                  average: doc.averPoint
                })
              } else {
                Book.findOne({_id: id}, function (err, doc) {
                  if (!err) {
                    if (doc) {
                      return res.json({code: 0, data: doc, fontNum: sum / 10000, point: 0, num: 0, average: 0})
                    } else {
                      res.json({code: 1, meg: '未查到该书籍信息'})
                    }
                  } else {
                    return res.json({code: 1, meg: '服务器发生未知错误'})
                  }
                })
              }
            } else {
              return res.json({code: 1, meg: '服务器发生未知错误'})
            }
          })
          // point = 0;
          // Book.findOne({_id: id}, function (err, doc) {
          //   if (!err) {
          //     if (doc) {
          //       return res.json({code: 0, data: doc, fontNum: sum / 10000, point: 0, num: 0, average: 0})
          //     } else {
          //       res.json({code: 1, meg: '未查到该书籍信息'})
          //     }
          //   } else {
          //     return res.json({code: 1, meg: '服务器发生未知错误'})
          //   }
          // })
        }
      })
    })
  } else {
    var sum = 0
    var len = 0
    var av_point = 0
    Chapter.find({bookid: id}, 'fontNum', function (err, doc) {
      if (!err) {
        if (doc) {
          return doc
        } else {
          return 0;
        }
      } else {
        return res.json({code: 1, meg: '服务器发生未知错误'})
      }
    }).then(function (doc) {
      if (doc) {
        for (var x in doc) {
          sum = sum + doc[x].fontNum
        }
      } else {
        sum = 0;
      }
      AllStar.findOne({_book: id}).populate('_book').exec(function (err, doc) {
        if (!err) {
          // console.log(doc)
          if (doc) {
            return res.json({
              code: 0,
              data: doc._book,
              fontNum: sum / 10000,
              point: 0,
              num: doc.num,
              average: doc.averPoint
            })
          } else {
            Book.findOne({_id: id}, function (err, doc) {
              if (!err) {
                if (doc) {
                  return res.json({code: 0, data: doc, fontNum: sum / 10000, point: 0, num: 0, average: 0})
                } else {
                  res.json({code: 1, meg: '未查到该书籍信息'})
                }
              } else {
                return res.json({code: 1, meg: '服务器发生未知错误'})
              }
            })
          }
        } else {
          return res.json({code: 1, meg: '服务器发生未知错误'})
        }
      })
    })
  }
  // console.log(id)
})


//获取某本书的章节
router.get('/getChapter', function (req, res) {
  var id = req.query.bookid
  // console.log(id)
  Chapter.find({bookid: id}, function (err, doc) {
    if (!err) {
      if (doc) {
        // console.log(doc)
        res.json({code: 0, data: doc})
      } else {
        res.json({code: 2, data: '该书籍暂时没有章节，敬请关注！'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//得到章节内容
router.get('/getOneChapter', function (req, res) {
  var id = req.query.id

  Chapter.findOne({_id: id}, function (err, doc) {
    if (!err) {
      if (doc) {
        var data = JSON.parse(JSON.stringify(doc));
        var bookid = doc.bookid
        var newData = {}
        // console.log(doc.chapterNum)
        if (doc.chapterNum == 1) {
          //获取第一页后面的章节id
          var chapterNum = doc.chapterNum + 1
          Chapter.findOne({chapterNum, bookid}, function (err, doc) {
            if (doc) {
              return doc
            } else {
              return null;
            }
          }).then(function (doc) {
            if (doc != null) {
              return res.json({code: 0, data: data, next: doc._id})
            } else {
              return res.json({code: 0, data: data, next: -1})
            }
          })
        } else {
          var chapterNext = doc.chapterNum + 1
          var chapterPre = doc.chapterNum - 1
          var next, pre
          //获取下一页
          Chapter.findOne({chapterNum: chapterNext, bookid}, function (err, doc) {
            if (doc) {
              next = doc._id;
            } else {
              next = -1
            }
          }).then(function () {
            //获取上一页
            Chapter.findOne({chapterNum: chapterPre, bookid}, function (err, doc) {
              if (doc) {
                pre = doc._id
              } else {
                pre = -1
              }
            }).then(function () {
              res.json({code: 0, data: data, next: next, pre: pre})
            })
          })
        }
        // res.json({code: 0, data: doc})
      } else {
        res.json({code: 2, data: '暂时没有章节，敬请关注！'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})


//新书推荐
router.get('/news', function (req, res) {
  const category = req.query.category
  Book.find({category}, '_id name img').sort({
    createTime: -1
  }).limit(4).then(function (doc) {
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//编辑推荐(无置顶)
router.get('/editor', function (req, res) {
  const category = req.query.category
  Editor.find({category, up: 0}, '_id recommendBook recommendImg bookid').sort({
    editor_time: -1
  }).limit(4).then(function (doc) {
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//获取该书的第一章节(书签优先)
router.get('/firstChapter', function (req, res) {
  var _id = req.query.id;

  Book.findOne({_id}).then(function (doc) {
    var num = +doc.clickNum + 1
    var updateNum = {
      $set: {
        clickNum: num
      }
    }
    Book.update({_id}, updateNum, function (err, doc) {
      // console.log(doc)
    })
  }).then(function () {
    Chapter.findOne({bookid: _id, chapterNum: 1}, '_id', function (err, doc) {
      if (!err) {
        if (doc) {
          return res.json({code: 0, data: doc})
        } else {
          return res.json({code: 1, meg: '该书还没有章节喔，请耐心等待'})
        }
      } else {
        return res.json({code: 1, data: doc})
      }
    })
  })
})

//查询功能
router.get('/search', function (req, res) {
  var key = req.query.key
  var reg = new RegExp(key, 'i') //不区分大小
  Book.find({
    name: {$regex: reg}
  },'_id name category img actor brief', function (err, doc) {
    if (!err) {
      if (doc) {
        return res.json({code: 0, data: doc})
      } else {
        return res.json({code: 0, data: 0})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书架
router.get('/bookcase', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  CollectBook.find({_user: userid}).populate('_book','name img').then(function (doc) {
    if (doc) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, data: 0})
    }
  })
})

module.exports = router
