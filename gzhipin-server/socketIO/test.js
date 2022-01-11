// //类型模块包括函数类型模块和对象类型模块，这个是函数类型模块
// module.exports = function (server) {
//     // 得到 IO 对象
//     const io = require('socket.io')(server)//server是服务器
//     // 监视连接 ( 当有一个客户连接上时回调 )on绑定通用的监听
//     io.on('connection', function (socket) {
//         console.log('soketio connected')
//         // 绑定 sendMsg 监听 , 接收客户端发送的消息 on针对当前与你连接得某一个服务器
//         socket.on('sendMsg', function (data) {
//             console.log(' 服务器接收到浏览器的消息', data)
//             // 向客户端发送消息 ( 名称 , 数据 )emit分发，socket连接客户端和服务器，为连接对象
//             io.emit('receiveMsg', data.name + '_' + data.date)//发送给所有连接上服务器的客户端
//             //socket.emit('receiveMsg', data.name + '_' + data.date)  发送给当前socket对应的客户端
//             console.log(' 服务器向浏览器发送消息', data)
//         })
//     })
// }
module.exports=function(server){
    const io=require('socket.io')(server,{cors:true})
    //监视客户端与服务器的连接
    io.on('connection', function (socket) {
        console.log('有一个客户端连接了服务器')
        socket.on('sendMsg',function(data){
            console.log('服务器接收到客户端发送的消息',data)
            //处理数据
            data.name=data.name.toUpperCase()
            //服务端向客户端发送消息
            socket.emit('receiveMsg',data)
            console.log('服务器向客户端发送消息',data)
        })
    })
}
