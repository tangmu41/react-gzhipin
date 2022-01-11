const {ChatModel} = require('../db/models')
module.exports=function(server){
    const io=require('socket.io')(server,{allowEIO3: true, cors:{origin: 'http://localhost:3000',methods: ['GET','POST']}})
    //监视客户端与服务器的连接  
    io.on('connection', function (socket) {
        console.log('有一个客户端连接了服务器')
        socket.on('sendMsg',function({from,to,content}){
            console.log('服务器接收到客户端发送的消息',{from,to,content})
            //处理数据（保存）
            //1.准备chatmsg对象的相关数据(对from,to进行排序，使得无论from和to在前在后，chat_id都是一致的)
            const chat_id=[from,to].sort().join('_')
            const create_time=Date.now()
            new ChatModel({from,to,content,chat_id,create_time}).save(function(error,chatMsg){
                  // 向所有连接上的客户端发消息
                  //这里的chatMsg的值是undefined呀，前端当然会报错8
                  console.log(chatMsg.content+"ys------------------1919")
                 io.emit('receiveMsg', chatMsg)
            })

        })
    })
}
