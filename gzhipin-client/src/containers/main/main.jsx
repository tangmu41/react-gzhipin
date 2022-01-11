import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';//可以操作前端cookie的对象  set()/remove()
//包装生成容器组件
import { connect } from 'react-redux';
import {NavBar} from 'antd-mobile';
//公共工具
import { getRedirectTo } from '../../utils';
import { getUser } from '../../redux/actions'
import LaobanInfo from '../laoban-info/laoban-info';
import DashenInfo from '../dashen-info/dashen-info';
import Dashen from '../dashen/dashen';
import Laoban from '../laoban/laoban';
import Message from '../message/message';
import Personal from '../personal/personal';
import NotFound from '../../components/not-found/not-found';
import NavFooter from '../../components/nav-footer/nav-footer';
import Chat from '../chat/chat';
class Main extends Component {
    // 给组件对象添加属性
    navList = [
        {
            path: '/laoban', // 路由路径
            component: Laoban,
            title: ' 大神列表',
            icon: 'dashen',
            text: ' 大神',
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: ' 老板列表',
            icon: 'laoban',
            text: ' 老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: ' 消息列表',
            icon: 'message',
            text: ' 消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: ' 用户中心',
            icon: 'personal',
            text: ' 个人',
        }
    ]
    componentDidMount() {
        //登陆过（cookie中有userid）但没有登陆（redux管理user中没有——id），发送请求获取对应的user
        const userid = Cookies.get('userid');
        const { _id } = this.props.user;
        if (userid && !_id) {
            //发送异步请求，获取user
            this.props.getUser()
        }
    }
    render() {
        //读取cookie中的userid
        const userid = Cookies.get('userid')
        //判断userid是否有值
        if (!userid) {//没值回到登陆页面
            return <Redirect to='/login' />
        }//有，读取redux中user的状态
        const { user,unReadCount } = this.props
        //检查用户是否登录
        if (!user._id) {//判断user有没有id，没有返回null
            return null
        } else {//id有值，再根据user的type和header来计算一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname
            if (path === '/') {
                path = getRedirectTo(user.type, user.header)
                return <Redirect to={path} />
            }
        }
        const {navList}=this;
        //当路由组件时，有location属性   路由组件用法：<Route path='' component={}></Route>
        const path=this.props.location.pathname
        const currentNev=navList.find(nav=>nav.path===path)
        //通过判断type来对路径进行隐藏
        if(currentNev){//判断路径
            if(user.type==='laoban'){
                navList[1].hide=true //hide用来快速查找某个路径是否隐藏，为true隐藏，为false不隐藏
            }else{
                navList[0].hide=true
            }
        }
        return (
            <div>
                {currentNev ? <NavBar  className='stick-top'>{currentNev.title}</NavBar>:null}
                <Switch>
                    {
                        navList.map((nav,index)=> <Route key={index} path={nav.path} component={nav.component}/>)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNev?< NavFooter navList={navList} unReadCount={unReadCount} />:null}
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user ,unReadCount:state.chat.unReadCount}),
    { getUser }//将getuser传进来，使main组件有getuser函数属性
)(Main)

/*
1. 实现自动登陆:
  1. componentDidMount()
    登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user:
  2. render()
    1). 如果cookie中没有userid, 直接重定向到login
    2). 判断redux管理的user中是否有_id, 如果没有, 暂时不做任何显示
    3). 如果有, 说明当前已经登陆, 显示对应的界面
    4). 如果请求根路径: 根据user的type和header来计算出一个重定向的路由路径, 并自动重定向
 */