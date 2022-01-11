//包含多个action type 名称常量
export const AUTH_SUCCESS='auth_success'//注册/登陆成功
export const ERROR_MSG='error_msg'//错误提示信息
export const RECEIVE_USER='receive-user'//接收用户
export const RESET_USER='reset-user'//重置用户信息
//上操作的是user，下操作的是userlist，得重新写一个新的reducer
export const RECEIVE_USER_LIST='receive-user-list'//用户列表数据
export const RECEIVE_MSG_LIST='receive-msg-list'//接受消息列表
export const RECEIVE_MSG='receive-msg'//接受一条消息
export const MSG_READ='msg-read'//读取消息