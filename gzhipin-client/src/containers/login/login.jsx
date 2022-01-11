import React,{Component} from 'react';
import {NavBar,WingBlank,List,InputItem,WhiteSpace,Button} from 'antd-mobile';
import Logo from '../../components/logo/logo'
//包装生成容器组件
import {connect}  from 'react-redux'
//自动重定向路由路径
import { Redirect } from 'react-router-dom';
import {login} from '../../redux/actions'
class Login extends Component{
    state={
        username:'',
        password:'',
    }
    login=()=>{
      this.props.login(this.state)
    }
    handleChange=(name,val)=>{
         this.setState({
             //[]使属性名不是name，而是name变量的值
            [name]:val
         })
    }
    toRegister=()=>{
        this.props.history.replace('/register')
    }
    render(){
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
                        <Button type="primary" onClick={this.login}>登 &nbsp; &nbsp;陆</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>还没有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {login}
)(Login)