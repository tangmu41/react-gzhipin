//老板主界面路由容器组件
import React,{Component} from "react";
import { connect } from "react-redux";
import UserList from "../../components/user-list/user-list";
import {getUserList} from '../../redux/actions'
class Laoban extends Component{
    //获取userlist，做操作(点按钮）显示用回调函数，初始化显示就写在compinentDidMount()
    componentDidMount(){
        this.props.getUserList('dashen')
    }
    render(){
        return (
           <UserList userList={this.props.userList}/>
        )
    }
}
export default connect(
    state=>({userList:state.userList}),{getUserList}
)(Laoban)