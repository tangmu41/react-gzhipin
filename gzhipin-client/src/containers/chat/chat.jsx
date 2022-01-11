/*
对话聊天的路由组件
*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile';
import { sendMsg ,readMsg} from '../../redux/actions';
const Item = List.Item
class Chat extends Component {
    state = {
        content: '',
        isShow: false
    }
    //生命周期回调函数，在第一次render时候回调
    componentWillMount() {
        //初始化表情列表数据
        const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
            '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚',
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
            '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚']
        this.emojis = emojis.map(emoji => ({ text: emoji }))
    }
    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentDidUpdate() {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight) 
    }
    componentWillUnmount(){//退出之前
         //发请求更新消息未读状态
         const from=this.props.match.params.userid
         const to=this.props.user._id
         this.props.readMsg(from,to)
    }
    // 切换表情列表的显示
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({ isShow })
        if (isShow) {
            // 异步手动派发 resize 事件,解决表情列表显示的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    }
    handleSend = () => {
        const from = this.props.user._id
        console.log(from)
        const to = this.props.match.params.userid
        console.log(to)
        const content = this.state.content.trim()
        console.log(content)
        //发送请求（发消息）
        if (content) {
            //需要异步action
            this.props.sendMsg({ from, to, content })
        }
        //清除输入数据
        this.setState({ content: '', isShow: false })
    }
    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        console.log(this.props.chat)
        //计算当前聊天的chatid
        const meId = user._id


        const targetId = this.props.match.params.userid
        if (!users[meId]) { //如果还没有获取到数据，就不作任何显示
            console.log(users[meId])
            return null
        }
        console.log(meId)
        const chatId = [meId, targetId].sort().join('_')
        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        //得到目标用户的header图片对像
        const targetHeader = users[targetId].header
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar icon={<Icon type='left' />}
                    onLeftClick={() => this.props.history.goBack()}
                    className='sticky-header'>{users[targetId].username}
                </NavBar>
                <List style={{ marginBottom: 50,marginTop: 50 }}>
                    {
                        msgs.map(msg => {
                            if (targetId === msg.from) {//对方发给我的
                                return (
                                    <Item key={msg._id}
                                        thumb={targetIcon}>
                                        {msg.content}
                                    </Item>)
                            } else {//我发给对方的
                                return (
                                    <Item key={msg._id}
                                        className='chat-me'
                                        extra=' 我' >
                                        {msg.content}
                                    </Item>)
                            }
                        })
                    }
                    
                </List>
                <div className='am-tab-bar'>
                    {/* 用value去读content的值，使content的值能够同步更新变化 */}
                    <InputItem placeholder=" 请输入"
                        //输入框获取焦点
                        onFocus={() => this.setState({ isShow: false })}
                        value={this.state.content}
                        onChange={val => this.setState({ content: val })}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} role='img' aria-label="愉快">😀</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        } />
                    {this.state.isShow ? (
                        <Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={(item) => {
                                this.setState({ content: this.state.content + item.text })
                            }} />
                    ) : null}
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }), { sendMsg,readMsg }
)(Chat)