import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import {Layout} from 'antd';
import {MemoMain} from "./memo-main";

const {Header, Footer} = Layout;

export default class Memo extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/todo" style={{marginRight: 50}}>Todo</Link>
                    <Link to="/category">分类</Link>
                </Header>

                <Route exact path={`${this.props.match.url}`} component={MemoMain}/>

                <Footer>footer</Footer>
            </Layout>
        )
    }
}
