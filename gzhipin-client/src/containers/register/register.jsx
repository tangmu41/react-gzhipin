import React,{Component} from 'react';
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Radio,Button} from 'antd-mobile';
//包装生成容器组件
import {connect}  from 'react-redux'
//自动重定向路由路径
import { Redirect } from 'react-router-dom'; 
import {register} from '../../redux/actions'
import Logo from '../../components/logo/logo'
const ListItem=List.Item
class Register extends Component{
    state={
        username:'',
        password:'',
        password2:'',
        type:'laoban',
    }
    //点击注册调用
    register=()=>{
     this.props.register(this.state)
    }
    handleChange=(name,val)=>{
         this.setState({
             //[]使属性名不是name，而是name变量的值
            [name]:val
         })
    }
    toLogin=()=>{
        this.props.history.replace('/login')
    }
    render(){
        const {type}=this.state
        const {msg,redirectTo}=this.props.user
        //如果redirectTo有值，需要重定向到指定路径中去
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg?<div className='error-msg'>{msg}</div>:null}
                        <WhiteSpace/>
                        {/* onchange 点击时触发,效率更高一些，也可以用onclick */}
                        <InputItem placeholder='请输入用户名' onChange={val=>{this.handleChange('username',val)}}>用户名:</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='请输入密码' type="password" onChange={val=>{this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='请确认密码' type="password" onChange={val=>{this.handleChange('password2',val)}}>确认密码:</InputItem>
                        <WhiteSpace/>
                        <ListItem>
                            <span>用户类型:</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
                        </ListItem>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.register}>注 &nbsp; &nbsp;册</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {register}
)(Register)