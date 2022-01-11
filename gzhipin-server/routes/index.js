var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// //注册一个路由（测试）
// router.post('/register',function(req,res){
// //获取请求参数
// const {username,password}=req.body
// //处理
// if(username==='admin'){//注册失败
// //返回响应数据（失败）
// res.send({code:1,msg:'此用户已存在'})
// }else{//注册成功
// //返回响应数据（成功）
// res.send({code:0,data:{id:'abc123',username,password}})
// }
// })
//注册路由
// 引入 UserModel,ChatModel
const models = require('../db/models')
const UserModel = models.UserModel
const ChatModel = models.ChatModel
const md5 = require('blueimp-md5')
const filter = { password: 0 } // 查询时过滤出指定的属性
router.post('/register', function (req, res) {
  const { username, password, type } = req.body
  //判断用户是否存在，存在返回错误信息，不存在，保存
  //查询(根据username)
  UserModel.findOne({ username }, function (error, user) {
    //如果user有值，已存在
    if (user) {
      res.send({ code: 1, msg: '此用户已存在' })
    } else {
      new UserModel({ username, password: md5(password), type }).save(function (error, user) {
        // 生成一个 cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏览器会保存在本地文件
        //密码不能传入给前端，所以封装user的json数据
        const data = { username, type, _id: user._id }
        res.send({ code: 0, data: data })
      })
    }
  })
})
//登陆路由
router.post('/login', function (req, res) {
  const { username, password } = req.body
  //根据username,password查询数据库users，没有返回错误信息，有返回登陆成功信息
  UserModel.findOne({ username, password: md5(password) }, function (err, user) {
    if (user) {
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
      res.send({ code: 0, data: user })
    } else {
      res.send({ code: 1, msg: '用户或密码不正确' })
    }
  })
})
//更新用户信息的路由
router.post('/update', function (req, res) {
  //从请求的cookies容器对象中获取userid
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录' })
  }
  //存在，根据userid更新对应的user文档数据
  //得到提交的数据，因为body中没有userid，所以得去获取
  const user = req.body;
  UserModel.findByIdAndUpdate({ _id: userid }, user, function (error, oldUser) {
    //如果没有olduser，表示-id出错，应通知浏览器删除userid cookie
    if (!oldUser) {
      res.clearCookie('userid')
      res.send({ code: 1, msg: '请先登录' })
    } else {
      //es6语法，abject有个方法是assign，能够将多个指定的对象进行合并，返回一个合并后的对象，值得注意的是，后面的对象可能会覆盖前面的对象
      const { _id, username, type } = oldUser
      const data = Object.assign(user, { _id, username, type })
      res.send({ code: 0, data: data })
    }
  })
})
//获取用户信息的路由
router.get('/user', function (req, res) {
  //从请求的cookies容器对象中获取userid
  const userid = req.cookies.userid;
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录' })
  } //有，根据userid查询对应user
  UserModel.findOne({ _id: userid }, filter, function (error, user) {
    if (user) {
      return res.send({ code: 0, data: user })
    } else {
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      return res.send({ code: 1, msg: '请先登陆' })
    }
  })

})
//获取用户列表（根据用户类型来获取）
router.get('/userlist', function (req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function (error, users) {
    res.send({ code: 0, data: users })
  })
})
/*
获取当前用户所有相关聊天信息列表
*/
router.get('/msglist', function (req, res) {
  // 获取 cookie 中的 userid
  const userid = req.cookies.userid
  console.log(userid)
  // 查询得到所有 user 文档数组
  UserModel.find(function (err, 
        userDocs) {
    // 用对象存储所有 user 信息 : key 为 user 的 _id, val 为 name 和 header 组成的 user 对象
    // const users = {} // 对象容器
    // userDocs.forEach(doc => {
    //   users[doc._id] = { username: doc.username, header: doc.header }
    // })
    const users = userDocs.reduce((users, user) => {
      users[user._id] = { username: user.username, header: user.header }
      console.log(users)
      return users
      
    }, {})
    /*
    查询 userid 相关的所有聊天信息(我发的，或发给我的)
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
    */
   //'$or'或条件{ from: userid }或者 { to: userid }，filter过滤掉password
    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function (err,
      chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据，chatMsgs为数组
      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})
/*
修改指定消息为已读 修改数据最好用post
*/
router.post('/readmsg', function (req, res) {
  // 得到请求中的 from 和 to
  const from = req.body.from
  const to = req.cookies.userid
  /*
更新数据库中的 chat 数据
参数 1: 查询条件
参数 2: 更新为指定的数据对象
参数 3: 是否 1 次更新多条 , 默认只更新一条 multi:一次更新多条
参数 4: 更新完成的回调函数
*/
  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function (err,
    doc) {
    console.log('/readmsg', doc)
    res.send({ code: 0, data: doc.nModified }) // 更新的数量
  })
})
module.exports = router;
