import { combineReducers } from "redux";
import { INCREMENT,DECREMENT,ADD_MSG } from "./action-type";
//管理count
const initCount=0
function count (state=initCount,action){
    switch(action.type){
        case INCREMENT:
            return state+action.data
        case DECREMENT:
            return state-action.data 
        default:
        return state
    }

}
//管理Msgs
const initMsgs=[]
function msgs (state=initMsgs,action){
    switch(action.type){
        case ADD_MSG:
            return [action.data,...state] //不能去直接改原有的状态
        default:
        return state
    }

}
export default combineReducers({  //使用combineReducers将所有的状态存入对象中，｛count：2，msgs:['xxx','yyy']｝
    count,  
    msgs
})
