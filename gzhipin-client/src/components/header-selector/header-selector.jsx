import React, { Component } from 'react';
//包装生成容器组件
import { List, Grid } from 'antd-mobile';
import propTypes from 'prop-types';

export default class HeaderSelector extends Component {
    static propTypes = {
        setHeader: propTypes.func.isRequired
    }
    //创建HeaderSelector的具体实例
    constructor(props) {
        //调用父类的构造方法
        super(props)
        //准备需要显示的列表数据
        this.headerList = []
        for (let i = 0; i < 20; i++) {
            this.headerList.push({
                text: "头像" + (i + 1),
                icon: require(`../../assets/images/头像${i + 1}.png`)//不能使用import
            })
        }
    }
    //初始图片状态
    state = {
        icon: null,
    }
    //el 数组的某个元素，点击的那个元素，这个元素是对象类型，这个对象有{text，icon}
    headerClick = ({ text, icon }) => {
        //更新当前组件状态
        this.setState({ icon })
        //调用函数更新父组件状态（需要头像名称）
        this.props.setHeader(text)

    }
    render() {
        //渲染头部界面
        const { icon } = this.state
        const listHeader = !icon ? '请选择头像' : (
            <div>
                已选择头像:<img src={icon} alt='header' />
            </div>
        )
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headerList} columnNum={5} onClick={this.headerClick}></Grid>
            </List>
        )
    }
}
