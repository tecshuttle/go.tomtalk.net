import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import Reducer from './Reducer'
import Memo from './Memo'
import Category from './Category'

const Home = () => (
    <div>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/memo">Memo</Link></li>
            <li><Link to="/category">分类</Link></li>
        </ul>
    </div>
);

let store = createStore(
    Reducer,
    compose(
        applyMiddleware(thunkMiddleware),// 允许我们 dispatch() 函数
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

const App = () => (
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/memo" component={Memo}/>
                <Route path="/category" component={Category}/>
            </div>
        </Router>
    </Provider>
);

export default App