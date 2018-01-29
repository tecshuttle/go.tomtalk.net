import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import Reducer from './Reducer'
import Memo from './Memo'
import Category from './Category'
import Home from './Home'
import Todo from './Todo'
import Login from './Login'

let store = createStore(Reducer, getCompose());

function getCompose() {
    if (process.env.NODE_ENV === 'development') {
        return compose(
            applyMiddleware(thunkMiddleware), // 允许我们 dispatch() 函数
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    } else {
        return compose(
            applyMiddleware(thunkMiddleware) // 允许我们 dispatch() 函数
        )
    }
}

const App = () => (
    <Provider store={store}>
        <Router>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/memo" component={Memo}/>
                <Route path="/todo" component={Todo}/>
                <Route path="/category" component={Category}/>
                <Route path="/login" component={Login}/>
            </div>
        </Router>
    </Provider>
);

export default App