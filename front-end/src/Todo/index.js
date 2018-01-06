import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Layout} from 'antd'

const {Header, Content, Footer} = Layout;
const styles = {
    link: {
        marginRight: 50
    }
};

export default class Todo extends Component {

    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={styles.link}>首页</Link>
                </Header>
                <Content> Todo </Content>
                <Footer> Footer </Footer>
            </Layout>
        )
    }
}
