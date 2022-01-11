/*
包含多个用于生成新的 state 的 reducer 函数的模块
*/
import { AUTH_SUCCESS,
     ERROR_MSG, 
     RECEIVE_USER,
      RESET_USER ,
      RECEIVE_USER_LIST,
      RECEIVE_MSG_LIST,
      RECEIVE_MSG,
    MSG_READ} from './action-types';
import { combineReducers } from 'redux';
import { getRedirectTo } from '../utils'
const initUser = {
    username: '',
    type: '',
    msg: '',
    redirectTo: ''//需要自动重定向路由路径，跳转到某页面
}
//产生user状态的reducer，给state指定初始值
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:  //data是user
            const { type, header } = action.data
            return { ...action.data, redirectTo: getRedirectTo(type, header) }  //用action.data将原来的state覆盖掉
        case ERROR_MSG://data是msg
            return { ...state, msg: action.data }
        case RECEIVE_USER:  //data是user
            return action.data
        case RESET_USER://data是msg,通过initUser清除id，回到登陆界面去
            return { ...initUser, msg: action.data }
        default:
            return state
    }
}
const initUserList=[]
function userList(state = initUserList, action) {
    //type为同步的action中的
    switch (action.type) {
        case RECEIVE_USER_LIST:
           return action.data //data为userlist
        default:
            return state
    }
}
//产生聊天状态的reducer
const initChat={
    users:{},//所有用户信息的对象，属性名userid，属性值；｛username,header｝
    chatMsgs:[],
    unReadCount:0  //总未读数量
}

function chat(state=initChat,action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST://data;{users,chatMsgs}
            const {users,chatMsgs,userid}=action.data
        return  {
            users,
            chatMsgs,
            unReadCount:chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.read&&msg.to===userid?1:0),0)

        }
        case RECEIVE_MSG: //data:chatMsg\
        const {chatMsg}=action.data
            return {
                users:state.users,//原来的
                chatMsgs:[...state.chatMsgs,chatMsg],//在不改变原来chatMsgs,创建一个新的数组，遍历原来chatmsgs的同时将chatMsg存进去
                unReadCount: state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            }
            case MSG_READ:
                const {count,from,to}=action.data
                return {
                    users:state.users,//原来的
                    chatMsgs:state.chatMsgs.map(msg=>{
                        if(msg.from===from&&msg.to===to&&!msg.read){
                            return {...msg,read:true} //msg.read不能直接去修改它，所以通过...msg产生一个新的msg,并修改read值
                        }else{
                            return msg
                        }
                    }),
                    unReadCount:state.unReadCount-count
                }
        default:
            return state
    }
    
}
// 返回合并后的 reducer 函数
export default combineReducers({
    user,
    userList,
    chat
})
//向外暴露的状态结构：{xxx:0,yyy:0}