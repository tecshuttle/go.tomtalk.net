import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import {Layout} from 'antd';
import {MemoEdit} from "./edit";
import {BlogShow} from "./blogshow";
import {MemoList} from "./list";

const {Header, Footer} = Layout;

export default class Memo extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/category">分类</Link>
                </Header>

                <Route exact path={`${this.props.match.url}`} component={MemoList}/>
                <Route exact path={`${this.props.match.url}/new`} component={MemoEdit}/>
                <Route exact path={`${this.props.match.url}/edit/:id`} component={MemoEdit}/>
                <Route exact path={`${this.props.match.url}/blog/:id`} component={BlogShow}/>

                <Footer>footer</Footer>
            </Layout>
        )
    }
}
