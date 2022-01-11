/*
用户个人中心路由组件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Button,Modal } from 'antd-mobile'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief
class Personal extends Component {
    handleLogout=()=>{
        //modal是一个对象
        Modal.alert('退出','确认退出登录吗?',[
            {text:'取消'},
            {text:'确定', onPress:()=>{
                //退出登录，干掉cookie中的userID，redux管理的user回到初始状态
                Cookies.remove('userid')
                this.props.resetUser()//main组件中会检查
            }}
        ])
    }
    render() {
        const {username,info,header,company,post,salary}=this.props.user
        return (
            <div>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} style={{ width:60,marginTop:15  }}
                        alt="header" />}
                    title={username}
                    message={company} />
                <List renderHeader={() => ' 相关信息'}>
                    {/* multipleLine表示文本多行 */}
                    <Item multipleLine>
                        {/* 小文本信息展示 */}
                        <Brief>职位: {post}</Brief>
                        <Brief>简介: {info}</Brief>
                        {salary?<Brief>薪资: {salary}</Brief>:null}
                        
                    </Item>
                </List>
                {/* 空行隔开 */}
                <WhiteSpace />
                <List>
                    <Button type='warning' onClick={this.handleLogout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),{resetUser}
)(Personal)