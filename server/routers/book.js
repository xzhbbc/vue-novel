var express = require('express');
var router = express.Router();
//编辑推荐书籍表结构
const Editor = require('../modelSchemas/EditorCoBook')
//书籍类别表结构
const category = require('../modelSchemas/categoryBook')
//书籍创建表结构
const Book = require('../modelSchemas/Book')

//书籍章节表结构
const Chapter = require('../modelSchemas/Chater')

//收藏书籍结构表
const ColletBook = require('../modelSchemas/ColletBook')

//统计收藏书籍结构
const CollectBookRating = require('../modelSchemas/ColletBookRating')

//上传文件操作
var fs = require('fs');
var forms = require('formidable');


router.get('/category', function (req, res) {
  category.find({}, function (err, doc) {
    if (!err) {
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '类别查询失败'})
    }
  })
})

router.post('/getCategoryBook', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  var {catgory} = req.body
  // console.log(catgory)
  Book.find({category: catgory, user_id: userid}, function (err, doc) {
    if (!err) {
      // console.log(doc)
      res.json({code: 0, data: doc})
    } else {
      res.json({code: 1, meg: '书籍查询错误'})
    }
  })
})

//推荐书籍删除
router.post('/deleteRecommend', function (req, res) {
  const {id} = req.body
  Editor.findOne({_id: id}, function (err, doc) {
    fs.unlink(doc.recommendImg, function () {
    })
  }).then(function () {
    Editor.remove({_id: id}, function (err, doc) {
      if (!err) {
        if (doc.result.ok) {
          res.json({code: 0, meg: '删除成功'})
        } else {
          res.json({code: 1, meg: '删除失败'})
        }
      } else {
        res.json({code: 1, meg: '服务器发生未知错误'})
      }
    })
  })
})

//书籍删除
router.post('/deleteBook', function (req, res) {
  const {id} = req.body
  Book.findOne({_id: id}, function (err, doc) {
    fs.unlink(doc.recommendImg, function () {
    })
  }).then(function () {
    Book.remove({_id: id}, function (err, doc) {
      if (!err) {
        if (doc.result.ok) {
          res.json({code: 0, meg: '删除成功'})
        } else {
          res.json({code: 1, meg: '删除失败'})
        }
      } else {
        res.json({code: 1, meg: '服务器发生未知错误'})
      }
    })
  })
})

//推荐书籍信息获取
router.get('/getRecommend', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  Editor.find({}, null, {sort: {
    up: -1
  }}, function (err, doc) {
    if (!err) {
      //过滤给前台正确的url地址
      var filter = doc.map(res => {
        res.recommendImg = res.recommendImg.replace(/\\/g, "/").split('../')[1]
        // res.recommendImg = '~/' + res.recommendImg
        return res
      })
      // console.log(filter)
      res.json({code: 0, data: filter})
    } else {
      res.json({code: 1, meg: '数据获取错误'})
    }
  })
})

