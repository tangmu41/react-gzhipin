//消息主界面路由容器组件
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief
function getLastMsgs(chatMsgs,userid){
   // 1. 使用 {} 进行分组 (chat_id), 只保存每个组最后一条 msg: {chat_id1: lastMsg1, chat_id2:lastMsg2}
   const lastMsgObjs={}
   chatMsgs.forEach(msg => {
       //对msg进行个体的统计,msg发送给userid并且msg没有读
       if(msg.to=== userid &&!msg.read){
           msg.unReadCount=1
       }else{
        msg.unReadCount=0
       }
       const chatId=msg.chat_id
       const lastMsg=lastMsgObjs[chatId]
       
       // 判断当前 msg 对应的 lastMsg 是否存在
       if(!lastMsg){
        lastMsgObjs[chatId]=msg //当前msg就是所在组的lastmsg
       }else{
           //保存已经统计的未读数量
       const unReadCount=lastMsg.unReadCount+msg.unReadCount
       //判断消息时间
        if(msg.create_time>lastMsg.create_time){
            //如果msg比lastmsg晚，则把msg当做最后lastMsg
            lastMsgObjs[chatId]=msg
        }
        //将unreadcount保存在最新的lastMsg上
        lastMsgObjs[chatId].unReadCount=unReadCount
       }
   });
// 2. 得到所有分组的 lastMsg 组成数组 : Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
const lastMsgs= Object.values(lastMsgObjs)
// 3. 对数组排序 (create_time, 降序)如果结果小于0，将m1放在前面
lastMsgs.sort(function(m1,m2){
    return m2.create_time-m1.create_time
})
return lastMsgs
}
class Message extends Component {
    render() {
        const {user} =this.props
        const {users,chatMsgs}=this.props.chat
        //对chatMsgs按chat_id进行分组，取出最后一条信息
        const lastMsgs=getLastMsgs(chatMsgs,user._id)
        
        return (
            <List style={{ marginBottom: 50, marginTop: 50 }}>
                {
                    lastMsgs.map(msg=>{
                        const targetUserId=msg.to===user._id?msg.from:msg.to
                        const targetUser=users[targetUserId]
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount} />}
                                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`):null}
                                arrow='horizontal'
                                onClick={()=>this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                           </Item>
                           )
                    })
                }
            </List>
        )
    }
}
export default connect(
    state => ({user:state.user,chat:state.chat}), {}
)(Message)