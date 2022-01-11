import React,{Component} from "react";
import {TabBar} from 'antd-mobile';
//接收main传过来的函数，声明Proptypes
import PropTypes from "prop-types";
//希望在非路由组件中使用路由库的api,使用withRoute()
import {withRouter} from 'react-router-dom'
const Item=TabBar.Item
class NavFooter extends Component{
    //固定写法
    static propTypes={
        //navList是数组array类型
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render(){
        let {navList,unReadCount}=this.props;
        //filter(function(index))  为集合中的每个元素规定要运行的函数。如果返回 true，则保留元素，否则元素将被移除。
        navList=navList.filter(nav=>!nav.hide)
        const path=this.props.location.pathname
        return (
           <TabBar>
               {
                   navList.map((nav,index)=>(
                       //有自己标识则用自己标识，没有则用index
                    <Item key={nav.path}
                    badge={nav.path==='/message' ?unReadCount:0}
                    title={nav.text}
                    //外{}表示要写js,内表示一个对象,require动态加载一个东西
                    icon={{uri:require(`./images/${nav.icon}.png`)}}
                    selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                    selected={path===nav.path}
                    //按下切换路由 replace()不用回退
                    onPress={()=>{this.props.history.replace(nav.path)}}/>
                   ))
               }
              
           </TabBar>

        )
    }
}
//外暴露withRouter()包装的组件，使组件获得location，history，math等路由组件特有属性
export default withRouter(NavFooter)