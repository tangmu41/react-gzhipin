// 使用 mongoose 操作 mongodb 的测试文件
const md5=require('blueimp-md5') //MD5给密码加密
//1. 连接数据库
//1.1. 引入 mongoose
const mongoose = require('mongoose')
//1.2. 连接指定数据库 (URL 只有数据库是变化的 )
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
//1.3. 获取连接对象
const conn = mongoose.connection
//1.4. 绑定连接完成的监听 ( 用来提示连接成功 )
conn.on('connected' , function(){
    console.log('数据库连接成功')
})
//2. 得到对应特定集合的 Model
//2.1. 字义 Schema( 描述文档结构 )
const userSchema = mongoose.Schema({//指定文档结构：属性名属性值类型，是否必须，默认值
    username :{type:String,required:true},
    password :{type:String,required:true},
    type :{type:String,required:true},//用户类型：大神或老板
    header:{type:String}
})
//2.2. 定义 Model( 与集合对应 , 可以操作集合 )
const UserModel =mongoose.model('user',userSchema)//集合名称users,userModel为构造函数
// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
// 3.1. 通过 Model 实例的 save() 添加数据
function testSave(){
    //创建一个UserModel实例
   const userModel = new UserModel({username:'Bob',password:md5('234'),type:'laoban'})
   userModel.save(function(error,userDoc){//回调函数返回一个文档doc，命名为userDoc
    console.log('save()',error,userDoc)//打印输出error和userDoc
   })
}
testSave()
// 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
function testFind(){//得到所有匹配文档对象的数组，没有就是[]
    UserModel.find(function(error , users){
        console.log('find()',error,users)
    })
    //查询一个
    UserModel.findOne({_id:'61c1d6c01c30a53a701fdccf'},function(error,users){//得到匹配的文档对象，没有就是null
        console.log('findOne()',error,users)
    })
}
testFind()

// 3.3. 通过 Model（函数对象） 的 findByIdAndUpdate() 更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'61c1d6c01c30a53a701fdccf'},
    {username:'jack'},
    function(error,oldUser){   
        console.log('update()',error,oldUser)//返回的是过去的user数组，实际已经修改完成
})   
}
testUpdate()
// 3.4. 通过 Model 的 remove() 删除匹配的数据
function testDelete(){
    UserModel.remove({_id:'61c1d6c01c30a53a701fdccf'},function(error,users){
        console.log('remove()',error,users)})
        //返回结果remove() null { n: 1, ok: 1, deletedCount: 1 }，更新和删除以查询为前提，ok为1表示删除成功，n表示删除的数量
}
testDelete()