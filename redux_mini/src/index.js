import React from 'react'
import ReactDOM from 'react-dom'
// import {Provider} from 'react-redux'
import {Provider} from './libs/react-redux'

import App from './containers/app'
import store from './redux/store'

ReactDOM.render((

  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'))

//ReactDOM render（<App store={store} />,document.getElementById('root')）
//监视store中的state变化,一旦变化自动调用回调函数重新渲染
//store。subscribe(function(){
// ReactDOM.render(< App store={store} />,document.getElementByUId('root'))
//})