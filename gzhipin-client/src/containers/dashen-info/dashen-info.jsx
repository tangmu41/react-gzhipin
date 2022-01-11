import React,{Component} from 'react';
//包装生成容器组件
import {connect}  from 'react-redux';
//自动重定向路由路径
import { Redirect } from 'react-router-dom';
import {NavBar,InputItem, TextareaItem,Button} from 'antd-mobile';
//与后台交互，发送请求，必然会引入一个异步action
import {updateUser} from '../../redux/actions'
import HeaderSelector from '../../components/header-selector/header-selector';
class DashenInfo extends Component{
    state = {
        header: '', // 头像名称
        info: '', // 个人简介
        post: '', // 职位名称

    }
    setHeader=(header)=>{
        this.setState({header})
    }
    handleChange=(name,value)=>{
        this.setState({
            [name]:value
        })
    }
    save=()=>{
        this.props.updateUser(this.state)
    }
    render(){
        const {header,type}=this.props.user
        if(header){
            const path=type==='dashen'?'/dashen':'/laoban'
            return <Redirect to={path}></Redirect>
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                 <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='请输入求职岗位'  onChange={val=>{this.handleChange('post',val)}}>求职岗位:</InputItem>
                <TextareaItem title="个人介绍:" rows={3}  onChange={val=>{this.handleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {updateUser}
)(DashenInfo)