//推荐信息置顶修改
router.post('/fixUp', function (req, res) {
  const userid = req.cookies.userid
  const {id, up} = req.body
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  if (up == 1) {
    Editor.find({up: 1}).count().then(function (num) {
      if (num >= 9) {
        console.log(num)
        return res.json({code: 1, meg: '最多推荐9个，不能再多了！'})
      } else {
        Editor.findOneAndUpdate({_id: id}, {up}, function (err, doc) {
          if (!err) {
            if (doc) {
              return res.json({code: 0, meg: '置顶成功'})
            } else {
              return res.json({code: 1, meg: '置顶失败'})
            }
          } else {
            return res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      }
    })
  } else {
    Editor.findOneAndUpdate({_id: id}, {up}, function (err, doc) {
      if (!err) {
        if (doc) {
          return res.json({code: 0})
        } else {
          return res.json({code: 1})
        }
      } else {
        return res.json({code: 1, meg: '服务器发生未知错误'})
      }
    })
  }


})

//书籍信息修改获取
router.post('/getBookId', function (req, res) {
  var {id} = req.body
  Book.findOne({_id: id}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, data: doc})
      } else {
        res.json({code: 1, meg: '未找到该数据'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//推荐信息修改获取
router.post('/getRecommendBookId', function (req, res) {
  var {id} = req.body
  Editor.findOne({_id: id}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, data: doc})
      } else {
        res.json({code: 1, meg: '未找到该数据'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书籍信息无图片修改
router.post('/BookNoImgUpdate', function (req, res) {
  const {id, category, name, actor, brief} = req.body
  Book.findOneAndUpdate({_id: id, category, name}, {actor, brief}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, meg: '修改成功'})
      } else {
        res.json({code: 1, meg: '修改失败'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//推荐信息无图片修改
router.post('/RecommendNoImgUpdate', function (req, res) {
  const {id, category, recommendBook, actor, recommendText} = req.body
  Editor.findOneAndUpdate({_id: id, category, recommendBook}, {actor, recommendText}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, meg: '修改成功'})
      } else {
        res.json({code: 1, meg: '修改失败'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书籍信息有图片修改
router.post('/updateImgBook', function (req, res) {
  var form = new forms.IncomingForm(); //创建上传表单
  form.uploadDir = '../static/img'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小


  form.parse(req, function (err, fields, files) {
    var {id, category, name, actor, brief, oldimg} = fields
    if (category) {
      if (err) {
        res.locals.error = err;
        res.render('index', {
          title: TITLE
        });
        return;
      }

      var extName = 'png'; //后缀名
      switch (files.file.type) {
        case 'image/pjpeg':
          extName = 'jpg';
          break;
        case 'image/jpeg':
          extName = 'jpg';
          break;
        case 'image/png':
          extName = 'png';
          break;
        case 'image/x-png':
          extName = 'png';
          break;
      }

      if (extName.length == 0) {
        res.locals.error = '只支持png和jpg格式图片';
        return;
      }
      //显示地址；
      var showUrl = files.file.path;

      // oldimg = oldimg.replace(/\//g, '\\')
      // oldimg = '../' + oldimg
      //   console.log(oldimg)
      var arrOld = oldimg.split('\\')
      var old = ''
      for (var i = 0; i < arrOld.length; i++) {
        old = old + arrOld[i] + '/';
      }
      console.log(old)
      Book.findOneAndUpdate({_id: id, category, name}, {
        actor,
        brief,
        img: showUrl
      }, function (err, doc) {
        if (!err) {
          if (doc) {
            fs.unlink(old, function () {
            })
            return res.json({code: 0, meg: '修改成功'})
          } else {
            fs.unlink(showUrl, function () {
            })
            return res.json({code: 1, meg: '修改失败'})
          }
        } else {
          fs.unlink(showUrl, function () {
          })
          return res.json({code: 1, meg: '服务器发生未知错误'})
        }
      })


    } else {
      res.json({code: 1, meg: '未能正确获取信息'})
    }
  })
})

//推荐信息有图片修改
router.post('/updateImgRecommend', function (req, res) {
  var form = new forms.IncomingForm(); //创建上传表单
  form.uploadDir = '../static/img'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小


  form.parse(req, function (err, fields, files) {
    var {id, category, recommendBook, actor, recommendText, oldimg} = fields
    if (category) {
      if (err) {
        res.locals.error = err;
        res.render('index', {
          title: TITLE
        });
        return;
      }

      var extName = 'png'; //后缀名
      switch (files.file.type) {
        case 'image/pjpeg':
          extName = 'jpg';
          break;
        case 'image/jpeg':
          extName = 'jpg';
          break;
        case 'image/png':
          extName = 'png';
          break;
        case 'image/x-png':
          extName = 'png';
          break;
      }

      if (extName.length == 0) {
        res.locals.error = '只支持png和jpg格式图片';
        return;
      }
      //显示地址；
      var showUrl = files.file.path;

      // oldimg = oldimg.replace(/\//g, '\\')
      // oldimg = '../' + oldimg
      //   console.log(oldimg)
      var arrOld = oldimg.split('\\')
      var old = '';
      for (var i = 0; i < arrOld.length; i++) {
        old = old + arrOld[i] + '/';
      }
      // console.log(old)
      Editor.findOneAndUpdate({_id: id, category, recommendBook}, {
        actor,
        recommendText,
        recommendImg: showUrl
      }, function (err, doc) {
        if (!err) {
          if (doc) {
            fs.unlink(old, function () {
            })
            return res.json({code: 0, meg: '修改成功'})
          } else {
            return fs.unlink(showUrl, function () {
            })
            return res.json({code: 1, meg: '修改失败'})
          }
        } else {
          fs.unlink(showUrl, function () {
          })
          return res.json({code: 1, meg: '服务器发生未知错误'})
        }
      })


    } else {
      res.json({code: 1, meg: '未能正确获取信息'})
    }
  })
})

//推荐书籍信息上传
router.post('/uploadRecommend', function (req, res) {
  var form = new forms.IncomingForm(); //创建上传表单
  form.uploadDir = '../static/img/editor'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function (err, fields, files) {
    var {category, book, actor, brief, bookid} = fields
    if (category) {
      if (err) {
        res.locals.error = err;
        res.render('index', {
          title: TITLE
        });
        return;
      }

      var extName = 'png'; //后缀名
      switch (files.file.type) {
        case 'image/pjpeg':
          extName = 'jpg';
          break;
        case 'image/jpeg':
          extName = 'jpg';
          break;
        case 'image/png':
          extName = 'png';
          break;
        case 'image/x-png':
          extName = 'png';
          break;
      }

      if (extName.length == 0) {
        res.locals.error = '只支持png和jpg格式图片';
        return;
      }
      //显示地址；
      var showUrl = files.file.path;

      Book.findOne({category, name: book}, function (err, doc) {
        if (!err) {
          if (!doc) {
            fs.unlink(showUrl, function () {
            }) // 删除文件
            res.json({code: 1, meg: '数据不存在该书，请换本书推荐'})
          } else {
            //存储
            // Editor.findOne({bookid}, function (err, doc) {
            //   if (doc) {
            //     fs.unlink(showUrl, function () {
            //     }) // 删除文件
            //     return res.json({code: 1, meg: '已经推荐过该书籍'})
            //   } else {
            //   }
            // })
            var editorRecommend = new Editor({
              category: category,
              recommendBook: book,
              actor: actor,
              recommendText: brief,
              recommendImg: showUrl,
              bookid
            });

            return editorRecommend.save().then(function () {
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

//书籍录入
router.post('/uploadBook', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }


  var form = new forms.IncomingForm(); //创建上传表单
  form.uploadDir = '../static/img'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function (err, fields, files) {
    var {category, book, actor, brief} = fields
    if (category) {
      if (err) {
        res.locals.error = err;
        res.render('index', {
          title: TITLE
        });
        return;
      }
      var extName = 'png'; //后缀名
      switch (files.file.type) {
        case 'image/pjpeg':
          extName = 'jpg';
          break;
        case 'image/jpeg':
          extName = 'jpg';
          break;
        case 'image/png':
          extName = 'png';
          break;
        case 'image/x-png':
          extName = 'png';
          break;
      }

      if (extName.length == 0) {
        res.locals.error = '只支持png和jpg格式图片';
        return;
      }
      //显示地址；
      var showUrl = files.file.path;

      Book.findOne({name: book}, function (err, doc) {
        if (!err) {
          if (doc) {
            fs.unlink(showUrl, function () {
            }) // 删除文件
            res.json({code: 1, meg: '已经存在该书'})
            return;
          } else {
            //存储
            var bookmeg = new Book({
              name: book,
              category: category,
              recommendBook: book,
              actor: actor,
              brief: brief,
              img: showUrl,
              user_id: userid
            });

            return bookmeg.save().then(function () {
              res.json({code: 0, meg: '已经上传到服务器'})
            })
          }
        } else {
          console.log(err)
        }
      })


    } else {
      res.json({code: 1, meg: '未能正确获取信息'})
    }
  })
})

//书籍信息获取
router.get('/getBookMeg', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  Book.find({user_id: userid}, function (err, doc) {
    if (!err) {
      if (doc == '') {
        return res.json({code: 1, meg: '您还未录入书籍喔！'})
      } else {
        return res.json({code: 0, data: doc})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书籍章节获取
router.post('/Chapter', function (req, res) {
  const {name, category} = req.body
  console.log(name, category)
  Chapter.find({name, category}, function (err, doc) {
    if (!err) {
      // console.log(doc)
      if (doc == '') {
        //还没开始录入章节
        // console.log('还未开始')
        return res.json({code: 3, chapterNum: 1})
      } else {
        return res.json({code: 0, chapterNum: doc[doc.length - 1].chapterNum})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书籍章节上传
router.post('/uploadChapter', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  const {name, category, chapterNum, fontNum, title, content, bookid} = req.body

  Chapter.findOne({name, chapterNum}, function (err, doc) {
    if (!err) {
      // console.log(doc)
      if (!doc) {
        var chapter = new Chapter({
          name, category, chapterNum, fontNum, title, content, user_id: userid, bookid
        })
        return chapter.save().then(function () {
          res.json({code: 0, meg: '上传成功'})
        })
      } else {
        return res.json({code: 1, meg: '出错了，已经存在该章节'})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//书籍章节获取
router.get('/getUserChapter', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  Chapter.find({user_id: userid}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0, data: doc})
      } else {
        res.json({code: 1, meg: '您还没有录入数据！'})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//获取书籍
router.get('/getColBook', function (req, res) {
  const bookid = req.query.bookid
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  ColletBook.findOne({_book: bookid, _user: userid}, function (err, doc) {
    if (!err) {
      if (doc) {
        res.json({code: 0})
      } else {
        res.json({code: 1})
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

//收藏书籍
router.get('/colletBook', function (req, res) {
  const bookid = req.query.bookid
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }
  CollectBookRating.findOne({_book: bookid}, function (err, doc) {
    if (!err) {
      if (doc) {
        var num = doc.num + 1
        var id = doc._id
        CollectBookRating.update({_book: bookid}, {
          $set: {
            num: num
          }
        }, function (err, doc) {
          if (doc) {
            var collect = new ColletBook({
              _user: userid,
              _book: bookid,
              _collectNum: id
            });
            return collect.save().then(function () {
              res.json({code: 0, meg: '收藏成功，谢谢您的支持！'})
            })
          } else {
            res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      } else {
        var CollectBookRatings = new CollectBookRating({
          _book: bookid,
          num: 1
        })
        CollectBookRatings.save().then(function (doc) {
          if (doc) {
            var collect = new ColletBook({
              _user: userid,
              _book: bookid,
              _collectNum: doc._id
            });
            return collect.save().then(function () {
              res.json({code: 0, meg: '收藏成功，谢谢您的支持！'})
            })
          } else {
            res.json({code: 1, meg: '服务器发生未知错误'})
          }
        })
      }
    } else {
      res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })

})


//删除书籍
router.get('/delColBook', function (req, res) {
  const bookid = req.query.bookid
  const userid = req.cookies.userid
  if (!userid) {
    return res.json({code: 1, meg: '非法操作'})
  }

  CollectBookRating.findOne({_book: bookid}, function (err, doc) {
    if (!err) {
      if (doc) {
        var num = doc.num - 1
        if (num <= 0) {
          CollectBookRating.remove({_book: bookid}, function (err, doc) {
            if (!err) {
              if (doc.result.ok) {
                ColletBook.remove({_book: bookid, _user: userid}, function (err, doc) {
                  if (!err) {
                    if (doc.result.ok) {
                      return res.json({code: 0, meg: '取消收藏成功'})
                    } else {
                      return res.json({code: 1, meg: '取消收藏失败'})
                    }
                  } else {
                    return res.json({code: 1, meg: '服务器发生未知错误'})
                  }
                })
              } else {
                return res.json({code: 1, meg: '更新信息出错'})
              }
            } else {
              return res.json({code: 1, meg: '服务器发生未知错误'})
            }
          })
        } else {
          CollectBookRating.update({_book: bookid}, {
            $set: {
              num: num
            }
          }, function (err, doc) {
            if (doc) {
              ColletBook.remove({_book: bookid, _user: userid}, function (err, doc) {
                if (!err) {
                  if (doc.result.ok) {
                    return res.json({code: 0, meg: '取消收藏成功'})
                  } else {
                    return res.json({code: 1, meg: '取消收藏失败'})
                  }
                } else {
                  return res.json({code: 1, meg: '服务器发生未知错误'})
                }
              })
            } else {
              return res.json({code: 1, meg: '更改信息失败'})
            }
          })
        }
      } else {
        return res.json({code: 1, meg: '获取失败'})
      }
    } else {
      return res.json({code: 1, meg: '服务器发生未知错误'})
    }
  })
})

module.exports = router
