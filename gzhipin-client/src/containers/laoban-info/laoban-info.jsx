// 老板信息完善路由容器组件
import React, { Component } from 'react';
//包装生成容器组件
import { connect } from 'react-redux';
//自动重定向路由路径
import { Redirect } from 'react-router-dom';
import { NavBar, InputItem, TextareaItem, Button } from 'antd-mobile';
import HeaderSelector from '../../components/header-selector/header-selector';
//与后台交互，发送请求，必然会引入一个异步action
import {updateUser} from '../../redux/actions'
class LaobanInfo extends Component {
    state = {
        header: '', // 头像名称
        info: '', // 职位简介
        post: '', // 职位名称
        company: '', // 公司名称
        salary: '' // 工资
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
    render() {
        const {header,type}=this.props.user
        if(header){
            const path=type==='dashen'?'/dashen':'/laoban'
            return <Redirect to={path}></Redirect>
        }
        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='请输入招聘职位' onChange={val=>{this.handleChange('post',val)}}>招聘职位:</InputItem>
                <InputItem placeholder='请输入公司名称' onChange={val=>{this.handleChange('company',val)}}>公司名称:</InputItem>
                <InputItem placeholder='请输入职位薪资' onChange={val=>{this.handleChange('salary',val)}}>职位薪资:</InputItem>
                <TextareaItem title="职位要求" rows={3}  onChange={val=>{this.handleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>

            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {updateUser}
)(LaobanInfo)