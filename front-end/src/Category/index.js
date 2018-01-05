import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {Layout} from 'antd'
import {CategoryEdit} from './edit'
import {CategoryList} from './list'

const {Footer, Header} = Layout;


export default class Category extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/memo">Memo</Link>
                </Header>

                <Route eaact path={`${this.props.match.url}/edit/:typeId`} component={CategoryEdit}/>
                <Route exact path={`${this.props.match.url}/new`} component={CategoryEdit}/>
                <Route exact path={this.props.match.url} component={CategoryList}/>

                <Footer>footer</Footer>
            </Layout>
        )
    }
}

