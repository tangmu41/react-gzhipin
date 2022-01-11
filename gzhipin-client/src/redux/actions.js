//包含多个action creator
//异步的action
//同步的action
import io from 'socket.io-client'
import { 
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER, 
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
  } from './action-types'
import { 
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser, 
  reqUserList,
  reqChatMsgList,
  reqReadMsg
  } from '../api/index'
 
  //封装消息列表的异步函数
  async function getMsgList(dispatch,userid) {
    initIo(dispatch,userid)
      const response=await reqChatMsgList()
      const result=response.data
      if(result.code===0){
        const {users,chatMsgs}=result.data
        //分发同步action
        dispatch(receiveMsgList({users,chatMsgs,userid}))
      }
  }
    //发送消息的异步action
    export const sendMsg = ({from,to,content})=>{
      return dispatch=>{
        // 单列对象，socket只会产生一个   1.创建对象（判断对象是否已经存在，不存在才去创建）2.创建对象后，保存数据
      io.socket.emit('sendMsg',{from,to,content})
      }
    }
    function initIo(dispatch,userid) {
      if(!io.socket){
         //io是个函数,连接服务器
        io.socket=io('ws://localhost:4000')
        //绑定监听，接受服务端发送的消息
        io.socket.on('receiveMsg',function(chatMsg){
          console.log('客户端接受服务器发送的消息',chatMsg)
        //只要当chatMsg是与当前用户相关信息，才会分发同步·action保存新消息
        // if(chatMsg!==undefined){
          if(userid===chatMsg.from || userid===chatMsg.to){
            console.log(chatMsg.to)
            dispatch(receiveMsg(chatMsg,userid))
          }
        // }
      })
      }
    }
    //读取消息的异步action
    export const readMsg=(from,to)=>{
      return async dispatch=>{
        const response=await reqReadMsg(from)
        const result=response.data
        if(result.code===0){
          const count=result.data
          dispatch(msgRead({count,from,to}))
        }
      }
    }
//授权成功的同步action
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user })
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg })
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user })
export const resetUser = (msg) => ({ type: RESET_USER, data: msg })
 const receiveUserList = (userList) => ({ type: RECEIVE_USER_LIST, data: userList })
 const receiveMsgList=({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//接受一个消息的同步action
const receiveMsg=(chatMsg,userid)=>({type: RECEIVE_MSG,data: {chatMsg,userid}})
//读取某个目标消息的同步action
const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})
//注册异步action
export const register = (user) => {
  const { username, password, password2, type } = user
  //表单的前台验证，如果不通过返回一个errormsg的同步action
  if (!username) {
    return errorMsg('用户名必须指定!')
  } else if (password !== password2) {
    return errorMsg('两次密码必须一致!')
  }
  //表单注册合法，返回一个发送Ajax请求的异步action
  return async dispatch => {
    //发送异步Ajax请求
    const response = await reqRegister({ username, password, type })
    const result = response.data
    if (result.code === 0) {//成功，分发授权成功的同步action
      getMsgList(dispatch,result.data._id)
      dispatch(authSuccess(result.data))
    } else {//失败，分发授权失败的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}
//登录异步action
export const login = (user) => {
  const { username, password } = user
  //表单的前台验证，如果不通过返回一个errormsg的同步action
  if (!username) {
    return errorMsg('用户名必须指定!')
  } else if (!password) {
    return errorMsg('密码必须指定!')
  }
  //表单注册合法，返回一个发送Ajax请求的异步action
  return async dispatch => {
    //发送异步Ajax请求
    const response = await reqLogin(user)
    const result = response.data
    if (result.code === 0) {//成功，分发授权成功的同步action
      getMsgList(dispatch, result.data._id)
      dispatch(authSuccess(result.data))
    } else {//失败，分发授权失败的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}
//更新用户异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user);
    const result = response.data;
    if (result.code === 0) {//更新成功的data
      dispatch(receiveUser(result.data))
    } else {//更新失败的msg
      dispatch(resetUser(result.msg));
    }
  }
}
//获取用户异步action
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {//更新成功的data
      getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else {//更新失败的msg
      dispatch(resetUser(result.msg));
    }
  }
}
//获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data
    if (result.code === 0) {
      //分发一个同步action
      dispatch(receiveUserList(result.data))
    }
  }
}
