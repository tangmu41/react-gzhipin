// 自定义redux库
// redux模块：对象
// 1.createStore(reducer)
// 使用：在store.js中createStore( reducers)
//   2.combineReducers(reducers)
//   使用：export default combineReducers({  count,  msgs}) 
//使用combineReducers将所有的状态存入对象中，｛count：2，msgs:['xxx','yyy']｝
//store对象：getState()   distapch(action)  subscribe(listener)